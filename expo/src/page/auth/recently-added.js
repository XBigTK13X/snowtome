import Snow from 'expo-snowui'
import BookListPage from './template/book-list-page'

export default function RecentlyAddedPage(props) {
    return (
        <Snow.View {...props}>
            <BookListPage
                getHeader={(routeParams) => {
                    return `Recently Added`
                }}
                loadData={(bookloreClient, routeParams) => {
                    return bookloreClient.getBookListByRecentlyAdded()
                }}
            />
        </Snow.View>
    )
}
