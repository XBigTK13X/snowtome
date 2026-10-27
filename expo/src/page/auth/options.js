import Snow from '@snowsuite/expo-snowui'
import C from '../../common'

export default function OptionsPage(props) {

    const { bottomPadding, toggleBottomPadding } = C.useAppContext()

    const [status, setStatus] = C.React.useState('')

    const clearDownloads = async () => {
        setStatus('Removing downloaded books')
        const count = await C.download.clearAll()
        setStatus(`Deleted ${count} books`)
    }

    const clearCache = async () => {
        setStatus("Clearing cache")
        C.cache.clearApiCache().then(() => {
            setStatus("Cache cleared")
        })
    }

    let padIndicator = '0 / [50]'
    if (bottomPadding === 0) {
        padIndicator = '[0] / 50'
    }

    return (
        <Snow.View {...props}>
            <Snow.Grid focusStart>
                <Snow.TextButton title="Clear Downloads (hold)" onLongPress={clearDownloads} />
                <Snow.TextButton title="Clear Cache (hold)" onLongPress={clearCache} />
                <Snow.TextButton title={`Bottom Padding\n${padIndicator}`} onPress={toggleBottomPadding} />
            </Snow.Grid>
            <Snow.Label center>{status}</Snow.Label>
        </Snow.View>
    )
}