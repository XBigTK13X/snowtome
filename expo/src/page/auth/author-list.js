import Snow from 'expo-snowui'
import C from '../../common'

export default function AuthorListPage(props) {
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
        <Snow.View {...props}>
            <Snow.Label center>Author [{authorList?.length}]</Snow.Label>
            <Snow.Grid focusStart itemsPerRow={4} items={authorList} renderItem={(item) => {
                return <Snow.TextButton
                    title={item}
                    onPress={navPush({
                        path: routes.authorDetails,
                        params: {
                            authorName: item
                        }
                    })} />
            }} />
        </Snow.View>
    )
}
