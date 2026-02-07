import C from '../../common'
export default function LibraryListPage() {
    const { navPush } = C.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [seriesList, setSeriesList] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getSeriesList().then((response) => {
            setSeriesList(response)
        })
    }, [])

    if (!seriesList) {
        return <C.SnowText>Loading series for {bookloreClient.username}...</C.SnowText>
    }

    return (
        <>
            <C.SnowLabel center>Series [{seriesList?.length}]</C.SnowLabel>
            <C.SnowGrid itemsPerRow={3} items={seriesList} renderItem={(item) => {
                return <C.SnowTextButton
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
