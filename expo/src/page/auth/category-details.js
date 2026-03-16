import BookListPage from './template/book-list-page'

export default function SeriesDetailsPage() {
    return (
        <BookListPage
            loadData={(bookloreClient, routeParams) => {
                return bookloreClient.getBookListByCategory(routeParams.categoryName)
            }}
        />
    )
}
