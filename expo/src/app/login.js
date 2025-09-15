import C from '../common'
import { config } from '../settings'
export default function LibraryListPage() {
    const { routes, apiClient } = C.useAppContext()

    const [form, setForm] = C.React.useState({
        komgaUrl: '',
        komgaUsername: '',
        komgaPassword: '',
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

    }

    return (
        <C.FillView>
            <C.SnowGrid itemsPerRow={2}>
                <C.SnowGrid itemsPerRow={1}>
                    <C.SnowHeader>Komga</C.SnowHeader>
                    <C.SnowLabel>Server URL</C.SnowLabel>
                    <C.SnowInput onChangeValue={changeForm('komgaUrl')} value={form.komgaUrl} />
                    <C.SnowLabel>Username</C.SnowLabel>
                    <C.SnowInput onChangeValue={changeForm('komgaUsername')} value={form.komgaUsername} />
                    <C.SnowLabel>Password</C.SnowLabel>
                    <C.SnowInput onChangeValue={changeForm('komgaPassword')} value={form.komgaPassword} />
                </C.SnowGrid>
                <C.SnowGrid itemsPerRow={1}>
                    <C.SnowHeader>Booklore</C.SnowHeader>
                    <C.SnowLabel>Server URL</C.SnowLabel>
                    <C.SnowInput onChangeValue={changeForm('komgaUrl')} value={form.bookloreUrl} />
                    <C.SnowLabel>Username</C.SnowLabel>
                    <C.SnowInput onChangeValue={changeForm('komgaUsername')} value={form.bookloreUsername} />
                    <C.SnowLabel>Password</C.SnowLabel>
                    <C.SnowInput onChangeValue={changeForm('komgaPassword')} value={form.booklorePassword} />
                </C.SnowGrid>
            </C.SnowGrid>
            <C.SnowTextButton title="Login" onPress={submitLogin} />
            <C.View style={{
                flex: 1
            }}>
                <C.SnowText style={{
                    position: 'absolute',
                    right: 30,
                    bottom: -250
                }}>{`v${config.clientVersion} - built ${config.clientBuildDate}`}</C.SnowText>
            </C.View>
        </C.FillView>
    )
}
