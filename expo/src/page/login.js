import Snow from 'expo-snowui'
import C from '../common'
import { config } from '../settings'

export default function LibraryListPage(props) {
    const { routes, onLogin, authed } = C.useAppContext()
    const { navPush } = Snow.useSnowContext()

    const [form, setForm] = C.React.useState({
        bookloreUrl: 'https://booklore.9914.us',
        bookloreUsername: C.isTV ? 'kids' : '',
        booklorePassword: C.isTV ? 'KidsKids' : ''
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
        <Snow.View {...props}>
            <Snow.Header>Booklore</Snow.Header>
            <Snow.Grid itemsPerRow={2}>
                <Snow.Label style={{ width: 250 }}>Server URL</Snow.Label>
                <Snow.Input onValueChange={changeForm('bookloreUrl')} value={form.bookloreUrl} />
                <Snow.Label style={{ width: 250 }}>Username</Snow.Label>
                <Snow.Input onValueChange={changeForm('bookloreUsername')} value={form.bookloreUsername} />
                <Snow.Label style={{ width: 250 }}>Password</Snow.Label>
                <Snow.Input onValueChange={changeForm('booklorePassword')} value={form.booklorePassword} />
            </Snow.Grid>
            <Snow.Grid>
                <Snow.TextButton focusStart title="Login" onPress={submitLogin} />
            </Snow.Grid>
        </Snow.View>
    )
}
