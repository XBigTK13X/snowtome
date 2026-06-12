import Snow from 'expo-snowui'
import C from '../../common'

export default function LibraryListPage(props) {
    const { navPush } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [libraryList, setLibraryList] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getShelfList().then((response) => {
            setLibraryList(response)
        })
    }, [])

    if (!libraryList) {
        return <Snow.Label center>Loading favorites for {bookloreClient.username}...</Snow.Label>
    }

    return (
        <Snow.View {...props}>
            <Snow.Label center>Favorites [{libraryList?.length}]</Snow.Label>
            <Snow.Grid focusStart itemsPerRow={3} items={libraryList} renderItem={(item) => {
                return <Snow.TextButton
                    title={item.name}
                    onPress={navPush({
                        path: routes.shelfDetails,
                        params: {
                            shelfId: item.id,
                            shelfName: item.name
                        }
                    })} />
            }} />
        </Snow.View>
    )
}
