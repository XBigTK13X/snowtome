import Snow from 'expo-snowui'
import C from '../../common'

export default function SeriesListPage(props) {
    const { navPush } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [seriesNames, setSeriesNames] = C.React.useState(null)
    const [seriesBooks, setSeriesBooks] = C.React.useState(null)
    const [coverSeed, setCoverSeed] = C.React.useState(null)

    C.React.useEffect(() => {
        if (bookloreClient.accessToken) {
            bookloreClient.getSeriesList().then((response) => {
                setCoverSeed(Math.random())
                setSeriesBooks(response.seriesBooks)
                setSeriesNames(response.seriesNames)
            })
        }
    }, [bookloreClient])

    if (!seriesNames) {
        return <Snow.Label center>Loading series...</Snow.Label>
    }

    return (
        <Snow.View {...props}>
            <Snow.Label center>Series [{seriesNames?.length}]</Snow.Label>
            <Snow.Grid focusStart itemsPerRow={4} items={seriesNames} renderItem={(seriesName) => {
                let coverId = seriesBooks[seriesName].at(Math.floor(coverSeed * seriesBooks[seriesName].length))
                const thumbnail = bookloreClient.getBookThumbnail(coverId, bookloreClient.accessToken)
                return <Snow.ImageButton
                    title={seriesName}
                    imageUrl={thumbnail}
                    onPress={navPush({
                        path: routes.seriesDetails,
                        params: {
                            seriesName: seriesName
                        }
                    })} />
            }} />
        </Snow.View>
    )
}
