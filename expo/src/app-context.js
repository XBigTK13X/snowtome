import React from 'react';
import Snow from 'expo-snowui'

import { config } from './settings'
import { routes } from './routes'
import { View } from 'react-native'
import { BookloreClient } from './booklore-client'

const AppContext = React.createContext({
    config: null,
    routes: null,
    booklore: null,
    onLogin: null
});

export function useAppContext() {
    const value = React.useContext(AppContext);
    if (!value) {
        throw new Error('appContext must be wrapped in a <AppContextProvider />');
    }
    return value;
}

export function AppContextProvider(props) {
    const { SnowStyle } = Snow.useSnowContext(props)
    const styles = {
        prompt: {
            backgroundColor: SnowStyle.color.background,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        }
    }
    const [apiError, setApiError] = React.useState(null)
    const onApiError = (err) => {
        if (!apiError) {
            setApiError(err)
        }
    }
    const [booklore, setBooklore] = React.useState(null)
    const [authed, setAuthed] = React.useState(false)

    const onLogin = (webApiUrl, username, password) => {
        const client = new BookloreClient({
            onApiError,
            webApiUrl,
            username,
            password
        })
        client.login(username, password).then((response) => {
            Snow.saveData('bookloreAuth', JSON.stringify({
                refreshToken: client.refreshToken,
                accessToken: client.accessToken,
                username,
                webApiUrl: webApiUrl
            }))
            setAuthed(true)
            setBooklore(client)
        })
    }

    const onLogout = () => {
        Snow.saveData('bookloreAuth', null)
        setBooklore(null)
        setAuthed(false)
    }

    React.useEffect(() => {
        let bookloreAuth = Snow.loadData('bookloreAuth')
        if (bookloreAuth) {
            bookloreAuth = JSON.parse(bookloreAuth)
            const client = new BookloreClient({
                onApiError,
                webApiUrl: bookloreAuth.webApiUrl,
                accessToken: bookloreAuth.accessToken,
                refreshToken: bookloreAuth.refreshToken
            })
            setBooklore(client)
            setAuthed(true)
        }
    }, [])

    if (apiError) {
        return (
            <Snow.Modal navigationBarTranslucent statusBarTranslucent>
                <View style={styles.prompt}>
                    <Snow.Text>Unable to communicate with Snowtome.</Snow.Text>
                    <Snow.Text>Check if your Wi-Fi is disconnected, ethernet unplugged, or if the snowtome server is down.</Snow.Text>
                    <View>
                        <Snow.Grid itemsPerRow={2}>
                            <Snow.TextButton title="Try to Reload" onPress={() => { setApiError(null) }} />
                        </Snow.Grid>
                    </View>
                </View>
            </Snow.Modal>
        )
    }

    const appContext = {
        config,
        routes,
        bookloreClient: booklore,
        authed,
        onLogin,
        onLogout
    }

    return (
        <AppContext.Provider
            style={{ flex: 1 }}
            value={appContext}
            children={props.children}
        />
    )
}

export default AppContextProvider