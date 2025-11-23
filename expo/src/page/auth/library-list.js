import C from '../../common'
export default function LibraryListPage() {
    const { routes, apiClient } = C.useAppContext()
    const { routeParams } = C.useSnowContext()
    const [bookList, setBookList] = C.React.useState(null)

    C.React.useEffect(() => {
        if (!bookList) {
            apiClient.getBookList(routeParams.seriesId).then((response) => {
                setBookList(response.content)
            })
        }
    })

    if (!bookList) {
        return <C.SnowText>Loading books from {routeParams.seriesName}...</C.SnowText>
    }

    return (
        <>
            <C.SnowText>Testing It</C.SnowText>
            <C.SnowLabel center>{routeParams.seriesName}</C.SnowLabel>
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
        </>
    )
}
