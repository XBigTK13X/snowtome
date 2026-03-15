import { routes } from './routes'

import LoginPage from './page/login'

import AuthorDetailsPage from './page/auth/author-details'
import AuthorListPage from './page/auth/author-list'
import BookDetailsPage from './page/auth/book-details'
import DownloadListPage from './page/auth/download-list'
import LandingPage from './page/auth/landing'
import LibraryDetailsPage from './page/auth/library-details'
import LibraryListPage from './page/auth/library-list'
import OptionsPage from './page/auth/options'
import SearchPage from './page/auth/search'
import SeriesDetailsPage from './page/auth/series-details'
import SeriesListPage from './page/auth/series-list'


export var pages = {
    [routes.login]: LoginPage,

    [routes.authorDetails]: AuthorDetailsPage,
    [routes.authorList]: AuthorListPage,
    [routes.bookDetails]: BookDetailsPage,
    [routes.downloadList]: DownloadListPage,
    [routes.landing]: LandingPage,
    [routes.libraryDetails]: LibraryDetailsPage,
    [routes.libraryList]: LibraryListPage,
    [routes.options]: OptionsPage,
    [routes.search]: SearchPage,
    [routes.seriesDetails]: SeriesDetailsPage,
    [routes.seriesList]: SeriesListPage,
}


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning