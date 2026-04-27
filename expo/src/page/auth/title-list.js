import Snow from 'expo-snowui'
import BookListPage from './template/book-list-page'

export default function TitleListPage(props) {
    return (
        <Snow.View {...props}>
            <BookListPage
                loadData={(bookloreClient, routeParams) => {
                    return bookloreClient.getBookListByTitle()
                }}
            />
        </Snow.View>
    )
}
