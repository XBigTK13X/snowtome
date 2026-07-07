import React from 'react'
import Snow from 'expo-snowui'
import { C, useAppContext } from 'snowtome'

export default function AuthPageLoader(props) {
    const { bookloreClient, authed, initializing, routes } = useAppContext()
    const { CurrentPage, currentRoute, navPush, navPop } = Snow.useSnowContext()
    const [hasAuth, setHasAuth] = React.useState(false)

    React.useEffect(() => {
        if (!initializing && !hasAuth) {
            if (currentRoute.routePath.includes('/auth/') && !authed) {
                setHasAuth(true)
                navPush({ path: routes.login, func: false })
            }
        }
    }, [hasAuth, authed, currentRoute, initializing])

    if (initializing) {
        return (
            <Snow.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Snow.Text>Going to the library...</Snow.Text>
            </Snow.View>
        )
    }

    if (!bookloreClient) {
        return null
    }

    const pageKey = `${currentRoute.routePath}`

    let header = null
    if (currentRoute.routePath.includes('/wrap/')) {
        header = (
            <Snow.View yy={0}>
                <Snow.Grid>
                    <Snow.TextButton focusStart title="Home" onPress={navPush({ path: routes.landing })} />
                    <Snow.TextButton title="Back" onPress={navPop(true)} />
                </Snow.Grid>
                <Snow.Break />
            </Snow.View>
        )
    }

    return (
        <Snow.View>
            {header}
            <CurrentPage yy={1} key={pageKey} />
            <Snow.View style={{ marginBottom: 20 }} />
        </Snow.View>
    )
}