import React from 'react';
import * as SecureStore from 'expo-secure-store';

import { config } from './settings'
import { routes } from './routes'
import { Modal, View } from 'react-native'
import { KomgaClient } from './komga-client'
import { BookloreClient } from './booklore-client'

import { Style } from './snow-style'
import SnowGrid from './comp/snow-grid'
import SnowText from './comp/snow-text'
import SnowTextButton from './comp/snow-text-button'

const styles = {
    prompt: {
        backgroundColor: Style.color.background,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    }
}

const setStoredValue = (key, value) => {
    return new Promise(resolve => {
        if (Platform.OS === 'web') {
            if (value === null) {
                localStorage.removeItem(key);
                return resolve(true)
            } else {
                localStorage.setItem(key, value);
                return resolve(true)
            }
        } else {
            if (value == null) {
                SecureStore.deleteItemAsync(key);
                return resolve(true)
            } else {
                if (value === false) {
                    value = 'false'
                }
                if (value === true) {
                    value = 'true'
                }
                SecureStore.setItem(key, value);
                return resolve(true)
            }
        }
    })
}

const getStoredValue = (key) => {
    let value = null
    if (Platform.OS === 'web') {
        value = localStorage.getItem(key)
    } else {
        value = SecureStore.getItem(key)
    }
    if (value === 'true') {
        return true
    }
    if (value === 'false') {
        return false
    }
    return value
}

const AppContext = React.createContext({
    config: null,
    routes: null,
    komga: null,
    booklore: null
});

export function useAppContext() {
    const value = React.useContext(AppContext);
    if (!value) {
        throw new Error('appContext must be wrapped in a <AppContextProvider />');
    }
    return value;
}

export function AppContextProvider(props) {
    const [apiError, setApiError] = React.useState(null)
    const onApiError = (err) => {
        if (!apiError) {
            setApiError(err)
        }
    }
    const [komga, setKomga] = React.useState(null)
    const [booklore, setBooklore] = React.useState(null)
    const [authed, setAuthed] = React.useState(false)

    React.useEffect(() => {
        if (!komga) {
            setKomga(new KomgaClient({ onApiError }))
        }
        if (!booklore) {
            setBooklore(new BookloreClient({ onApiError }))
        }
    })

    if (apiError) {
        return (
            <Modal navigationBarTranslucent statusBarTranslucent>
                <View style={styles.prompt}>
                    <SnowText>Unable to communicate with Snowtome.</SnowText>
                    <SnowText>Check if your Wi-Fi is disconnected, ethernet unplugged, or if the Snowstream server is down.</SnowText>
                    <View>
                        <SnowGrid itemsPerRow={2}>
                            <SnowTextButton title="Try to Reload" onPress={() => { setApiError(null) }} />
                        </SnowGrid>
                    </View>
                </View>
            </Modal>
        )
    }

    const appContext = {
        config,
        routes,
        komga,
        booklore,
        authed
    }

    return (
        <AppContext.Provider
            value={appContext}
            children={props.children}
        />
    )
}

export default AppContextProvider