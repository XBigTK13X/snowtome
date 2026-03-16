import BookListPage from './template/book-list-page'

export default function AuthorDetailsPage() {
    return (
        <BookListPage
            getHeader={(routeParams) => {
                return `Books by ${routeParams.authorName}`
            }}
            loadData={(bookloreClient, routeParams) => {
                return bookloreClient.getBookListByAuthor(routeParams.authorName)
            }}
        />
    )
}
