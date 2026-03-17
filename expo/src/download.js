import { Platform } from 'react-native'
import { File, Directory, Paths } from 'expo-file-system'
import * as FileSystem from 'expo-file-system/legacy'
import { downloadToSaf } from '../modules/saf-helper'

const { StorageAccessFramework: SAF } = FileSystem

const LEDGER_KEY = 'download_ledger'

const readLedger = async () => {
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
    seriesName: bookInfo?.metadata?.seriesName,
    seriesNumber: bookInfo?.metadata?.seriesNumber ?? null,
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
    onProgress,
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
        const normalizedFileName = fileName.replace(/:/g, '_')
        const targetDirUri = await ensureSubdirectory(baseDirUri, subPath)

        const safUri = await SAF.createFileAsync(targetDirUri, normalizedFileName, 'application/octet-stream')
        await downloadToSaf(remoteUrl, safUri, headers, onProgress)

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
            const file = new File(entry.safUri)
            if (file.exists) file.delete()
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
        const file = new File(entry.safUri)
        if (file.exists) file.delete()
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