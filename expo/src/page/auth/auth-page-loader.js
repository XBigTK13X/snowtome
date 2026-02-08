import React from 'react'
import { View } from 'react-native'
import { C, useAppContext } from 'snowtome'
import Snow, {
    SnowTextButton,
    SnowGrid,
    SnowBreak
} from 'expo-snowui'

export default function AuthPageLoader(props) {
    const { bookloreClient, authed, routes } = useAppContext();
    const { CurrentPage, currentRoute, navPush, navPop } = Snow.useSnowContext()
    const [hasAuth, setHasAuth] = React.useState(false)

    React.useEffect(() => {
        if (!hasAuth) {
            if (currentRoute.routePath.includes('/auth/') && !authed) {
                setHasAuth(true)
                navPush({ path: routes.login, func: false })
            }
        }
    }, [hasAuth, authed, currentRoute])

    if (!bookloreClient) {
        return null
    }

    const pageKey = `${currentRoute.routePath}-${Snow.stringifySafe(currentRoute.routeParams)}`

    let header = null
    if (currentRoute.routePath.includes('/wrap/')) {
        header = (
            <C.SnowGrid>
                <C.SnowTextButton title="Home" onPress={navPush({ path: routes.landing })} />
                <C.SnowTextButton title="Back" onPress={navPop} />
            </C.SnowGrid>
        )
    }

    return (
        <>
            {header}
            <CurrentPage key={pageKey} />
        </>
    )
}
