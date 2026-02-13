import Snow from 'expo-snowui'
import C from '../../common'

export default function LibraryListPage() {
    const { navPush } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [libraryList, setLibraryList] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getLibraryList().then((response) => {
            setLibraryList(response)
        })
    }, [])

    if (!libraryList) {
        return <Snow.Text>Loading libraries for {bookloreClient.username}...</Snow.Text>
    }

    return (
        <>
            <Snow.Label center>Libraries [{libraryList?.length}]</Snow.Label>
            <Snow.Grid itemsPerRow={3} items={libraryList} renderItem={(item) => {
                return <Snow.TextButton
                    title={item.name}
                    onPress={navPush({
                        path: routes.libraryDetails,
                        params: {
                            libraryId: item.id,
                            libraryName: item.name
                        }
                    })} />
            }} />
        </>
    )
}
