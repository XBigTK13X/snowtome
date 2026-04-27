import Snow from 'expo-snowui'
import BookListPage from './template/book-list-page'

export default function SeriesDetailsPage(props) {
    return (
        <Snow.View {...props}>
            <BookListPage
                getHeader={(routeParams) => {
                    return `Series - ${routeParams?.seriesName}`
                }}
                loadData={(bookloreClient, routeParams) => {
                    return bookloreClient.getBookListBySeries(routeParams.seriesName)
                }}
            />
        </Snow.View>
    )
}
