import React from 'react';
import { config } from './settings'
import { routes } from './routes'
import { Modal, View } from 'react-native'
import { ApiClient } from './api-client'

import { StaticStyle } from './snow-style'
import SnowGrid from './comp/snow-grid'
import SnowText from './comp/snow-text'
import SnowTextButton from './comp/snow-text-button'

const styles = {
    prompt: {
        backgroundColor: StaticStyle.color.background,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    }
}

const AppContext = React.createContext({
    config: null,
    routes: null,
    apiClient: null
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
    const [apiClient, setApiClient] = React.useState(null)

    React.useEffect(() => {
        if (!apiClient) {
            setApiClient(new ApiClient({ onApiError }))
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
        apiClient
    }

    return (
        <AppContext.Provider
            value={appContext}
            children={props.children}
        />
    )
}

export default AppContextProvider