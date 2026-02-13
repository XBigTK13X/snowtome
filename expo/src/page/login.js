import Snow from 'expo-snowui'
import C from '../common'
import { config } from '../settings'

export default function LibraryListPage() {
    const { routes, onLogin, authed } = C.useAppContext()
    const { navPush } = Snow.useSnowContext()

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
            navPush({ path: routes.landing, func: false })
        }
    }, [authed])

    return (
        <C.View>
            <Snow.Header>Booklore</Snow.Header>
            <Snow.Grid itemsPerRow={2}>
                <Snow.Label>Server URL</Snow.Label>
                <Snow.Input onValueChange={changeForm('bookloreUrl')} value={form.bookloreUrl} />
                <Snow.Label>Username</Snow.Label>
                <Snow.Input onValueChange={changeForm('bookloreUsername')} value={form.bookloreUsername} />
                <Snow.Label>Password</Snow.Label>
                <Snow.Input onValueChange={changeForm('booklorePassword')} value={form.booklorePassword} />
            </Snow.Grid>
            <Snow.TextButton title="Login" onPress={submitLogin} />
            <C.View>
                <Snow.Text style={{
                    position: 'absolute',
                    right: 30,
                    bottom: -250
                }}>{`v${config.clientVersion} - built ${config.clientBuildDate}`}</Snow.Text>
            </C.View>
        </C.View>
    )
}
