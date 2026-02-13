import { routes } from './routes'

import LoginPage from './page/login'

import BookDetailsPage from './page/auth/book-details'
import LandingPage from './page/auth/landing'
import LibraryDetailsPage from './page/auth/library-details'
import LibraryListPage from './page/auth/library-list'
import SearchPage from './page/auth/search'
import SeriesDetailsPage from './page/auth/series-details'
import SeriesListPage from './page/auth/series-list'


export var pages = {
    [routes.login]: LoginPage,

    [routes.bookDetails]: BookDetailsPage,
    [routes.landing]: LandingPage,
    [routes.libraryDetails]: LibraryDetailsPage,
    [routes.libraryList]: LibraryListPage,
    [routes.search]: SearchPage,
    [routes.seriesDetails]: SeriesDetailsPage,
    [routes.seriesList]: SeriesListPage,
}


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning