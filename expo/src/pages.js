import { routes } from './routes'
import LoginPage from './page/login'
import LibraryListPage from './page/auth/library-list'
import LibraryDetailsPage from './page/auth/library-details'

export var pages = {
    [routes.login]: LoginPage,
    [routes.libraryDetails]: LibraryDetailsPage,
    [routes.libraryList]: LibraryListPage
}


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning