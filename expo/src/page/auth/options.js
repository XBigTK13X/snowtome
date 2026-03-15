import Snow from 'expo-snowui'
import C from '../../common'

export default function OptionsPage() {

    const [status, setStatus] = C.React.useState('')

    const clearDownloads = async () => {
        setStatus('Removing downloaded books')
        const count = await C.download.clearAll()
        setStatus(`Deleted ${count} books`)
    }

    return (
        <>
            <Snow.Grid>
                <Snow.TextButton title="Clear Downloads" onPress={clearDownloads} />
            </Snow.Grid>
            <Snow.Label center>{status}</Snow.Label>
        </>
    )
}