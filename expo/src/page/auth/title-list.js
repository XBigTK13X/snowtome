import BookListPage from './template/book-list-page'

export default function TitleListPage() {
    return (
        <BookListPage
            loadData={(bookloreClient, routeParams) => {
                return bookloreClient.getBookListByTitle()
            }}
        />
    )
}
