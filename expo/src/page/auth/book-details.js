import Snow from 'expo-snowui'
import C from '../../common'
import * as IntentLauncher from 'expo-intent-launcher';

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
        C.download.getLocalUri(bookInfo, downloadDirectory).then((uri) => {
            if (uri) setLocalUri(uri)
        })
    }, [bookInfo, downloadDirectory])

    const openBook = (uri) => {
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: uri,
            flags: 1,
            type: 'application/epub+zip'
        })
    }

    const downloadBook = () => {
        bookloreClient.getBookContentUrl(currentRoute.routeParams.bookId)
            .then(response => {
                C.download.downloadFile({
                    bookInfo,
                    remoteUrl: response.downloadUrl,
                    token: response.authToken,
                    downloadDirectory,
                    updateDownloadDirectory,
                    onComplete: (uri) => {
                        setLocalUri(uri)
                        openBook(uri)
                    }
                })
            })
    }

    const deleteDownload = async () => {
        await C.download.deleteEntry(bookInfo.id)
        setLocalUri(null)
    }

    const toggleRead = () => {

    }

    if (!bookInfo) {
        return <Snow.Text>Loading book details</Snow.Text>
    }

    const thumbnail = bookloreClient.getBookThumbnail(bookInfo.id)

    let prettyPath = null
    if (localUri) {
        prettyPath = decodeURIComponent(localUri)
            .replace(decodeURIComponent(downloadDirectory), 'SDCARD/')
            .replace(/\/document\/[^/]+:/, '')
    }

    return (
        <>
            <Snow.Grid>
                {localUri
                    ? <Snow.TextButton title="Open" onPress={() => openBook(localUri)} />
                    : <Snow.TextButton title="Download" onPress={downloadBook} />
                }
                <Snow.TextButton title="Mark Read" onPress={toggleRead} />
                {localUri && <Snow.TextButton title="Delete Local" onPress={deleteDownload} />}
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