import { routes } from './routes'
import LoginPage from './page/login'
import LibraryListPage from './page/auth/library-list'

export var pages = {
    [routes.login]: LoginPage,
    [routes.libraryList]: LibraryListPage
}


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning