import Snow from 'expo-snowui'
import C from '../../common'

export default function OptionsPage(props) {

    const [status, setStatus] = C.React.useState('')

    const clearDownloads = async () => {
        setStatus('Removing downloaded books')
        const count = await C.download.clearAll()
        setStatus(`Deleted ${count} books`)
    }

    return (
        <Snow.View {...props}>
            <Snow.Grid focusStart>
                <Snow.TextButton title="Clear Downloads" onPress={clearDownloads} />
            </Snow.Grid>
            <Snow.Label center>{status}</Snow.Label>
        </Snow.View>
    )
}