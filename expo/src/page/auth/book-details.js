import Snow from 'expo-snowui'
import C from '../../common'
import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system/legacy';

const { StorageAccessFramework: SAF } = FileSystem

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

const downloadFile = async ({
    remoteUrl,
    token,
    fileName,
    downloadDirectory,
    updateDownloadDirectory,
    subPath,
    onComplete
}) => {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/octet-stream'
    }

    if (Platform.OS === 'web') {
        try {
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
        onComplete?.(safUri)
    } catch (error) {
        console.error("Download Error:", error)
    }
}

const getDestination = (bookInfo) => {
    let pathParts = bookInfo.filePath.split('.')
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
    return {
        fileName,
        subPath
    }
}

export default function BookDetailsPage() {
    const {
        bookloreClient,
        downloadDirectory,
        updateDownloadDirectory
    } = C.useAppContext()
    const { currentRoute } = Snow.useSnowContext()

    const [bookInfo, setBookInfo] = C.React.useState(null)
    const [localUri, setLocalUri] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getBookDetails(currentRoute.routeParams.bookId).then((response) => {
            setBookInfo(response)
        })
    }, [])

    C.React.useEffect(() => {
        if (!bookInfo || !downloadDirectory) return
        const { fileName, subPath } = getDestination(bookInfo)
        const normalizedFileName = fileName.replace(/:/g, '_')
        ensureSubdirectory(downloadDirectory, subPath).then((targetDirUri) => {
            SAF.readDirectoryAsync(targetDirUri).then((files) => {
                const found = files.find((uri) => decodeURIComponent(uri).endsWith(normalizedFileName))
                if (found) setLocalUri(found)
            }).catch(() => { })
        }).catch(() => { })
    }, [bookInfo, downloadDirectory])

    const openBook = (uri) => {
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: uri,
            flags: 1,
            type: 'application/epub+zip'
        })
    }

    const downloadBook = () => {
        const { fileName, subPath } = getDestination(bookInfo)
        bookloreClient.getBookContentUrl(currentRoute.routeParams.bookId)
            .then(response => {
                downloadFile({
                    remoteUrl: response.downloadUrl,
                    token: response.authToken,
                    fileName,
                    downloadDirectory,
                    updateDownloadDirectory,
                    subPath,
                    onComplete: (uri) => {
                        setLocalUri(uri)
                        openBook(uri)
                    }
                })
            })
    }

    const toggleRead = () => {

    }

    if (!bookInfo) {
        return <Snow.Text>Loading book details</Snow.Text>
    }

    const thumbnail = bookloreClient.getBookThumbnail(bookInfo.id)

    let prettyPath = null
    if (localUri) {
        prettyPath = `${decodeURIComponent(localUri).replace(decodeURIComponent(downloadDirectory), 'SDCARD/').replace(/\/document\/[^/]+:/, '')}`
    }

    return (
        <>
            <Snow.Grid>
                {localUri
                    ? <Snow.TextButton title="Open" onPress={() => openBook(localUri)} />
                    : <Snow.TextButton title="Download" onPress={downloadBook} />
                }
                <Snow.TextButton title="Mark Read" onPress={toggleRead} />
            </Snow.Grid>
            <Snow.Grid itemsPerRow={2}>
                <Snow.View>
                    <Snow.Label center>{bookInfo.metadata.title}</Snow.Label>
                    <Snow.Text center>by {bookInfo.metadata.authors?.at(0) ?? 'Unknown'}</Snow.Text>
                </Snow.View>
                {localUri
                    ? <Snow.ImageButton imageUrl={thumbnail} title="Open" onPress={() => openBook(localUri)} />
                    : <Snow.ImageButton imageUrl={thumbnail} title="Download" onPress={downloadBook} />
                }
            </Snow.Grid>

            <Snow.Text center>{localUri ? `[${prettyPath}]` : 'This book is not yet downloaded'}</Snow.Text>
        </>
    )

}