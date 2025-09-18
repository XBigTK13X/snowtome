import C from '../common'
import { AppContextProvider } from '../app-context'

const styles = {
    header: {
        width: '100%',
        height: 75
    },
    hr: {
        borderBottomColor: C.Style.color.coreDark,
        borderBottomWidth: 2,
    },
    page: {
        height: C.Style.window.height(),
        padding: 30,
        backgroundColor: C.Style.color.background
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

export default function RootLayout() {
    const Wrapper = C.isTV ? C.TVFocusGuideView : C.View
    return (
        <C.ScrollView style={styles.page}>
            <AppContextProvider>
                <Header />
                <C.Slot />
            </AppContextProvider>
        </C.ScrollView>
    )
}
