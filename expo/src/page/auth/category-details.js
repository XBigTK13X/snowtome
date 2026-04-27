import Snow from 'expo-snowui'
import BookListPage from './template/book-list-page'

export default function CategoryDetailsPage(props) {
    return (
        <Snow.View {...props}>
            <BookListPage
                getHeader={(routeParams) => {
                    return `Books in category ${routeParams?.categoryName}`
                }}
                loadData={(bookloreClient, routeParams) => {
                    return bookloreClient.getBookListByCategory(routeParams.categoryName)
                }}
            />
        </Snow.View>
    )
}
