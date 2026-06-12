import { routes } from './routes'

import LoginPage from './page/login'

import AuthorDetailsPage from './page/auth/author-details'
import AuthorListPage from './page/auth/author-list'
import BookDetailsPage from './page/auth/book-details'
import BookReadPage from './page/auth/book-read'
import CategoryDetailsPage from './page/auth/category-details'
import DownloadListPage from './page/auth/download-list'
import FavoriteListPage from './page/auth/shelf-list'
import LandingPage from './page/auth/landing'
import LibraryDetailsPage from './page/auth/library-details'
import LibraryListPage from './page/auth/library-list'
import OptionsPage from './page/auth/options'
import SearchPage from './page/auth/search'
import SeriesDetailsPage from './page/auth/series-details'
import SeriesListPage from './page/auth/series-list'
import ShelfDetailsPage from './page/auth/shelf-details'
import TitleListPage from './page/auth/title-list'


export var pages = {
    [routes.login]: LoginPage,

    [routes.authorDetails]: AuthorDetailsPage,
    [routes.authorList]: AuthorListPage,
    [routes.bookDetails]: BookDetailsPage,
    [routes.bookRead]: BookReadPage,
    [routes.categoryDetails]: CategoryDetailsPage,
    [routes.downloadList]: DownloadListPage,
    [routes.favoriteList]: FavoriteListPage,
    [routes.landing]: LandingPage,
    [routes.libraryDetails]: LibraryDetailsPage,
    [routes.libraryList]: LibraryListPage,
    [routes.options]: OptionsPage,
    [routes.search]: SearchPage,
    [routes.seriesDetails]: SeriesDetailsPage,
    [routes.seriesList]: SeriesListPage,
    [routes.shelfDetails]: ShelfDetailsPage,
    [routes.titleList]: TitleListPage
}


export function QuietReactWarning() {
    return null
}

export default QuietReactWarning