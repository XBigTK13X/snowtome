import Snow from 'expo-snowui'
import C from '../../common'

export default function DownloadListPage() {
    const { navPush } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()

    const [downloads, setDownloads] = C.React.useState(null)

    C.React.useEffect(() => {
        C.download.getLedger().then((ledger) => {
            const sorted = Object.values(ledger).sort((a, b) => b.downloadedAt - a.downloadedAt)
            setDownloads(sorted)
        })
    }, [])

    if (!downloads) {
        return <Snow.Text>Loading downloads...</Snow.Text>
    }

    if (!downloads.length) {
        return <Snow.Label center>No downloaded books found.</Snow.Label>
    }

    return (
        <C.BookList
            getHeader={() => { return "Downloads" }}
            bookList={downloads}
        />
    )
}