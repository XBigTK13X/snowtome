import Snow from 'expo-snowui'
import C from '../../common'

export default function BookListPage(props) {
    const { routes, apiClient } = C.useAppContext()
    const localParams = C.useLocalSearchParams()
    const [bookList, setBookList] = C.React.useState(null)

    C.React.useEffect(() => {
        if (!bookList) {
            apiClient.getBookList(localParams.seriesId).then((response) => {
                setBookList(response.content)
            })
        }
    })

    if (!bookList) {
        return <Snow.Text>Loading books from {localParams.seriesName}...</Snow.Text>
    }

    return (
        <Snow.View {...props}>
            <Snow.Label center>{localParams.seriesName}</Snow.Label>
            <Snow.Grid focusStart items={bookList} renderItem={(item) => {
                const thumbnail = apiClient.getBookThumbnail(item.id)
                let title = item.name
                const dashIndex = title.indexOf(' - ')
                if (dashIndex !== -1) {
                    title = item.name.substring(0, dashIndex)
                }
                return <Snow.ImageButton
                    overlayTitle
                    title={title}
                    imageSource={thumbnail}
                    onPress={routes.func(routes.bookDetails, { bookId: item.id })} />
            }} />
        </Snow.View>
    )
}
