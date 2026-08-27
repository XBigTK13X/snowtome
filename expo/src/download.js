import { Platform } from 'react-native'
import { File, Paths } from 'expo-file-system'
import Snow from 'expo-snowui'

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
    return null // Note: Manual SAF directory scanning omitted; reliant on ledger
}

const downloadFile = async ({
    bookInfo,
    remoteUrl,
    token, // Note: Native module doesn't take headers; backend must support query param auth
    downloadDirectory,
    updateDownloadDirectory,
    mimeType,
    onProgress,
    onComplete
}) => {
    if (Platform.OS === 'web') {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/octet-stream'
            }
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

    let progressSub = null
    try {
        let baseDirUri = downloadDirectory ?? null

        if (!baseDirUri) {
            baseDirUri = await Snow.Download.pickDirectory()
            if (!baseDirUri) return
            updateDownloadDirectory(baseDirUri)
        }

        const { fileName, subPath } = getDestination(bookInfo)
        const normalizedFileName = fileName.replace(/:/g, '_')
        const authUrl = remoteUrl.includes('?') ? `${remoteUrl}&token=${token}` : `${remoteUrl}?token=${token}`

        if (onProgress) {
            progressSub = Snow.Download.addProgressListener((event) => {
                onProgress(event.progress / 100) // Convert 0-100 to 0-1 scale
            })
        }

        const res = await Snow.Download.download({
            url: authUrl,
            fileName: normalizedFileName,
            isTemp: false,
            treeUri: baseDirUri,
            subDir: subPath,
            mimeType: mimeType || 'application/octet-stream',
            openAfterDownload: false
        })

        if (res && res.success) {
            const ledger = await readLedger()
            await writeLedger({ ...ledger, [bookInfo.id]: makeLedgerEntry(bookInfo, res.uri) })
            onComplete?.(res.uri)
        }
    } catch (error) {
        console.error("Download Error:", error)
    } finally {
        progressSub?.remove()
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