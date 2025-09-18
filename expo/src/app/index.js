import C from '../common'
import { config } from '../settings'
export default function LibraryListPage() {
    const { authed, routes, apiClient } = C.useAppContext()

    if (authed) {
        return <C.Redirect href={routes.libraryList} />
    }

    return <C.Redirect href={routes.login} />

    const [libraryList, setLibraryList] = C.React.useState(null)

    C.React.useEffect(() => {
        if (!libraryList && apiClient) {
            apiClient.getLibraryList().then((response) => {
                setLibraryList(response)
            })
        }
    })

    if (!libraryList) {
        return <C.SnowText>Loading library list...</C.SnowText>
    }

    if (libraryList.length === 0) {
        return <C.SnowText>No libraries were found</C.SnowText>
    }

    return (
        <C.FillView>
            <C.SnowGrid items={libraryList} renderItem={(item) => {
                return <C.SnowTextButton
                    title={item.name}
                    onPress={routes.func(routes.seriesList, { libraryId: item.id })} />
            }} />
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
