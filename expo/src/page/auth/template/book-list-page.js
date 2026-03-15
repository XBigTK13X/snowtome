import Snow from 'expo-snowui'
import C from '../../../common'

export default function BookListPage(props) {
    const { navPush, currentRoute } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [bookList, setBookList] = C.React.useState(null)

    C.React.useEffect(() => {
        if (bookloreClient.accessToken) {
            props.loadData(bookloreClient, currentRoute?.routeParams).then((response) => {
                setBookList(response)
            })
        }
    }, [bookloreClient])

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
