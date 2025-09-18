import C from '../../common'
export default function BookListPage() {
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
        return <C.SnowText>Loading books from {localParams.seriesName}...</C.SnowText>
    }

    return (
        <C.FillView>
            <C.SnowLabel center>{localParams.seriesName}</C.SnowLabel>
            <C.SnowGrid itemsPerRow={7} items={bookList} renderItem={(item) => {
                const thumbnail = apiClient.getBookThumbnail(item.id)
                let title = item.name
                const dashIndex = title.indexOf(' - ')
                if (dashIndex !== -1) {
                    title = item.name.substring(0, dashIndex)
                }
                return <C.SnowImageButton
                    title={title}
                    imageSource={thumbnail}
                    onPress={routes.func(routes.bookDetails, { bookId: item.id })} />
            }} />
        </C.FillView>
    )
}
