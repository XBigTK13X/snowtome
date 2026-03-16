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

    if (!bookList) {
        return <Snow.Label center>Loading books...</Snow.Label>
    }

    return (
        <C.BookList
            bookList={bookList}
            getHeader={props.getHeader}
        />
    )
}
