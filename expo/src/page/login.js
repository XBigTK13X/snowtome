import C from '../common'
import { config } from '../settings'
export default function LibraryListPage() {
    const { routes, onLogin, authed } = C.useAppContext()
    const { navPush } = C.useSnowContext()

    const [form, setForm] = C.React.useState({
        bookloreUrl: '',
        bookloreUsername: '',
        booklorePassword: ''
    })

    const changeForm = (k) => {
        return (v) => {
            setForm((prev) => {
                let result = { ...prev }
                result[k] = v
                return result
            })
        }
    }

    const submitLogin = () => {
        onLogin(
            form.bookloreUrl,
            form.bookloreUsername,
            form.booklorePassword
        )
    }

    C.React.useEffect(() => {
        if (authed) {
            navPush({ path: routes.libraryList, func: false })
        }
    }, [authed])

    return (
        <C.View>
            <C.SnowHeader>Booklore</C.SnowHeader>
            <C.SnowGrid itemsPerRow={2}>
                <C.SnowLabel>Server URL</C.SnowLabel>
                <C.SnowInput onValueChange={changeForm('bookloreUrl')} value={form.bookloreUrl} />
                <C.SnowLabel>Username</C.SnowLabel>
                <C.SnowInput onValueChange={changeForm('bookloreUsername')} value={form.bookloreUsername} />
                <C.SnowLabel>Password</C.SnowLabel>
                <C.SnowInput onValueChange={changeForm('booklorePassword')} value={form.booklorePassword} />
            </C.SnowGrid>
            <C.SnowTextButton title="Login" onPress={submitLogin} />
            <C.View>
                <C.SnowText style={{
                    position: 'absolute',
                    right: 30,
                    bottom: -250
                }}>{`v${config.clientVersion} - built ${config.clientBuildDate}`}</C.SnowText>
            </C.View>
        </C.View>
    )
}
