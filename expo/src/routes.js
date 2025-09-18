import { router } from 'expo-router'

// DOCS router method https://docs.expo.dev/router/navigating-pages/#imperative-navigation

export var routes = {
    landing: '/',
    login: '/login',
    libraryList: '/auth/libraryList',
    landing: '/auth/categoryList',
    seriesList: '/seriesList',
    bookList: '/bookList',
    bookDetails: '/bookDetails',
    replace: (target, params) => {
        if (!params) {
            return router.replace(target)
        }
        router.replace({ pathname: target, params })
    },
    goto: (target, params) => {
        if (!params) {
            return router.push(target)
        }
        router.push({ pathname: target, params })
    },
}

routes.func = (target, params) => {
    return () => {
        routes.goto(target, params)
    }
}

routes.back = () => {
    router.back()
}

routes.funcBack = () => {
    return () => {
        routes.back()
    }
}

routes.reset = () => {
    // TODO This throws errors on Android
    // Try instead to pass in a navigator context
    // The action 'POP_TO_TOP' was not handled by any navigator
    /*
    navigation.reset({
            index: 0,
            routes: [{ name: 'login' }], // your stack screen name
        });
    */
    if (router.canDismiss()) {
        router.dismissAll()
    }
    router.replace(routes.signIn);
}

export function QuietReactWarning() {
    return null
}

export default QuietReactWarning