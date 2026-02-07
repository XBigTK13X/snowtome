import { routes } from './routes'

import LoginPage from './page/login'

import LandingPage from './page/auth/landing'
import LibraryListPage from './page/auth/library-list'
import LibraryDetailsPage from './page/auth/library-details'
import SeriesListPage from './page/auth/series-list'
import SeriesDetailsPage from './page/auth/series-details'
import BookDetailsPage from './page/auth/book-details'

export var pages = {
    [routes.login]: LoginPage,

    [routes.landing]: LandingPage,
    [routes.libraryDetails]: LibraryDetailsPage,
    [routes.libraryList]: LibraryListPage,
    [routes.seriesList]: SeriesListPage,
    [routes.seriesDetails]: SeriesDetailsPage,
    [routes.bookDetails]: BookDetailsPage
}


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning