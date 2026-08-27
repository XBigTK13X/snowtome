import Snow from 'expo-snowui'
import C from '../../common'

export default function BookDetailsPage(props) {
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
    const [fileKind, setFileKind] = C.React.useState(null)
    const fileKindRef = C.React.useRef(null)
    const [fileMime, setFileMime] = C.React.useState(null)
    const fileMimeRef = C.React.useRef(null)
    const [downloadProgress, setDownloadProgress] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getBookDetails(currentRoute.routeParams.bookId).then((response) => {
            const mimeTypes = {
                epub: 'application/epub+zip',
                pdf: 'application/pdf',
                cbz: 'application/x-cbz',
                cbr: 'application/x-cbr',
                mobi: 'application/x-mobipocket-ebook',
                azw3: 'application/x-mobi8-ebook',
            }
            const ext = response.primaryFile.filePath.split('.').pop().toLowerCase()
            setFileKind(ext)
            fileKindRef.current = ext
            const mime = mimeTypes[ext] ?? 'application/octet-stream'
            setFileMime(mime)
            fileMimeRef.current = mime
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

    const openBook = async (uri) => {
        try {
            await Snow.Download.openFile(uri, fileMimeRef.current)
        } catch (error) {
            console.error("Failed to open file:", error)
        }
    }

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
                    mimeType: fileMimeRef.current,
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
        // Implementation for read toggle
    }

    if (!bookInfo) {
        return <Snow.Text>Loading book details</Snow.Text>
    }

    let prettyPath = null
    if (localUri) {
        prettyPath = decodeURIComponent(localUri)
            .replace(decodeURIComponent(downloadDirectory || ''), 'SDCARD/')
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

    const downloadTitle = downloadProgress !== null
        ? `Downloading ${Math.round(downloadProgress * 100)}%`
        : 'Download'

    return (
        <Snow.View {...props}>
            <Snow.Grid focusStart >
                {localUri
                    ? <Snow.TextButton title="Open" onPress={() => openBook(localUri)} />
                    : <Snow.TextButton
                        title={downloadTitle}
                        disabled={downloadProgress !== null}
                        onPress={downloadBook}
                    />
                }
                {fileKindRef.current === 'cbz' || fileKindRef.current === 'cbr' ? (
                    <Snow.TextButton title="Read Online" onPress={navPush({
                        path: routes.bookRead,
                        params: {
                            bookId: currentRoute.routeParams.bookId
                        }
                    })} />
                ) : null}
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
            <Snow.Label center>{bookInfo.metadata.title}</Snow.Label>
            <Snow.Text center>by {bookInfo.metadata.authors?.at(0) ?? 'Unknown'}</Snow.Text>
            <Snow.Text center>{localUri ? `[${prettyPath}]` : 'This book is not yet downloaded'}</Snow.Text>

            {localUri && <Snow.Grid><Snow.TextButton title="Delete Local" onPress={deleteDownload} /></Snow.Grid>}
        </Snow.View>
    )
}