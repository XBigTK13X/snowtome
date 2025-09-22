import C from '../common'
import { AppContextProvider } from '../app-context'

const styles = {
    header: {
        width: '100%',
        height: 75
    }
}

function Header() {
    const { routes } = C.useAppContext()

    return (
        <C.View style={styles.header}>
            <C.SnowGrid itemsPerRow={3} scroll={false}>
                <C.SnowTextButton title={`Home`} onPress={routes.func(routes.landing)} />
            </C.SnowGrid>
        </C.View>
    )
}

const appStyle = {
    color: {
        background: 'black',
        text: 'rgb(235, 235, 235)',
        textDark: 'rgb(22, 22, 22)',
        active: 'rgb(150, 150, 150)',
        hover: 'rgb(119, 139, 255)',
        core: 'rgb(219, 158, 44)',
        coreDark: 'rgb(136, 98, 27)',
        outlineDark: 'rgb(63, 63, 63)',
        fade: 'rgb(23, 23, 23)',
        transparentDark: 'rgba(0,0,0,0.6)',
        panel: 'rgb(50,50,50)'
    }
}

export default function RootLayout() {
    return (
        <C.SnowApp snowStyle={appStyle}>
            <AppContextProvider style={{ flex: 1 }}>
                <Header />
                <C.Slot style={{ flex: 1 }} />
            </AppContextProvider>
        </C.SnowApp>
    )
}
