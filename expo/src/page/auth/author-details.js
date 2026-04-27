import Snow from 'expo-snowui'
import BookListPage from './template/book-list-page'

export default function AuthorDetailsPage(props) {
    return (
        <Snow.View {...props}>
            <BookListPage
                getHeader={(routeParams) => {
                    return `Books by ${routeParams.authorName}`
                }}
                loadData={(bookloreClient, routeParams) => {
                    return bookloreClient.getBookListByAuthor(routeParams.authorName)
                }}
            />
        </Snow.View>
    )
}
