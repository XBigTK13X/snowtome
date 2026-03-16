import Snow from 'expo-snowui'
import { Platform } from 'react-native'
import { File, Paths } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';

const { StorageAccessFramework: SAF } = FileSystem

const LEDGER_KEY = 'download_ledger'

const readLedger = async () => {
    const FileSystemLegacy = await import('expo-file-system/legacy')
    const ledgerFile = new File(Paths.cache, `${LEDGER_KEY}.json`)
    if (!ledgerFile.exists) return {}
    try {
        return JSON.parse(ledgerFile.textSync())
    } catch {
        return {}
    }
}

const writeLedger = async (ledger) => {
    const ledgerFile = new File(Paths.cache, `${LEDGER_KEY}.json`)
    ledgerFile.write(JSON.stringify(ledger))
}

const ensureSubdirectory = async (baseDirUri, subPath) => {
    if (!subPath) return baseDirUri

    const segments = subPath.split('/').filter((s) => s.length > 0)
    let currentUri = baseDirUri

    for (const segment of segments) {
        const items = await SAF.readDirectoryAsync(currentUri)
        const existing = items.find((uri) => uri.endsWith('%2F' + encodeURIComponent(segment)) || uri.endsWith('/' + segment))

        if (existing) {
            currentUri = existing
        } else {
            currentUri = await SAF.makeDirectoryAsync(currentUri, segment)
        }
    }

    return currentUri
}

const getDestination = (bookInfo) => {
    const pathParts = bookInfo.primaryFile.filePath.split('.')
    let fileName = ''
    let subPath = `${bookInfo.libraryName}`
    if (bookInfo.metadata?.seriesName) {
        subPath = `${bookInfo.libraryName}/${bookInfo.metadata.seriesName}`
        if (bookInfo.metadata?.seriesNumber) {
            fileName = `${bookInfo.metadata.seriesNumber} - `
        } else {
            fileName = `${bookInfo.metadata.publishedDate} - `
        }
    } else {
        if (bookInfo.metadata?.authors?.length) {
            subPath += `/${bookInfo.metadata.authors.at(0)}`
        }
    }
    fileName += `${bookInfo.metadata?.title} - `
    fileName += `${bookInfo.metadata?.authors?.at(0)}`
    fileName += `.${pathParts.at(-1)}`
    return { fileName, subPath }
}

const getLedger = async () => {
    return await readLedger()
}

const makeLedgerEntry = (bookInfo, safUri) => ({
    safUri,
    bookId: bookInfo.id,
    title: bookInfo.metadata?.title,
    libraryId: bookInfo.libraryId,
    libraryName: bookInfo.libraryName,
    bookKind: bookInfo.bookType,
    downloadedAt: Date.now()
})

const getLocalUri = async (bookInfo, downloadDirectory) => {
    const ledger = await readLedger()
    if (ledger[bookInfo.id]) return ledger[bookInfo.id].safUri

    if (!downloadDirectory) return null

    const { fileName, subPath } = getDestination(bookInfo)
    const normalizedFileName = fileName.replace(/:/g, '_')

    try {
        const targetDirUri = await ensureSubdirectory(downloadDirectory, subPath)
        const files = await SAF.readDirectoryAsync(targetDirUri)
        const found = files.find((uri) => decodeURIComponent(uri).endsWith(normalizedFileName))
        if (found) {
            const ledger = await readLedger()
            await writeLedger({ ...ledger, [bookInfo.id]: makeLedgerEntry(bookInfo, found) })
            return found
        }
    } catch { }

    return null
}

const downloadFile = async ({
    bookInfo,
    remoteUrl,
    token,
    downloadDirectory,
    updateDownloadDirectory,
    onComplete
}) => {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/octet-stream'
    }

    if (Platform.OS === 'web') {
        try {
            const { fileName } = getDestination(bookInfo)
            const response = await fetch(remoteUrl, { headers })
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Web Download Error:", error)
        }
        return
    }

    try {
        let baseDirUri = downloadDirectory ?? null

        if (!baseDirUri) {
            const permissions = await SAF.requestDirectoryPermissionsAsync()
            if (!permissions.granted) return
            baseDirUri = permissions.directoryUri
            updateDownloadDirectory(baseDirUri)
        }

        const { fileName, subPath } = getDestination(bookInfo)
        const targetDirUri = await ensureSubdirectory(baseDirUri, subPath)

        const response = await fetch(remoteUrl, { headers })
        if (!response.ok) {
            console.error("Download failed with status:", response.status)
            return
        }

        const buffer = await response.arrayBuffer()
        const bytes = new Uint8Array(buffer)

        const cachedFile = new File(Paths.cache, fileName)
        if (cachedFile.exists) cachedFile.delete()
        cachedFile.create()
        cachedFile.write(bytes)

        const safUri = await SAF.createFileAsync(targetDirUri, fileName, 'application/octet-stream')
        const base64 = await FileSystem.readAsStringAsync(cachedFile.uri, { encoding: FileSystem.EncodingType.Base64 })
        await FileSystem.writeAsStringAsync(safUri, base64, { encoding: FileSystem.EncodingType.Base64 })

        cachedFile.delete()

        const ledger = await readLedger()
        await writeLedger({ ...ledger, [bookInfo.id]: makeLedgerEntry(bookInfo, safUri) })

        onComplete?.(safUri)
    } catch (error) {
        console.error("Download Error:", error)
    }
}

const clearAll = async () => {
    const ledger = await readLedger()
    for (const entry of Object.values(ledger)) {
        try {
            await FileSystem.deleteAsync(entry.safUri)
        } catch { }
    }
    const ledgerFile = new File(Paths.cache, `${LEDGER_KEY}.json`)
    if (ledgerFile.exists) ledgerFile.delete()
}

const deleteEntry = async (bookId) => {
    const ledger = await readLedger()
    const entry = ledger[bookId]
    if (!entry) return
    try {
        await FileSystem.deleteAsync(entry.safUri)
    } catch { }
    const { [bookId]: _, ...rest } = ledger
    await writeLedger(rest)
}

export default {
    getLedger,
    getLocalUri,
    downloadFile,
    deleteEntry,
    clearAll
}