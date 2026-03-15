import Snow from 'expo-snowui'
import C from '../../common'

export default function LibraryListPage() {
    const { navPush } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [authorList, setAuthorList] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getAuthorList().then((response) => {
            setAuthorList(response)
        })
    }, [])

    if (!authorList) {
        return <Snow.Label center>Loading authors for {bookloreClient.username}...</Snow.Label>
    }

    return (
        <>
            <Snow.Label center>Author [{authorList?.length}]</Snow.Label>
            <Snow.Grid itemsPerRow={4} items={authorList} renderItem={(item) => {
                return <Snow.TextButton
                    title={item}
                    onPress={navPush({
                        path: routes.authorDetails,
                        params: {
                            authorName: item
                        }
                    })} />
            }} />
        </>
    )
}
