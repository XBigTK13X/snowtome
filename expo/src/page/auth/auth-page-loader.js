import React from 'react'
import { View } from 'react-native'
import { C, useAppContext } from 'snowtome'
import Snow, {
    SnowTextButton,
    SnowGrid,
    SnowBreak
} from 'expo-snowui'


// If the Header doesn't render before the rest of the page
// Then the focusMap winds up in the wrong focusLayer
// If this is pulled up to the root layout
// then browser refresh always sends you back to the root

const styles = {
    header: {
        width: '100%'
    }
}

function HeaderNav(props) {
    const { navPush } = C.useSnowContext()
    const { displayName, routes, isAdmin, signOut } = useAppContext();

    React.useEffect(() => {
        props.setHeaderReady(true)
    })

    return (
        <View style={styles.header}>
            <SnowGrid
                focusKey="header"
                focusDown="page-entry">
                <SnowTextButton
                    title="Home"
                    onPress={navPush({ path: routes.landing })}
                />
                <SnowTextButton title="Sign Out" onPress={signOut} />
                {isAdmin ? <SnowTextButton
                    title="Dashboard"
                    onPress={navPush({ path: routes.adminDashboard })} />
                    : null}
                <SnowTextButton
                    title={`${displayName}`}
                    onPress={navPush({ path: routes.info })}
                    onLongPress={navPush({ path: routes.options })} />
            </SnowGrid>
            <SnowBreak />
        </View >
    )
}

function SnowHeaderNavPage(props) {
    const { displayName, routes } = useAppContext();
    const [headerReady, setHeaderReady] = React.useState(false)

    return (
        <>
            <HeaderNav
                displayName={displayName}
                routes={routes}
                setHeaderReady={setHeaderReady} />
            {headerReady ? props.children : null}
        </>
    )
}

export default function AuthPageLoader(props) {
    const { apiClient, authed, routes } = useAppContext();
    const { CurrentPage, currentRoute, navPush } = Snow.useSnowContext()
    const [hasAuth, setHasAuth] = React.useState(false)

    React.useEffect(() => {
        if (!hasAuth) {
            if (currentRoute.routePath.includes('/auth/') && !authed) {
                setHasAuth(true)
                navPush({ path: routes.login, func: false })
            }
        }
    }, [hasAuth, authed, currentRoute])

    if (!apiClient) {
        return null
    }

    const pageKey = `${currentRoute.routePath}-${Snow.stringifySafe(currentRoute.routeParams)}`

    const hasHeader = currentRoute.routePath.includes('/wrap/')
    if (hasHeader) {
        return (
            <SnowHeaderNavPage>
                <CurrentPage key={pageKey} />
            </SnowHeaderNavPage>
        )
    }
    return (
        <CurrentPage key={pageKey} />
    )
}
