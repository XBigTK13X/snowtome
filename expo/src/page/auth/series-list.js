import Snow from 'expo-snowui'
import C from '../../common'

export default function LibraryListPage() {
    const { navPush } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [seriesList, setSeriesList] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getSeriesList().then((response) => {
            setSeriesList(response)
        })
    }, [])

    if (!seriesList) {
        return <Snow.Text>Loading series for {bookloreClient.username}...</Snow.Text>
    }

    return (
        <>
            <Snow.Label center>Series [{seriesList?.length}]</Snow.Label>
            <Snow.Grid itemsPerRow={3} items={seriesList} renderItem={(item) => {
                return <Snow.TextButton
                    title={item}
                    onPress={navPush({
                        path: routes.seriesDetails,
                        params: {
                            seriesName: item
                        }
                    })} />
            }} />
        </>
    )
}
