import BookListPage from './template/book-list-page'

export default function CategoryDetailsPage() {
    return (
        <BookListPage
            getHeader={(routeParams) => {
                return `Books in category ${routeParams?.categoryName}`
            }}
            loadData={(bookloreClient, routeParams) => {
                return bookloreClient.getBookListByCategory(routeParams.categoryName)
            }}
        />
    )
}
