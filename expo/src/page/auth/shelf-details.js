import Snow from 'expo-snowui'
import BookListPage from './template/book-list-page'

export default function ShelfDetailsPage(props) {
    return (
        <Snow.View {...props}>
            <BookListPage
                getHeader={(routeParams) => {
                    return `Books in shelf ${routeParams?.shelfName}`
                }}
                loadData={(bookloreClient, routeParams) => {
                    return bookloreClient.getBookListByShelfId(routeParams.shelfId)
                }}
            />
        </Snow.View>
    )
}
