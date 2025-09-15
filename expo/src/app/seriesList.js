import C from '../common'
export default function SeriesListPage() {
    const { routes, apiClient } = C.useAppContext()
    const localParams = C.useLocalSearchParams()
    const [seriesList, setSeriesList] = C.React.useState(null)

    C.React.useEffect(() => {
        if (!seriesList) {
            apiClient.getSeriesList(localParams.libraryId).then((response) => {
                setSeriesList(response.content)
            })
        }
    })

    if (!seriesList) {
        return <C.SnowText>Loading series list...</C.SnowText>
    }

    return (
        <C.FillView>
            <C.SnowGrid itemsPerRow={7} items={seriesList} renderItem={(item) => {
                const thumbnail = apiClient.getSeriesThumbnail(item.id)
                return <C.SnowImageButton
                    title={item.name}
                    imageSource={thumbnail}
                    onPress={routes.func(routes.bookList, { seriesId: item.id, seriesName: item.name })} />
            }} />
        </C.FillView>
    )
}
