import BookListPage from './template/book-list-page'

export default function SeriesDetailsPage() {
    return (
        <BookListPage
            getHeader={(routeParams) => {
                return `Series - ${routeParams?.seriesName}`
            }}
            loadData={(bookloreClient, routeParams) => {
                return bookloreClient.getBookListBySeries(routeParams.seriesName)
            }}
        />
    )
}
