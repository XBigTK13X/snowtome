import pkg from "../../package.json"
import React from 'react'
import { Platform } from 'react-native'
import Snow from 'expo-snowui'
import {
    config,
    AppContextProvider,
    useAppContext,
} from 'snowtome'
import { routes } from '../routes'
import { pages } from '../pages'
import AuthPageLoader from './auth/auth-page-loader'

const appStyle = {
    color: {
        background: 'black',
        text: 'rgb(235, 235, 235)',
        textDark: 'rgb(22, 22, 22)',
        active: 'rgb(150, 150, 150)',
        hover: 'rgb(119, 139, 255)',
        core: 'rgba(44, 219, 114, 1)',
        coreDark: 'rgba(27, 136, 51, 1)',
        outlineDark: 'rgb(63, 63, 63)',
        fade: 'rgb(23, 23, 23)',
        transparentDark: 'rgba(0,0,0,0.6)',
        panel: 'rgb(50,50,50)'
    }
}

const SnowApp = Snow.createSnowApp({
    enableSentry: true,
    sentryUrl: "https://e347f7f6238e44238666aef85b8a1b15@bugsink.9914.us/3",
    appName: "snowtome",
    appVersion: pkg.version
})

function PageWrapper(props) {
    const { CurrentPage, currentRoute, SnowStyle, navPush } = Snow.useSnowContext(props)
    const { refreshClient, routes, bookloreClient, authed, initializing } = useAppContext()

    let appWrapperStyle = { flex: 1, paddingBottom: 50 }
    if (SnowStyle.isPortrait) {
        appWrapperStyle.paddingTop = 50
    }

    // Handles normal heartbeat routing updates
    React.useEffect(() => {
        if (initializing || currentRoute.routePath === routes.login || currentRoute.routePath === '/') {
            return
        }
        refreshClient()
    }, [currentRoute.routePath, initializing])

    // Route straight to landing if authed when initialization finishes to prevent login screen flashing
    React.useEffect(() => {
        if (!initializing && authed && (currentRoute.routePath === routes.login || currentRoute.routePath === '/')) {
            navPush({ path: routes.landing, func: false })
        }
    }, [initializing, authed, currentRoute.routePath])

    if (initializing) {
        return (
            <Snow.View style={[appWrapperStyle, { justifyContent: 'center', alignItems: 'center' }]}>
                <Snow.Header center>Going to the library...</Snow.Header>
            </Snow.View>
        )
    }

    // Suppress showing login screen content if we are authenticated and waiting for the redirect effect to fire
    if (authed && (currentRoute.routePath === routes.login || currentRoute.routePath === '/')) {
        return (
            <Snow.View style={[appWrapperStyle, { justifyContent: 'center', alignItems: 'center' }]}>
                <Snow.Header center>Going to the library...</Snow.Header>
            </Snow.View>
        )
    }

    let interior = <AuthPageLoader />
    if (currentRoute.routePath === routes.login || currentRoute.routePath === '/') {
        interior = <CurrentPage />
    }
    return (
        <Snow.View style={appWrapperStyle}>
            {interior}
        </Snow.View>
    )
}

export default function PageLoader() {
    return (
        <SnowApp
            DEBUG_SNOW={config.debugSnowui}
            ENABLE_FOCUS={Platform.isTV}
            snowStyle={appStyle}
            routePaths={routes}
            routePages={pages}
            initialRoutePath={routes.login}
        >
            <AppContextProvider>
                <PageWrapper />
            </AppContextProvider >
        </SnowApp>
    )
}