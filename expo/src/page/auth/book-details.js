import Snow from 'expo-snowui'
import C from '../../common'
import * as IntentLauncher from 'expo-intent-launcher';

export default function BookDetailsPage() {
    const {
        bookloreClient,
        downloadDirectory,
        updateDownloadDirectory,
        routes
    } = C.useAppContext()
    const { currentRoute, navPush } = Snow.useSnowContext()

    const [bookInfo, setBookInfo] = C.React.useState(null)
    const bookInfoRef = C.React.useRef(null)
    const [localUri, setLocalUri] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getBookDetails(currentRoute.routeParams.bookId).then((response) => {
            setBookInfo(response)
        })
    }, [])

    C.React.useEffect(() => {
        if (!bookInfo || !downloadDirectory) return
        C.download.getLocalUri(bookInfo, downloadDirectory).then((uri) => {
            if (uri) setLocalUri(uri)
        })
    }, [bookInfo, downloadDirectory])

    C.React.useEffect(() => {
        bookInfoRef.current = bookInfo
    }, [bookInfo])

    const openBook = (uri) => {
        const mimeTypes = {
            epub: 'application/epub+zip',
            pdf: 'application/pdf',
            cbz: 'application/x-cbz',
            cbr: 'application/x-cbr',
            mobi: 'application/x-mobipocket-ebook',
            azw3: 'application/x-mobi8-ebook',
        }
        const ext = bookInfo.primaryFile.filePath.split('.').pop().toLowerCase()
        const type = mimeTypes[ext] ?? 'application/octet-stream'
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: uri,
            flags: 1,
            type
        })
    }

    const [downloadProgress, setDownloadProgress] = C.React.useState(null)

    const downloadBook = () => {
        bookloreClient.getBookContentUrl(currentRoute.routeParams.bookId)
            .then(response => {
                setDownloadProgress(0)
                C.download.downloadFile({
                    bookInfo: bookInfoRef.current,
                    remoteUrl: response.downloadUrl,
                    token: response.authToken,
                    downloadDirectory,
                    updateDownloadDirectory,
                    onProgress: setDownloadProgress,
                    onComplete: (uri) => {
                        setDownloadProgress(null)
                        setLocalUri(uri)
                    }
                })
            })
    }

    const deleteDownload = async () => {
        await C.download.deleteEntry(bookInfoRef.current.id)
        setLocalUri(null)
    }

    const toggleRead = () => {

    }

    if (!bookInfo) {
        return <Snow.Text>Loading book details</Snow.Text>
    }

    let prettyPath = null
    if (localUri) {
        prettyPath = decodeURIComponent(localUri)
            .replace(decodeURIComponent(downloadDirectory), 'SDCARD/')
            .replace(/\/document\/[^/]+:/, '')
    }

    let author = bookInfo?.metadata?.authors?.at(0) ?? null
    let series = bookInfo?.metadata?.seriesName ?? null
    let seriesTitle = series
    if (series) {
        let seriesNumber = bookInfo?.metadata?.seriesNumber ?? null
        if (seriesNumber) {
            seriesTitle = `${series} - #${seriesNumber}`
        }
    }

    const downloadTitle = downloadProgress ? `Downloading ${Math.round(downloadProgress * 100)}%` : 'Download'

    return (
        <>
            <Snow.Grid itemsPerRow={4}>
                {localUri
                    ? <Snow.TextButton title="Open" onPress={() => openBook(localUri)} />
                    : <Snow.TextButton
                        title={downloadTitle}
                        disabled={!!downloadProgress}
                        onPress={downloadBook}
                    />
                }
                <Snow.TextButton title="Mark Read" onPress={toggleRead} />
                {author ? <Snow.TextButton title={author} onPress={navPush({
                    path: routes.authorDetails,
                    params: {
                        authorName: author
                    }
                })} /> : null}
                {series ? <Snow.TextButton title={seriesTitle} onPress={navPush({
                    path: routes.seriesDetails,
                    params: {
                        seriesName: series
                    }
                })} /> : null}
            </Snow.Grid>
            <Snow.Grid itemsPerRow={4}>
                <Snow.View>
                    <Snow.Label center>{bookInfo.metadata.title}</Snow.Label>
                    <Snow.Text center>by {bookInfo.metadata.authors?.at(0) ?? 'Unknown'}</Snow.Text>
                </Snow.View>
            </Snow.Grid>
            <Snow.Text center>{localUri ? `[${prettyPath}]` : 'This book is not yet downloaded'}</Snow.Text>

            {localUri && <Snow.Grid><Snow.TextButton title="Delete Local" onPress={deleteDownload} /></Snow.Grid>}
        </>
    )
}