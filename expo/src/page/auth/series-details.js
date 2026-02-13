import Snow from 'expo-snowui'
import C from '../../common'

export default function LibraryDetailsPage() {
    const { navPush, currentRoute } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [bookList, setBookList] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getBookListBySeries(currentRoute?.routeParams?.seriesName).then((response) => {
            setBookList(response)
        })
    }, [])

    if (!bookList) {
        return <Snow.Text>Loading books in {currentRoute?.routeParams?.libraryName}...</Snow.Text>
    }

    return (
        <>
            <Snow.Label center>Books [{bookList?.length}]</Snow.Label>
            <Snow.Grid itemsPerRow={4} items={bookList} renderItem={(item) => {
                const thumbnail = bookloreClient.getBookThumbnail(item.id)
                return <Snow.ImageButton
                    title={item?.metadata?.title}
                    imageUrl={thumbnail}
                    onPress={navPush({
                        path: routes.bookDetails,
                        params: {
                            libraryId: item.libraryId,
                            libraryName: item.libraryName,
                            bookId: item.id,
                            bookName: item.metadata?.title,
                            bookKind: item.bookType
                        }
                    })} />
            }} />
        </>
    )
}
