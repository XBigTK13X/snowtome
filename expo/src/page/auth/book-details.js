import C from '../../common'
import { ReactReader } from 'react-reader'

export default function BookDetailsPage() {
    const { bookloreClient } = C.useAppContext()
    const { currentRoute } = C.useSnowContext()

    const [bookInfo, setBookInfo] = C.React.useState(null)
    const [bookContent, setBookContent] = C.React.useState(null)
    const [location, setLocation] = C.React.useState(0)

    C.React.useEffect(() => {
        bookloreClient.getBookDetails(currentRoute.routeParams.bookId).then((response) => {
            setBookInfo(response)
            return bookloreClient.getBookContent(currentRoute.routeParams.bookId)
        }).then((response) => {
            setBookContent(response)
        })
    }, [])

    if (!bookInfo || !bookContent) {
        return <C.SnowText>Loading book details</C.SnowText>
    }

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <ReactReader
                url={bookContent}
                location={location}
                locationChanged={(epubcfi) => setLocation(epubcfi)}
                epubInitOptions={{ openAs: "binary" }}
            />
        </div>
    )

}
