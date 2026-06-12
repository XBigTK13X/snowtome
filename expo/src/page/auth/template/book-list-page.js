import Snow from 'expo-snowui'
import C from '../../../common'

export default function BookListPage(props) {
    const { currentRoute } = Snow.useSnowContext()
    const { bookloreClient } = C.useAppContext()
    const [bookList, setBookList] = C.React.useState(null)

    C.React.useEffect(() => {
        if (bookloreClient.accessToken) {
            props.loadData(bookloreClient, currentRoute?.routeParams).then((response) => {
                setBookList(response)
            })
        }
    }, [bookloreClient])

    if (!bookList && bookList !== null) {
        return <Snow.Label center>Loading books...</Snow.Label>
    }

    if (!bookList?.length) {
        return <Snow.Label center>No books found</Snow.Label>
    }

    return (
        <Snow.View {...props}>
            <C.BookList
                focusStart
                bookList={bookList}
                getHeader={props.getHeader}
            />
        </Snow.View>
    )
}
