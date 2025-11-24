import { routes } from './routes'
import LoginPage from './page/login'
import LibraryListPage from './page/auth/library-list'
import LibraryDetailsPage from './page/auth/library-details'
import BookDetailsPage from './page/auth/book-details'

export var pages = {
    [routes.login]: LoginPage,
    [routes.libraryDetails]: LibraryDetailsPage,
    [routes.libraryList]: LibraryListPage,
    [routes.bookDetails]: BookDetailsPage
}


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning