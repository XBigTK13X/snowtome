import { Platform } from 'react-native'

let routesInner = {
    login: '/login',

    authorDetails: '/auth/wrap/author/details',
    authorList: '/auth/wrap/author/list',
    bookDetails: '/auth/wrap/book',
    bookRead: '/auth/wrap/book/read',
    categoryDetails: '/auth/wrap/category/details',
    downloadList: '/auth/wrap/download/list',
    favoriteList: '/auth/wrap/favorite/list',
    landing: '/auth/landing',
    libraryDetails: '/auth/wrap/library',
    libraryList: '/auth/wrap/library/list',
    options: '/auth/wrap/options',
    search: '/auth/wrap/search',
    seriesDetails: '/auth/wrap/series/details',
    seriesList: '/auth/wrap/series/list',
    shelfDetails: '/auth/wrap/shelf/details',
    titleList: '/auth/wrap/title/list'
}

if (Platform.isTV) {
    routesInner.bookDetails = routesInner.bookRead
}

export const routes = routesInner

export function QuietReactWarning() {
    return null
}

export default QuietReactWarning