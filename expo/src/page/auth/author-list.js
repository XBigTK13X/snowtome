import Snow from 'expo-snowui'
import C from '../../common'

export default function AuthorListPage(props) {
    const { navPush } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [authorList, setAuthorList] = C.React.useState(null)
    const [authorBooks, setAuthorBooks] = C.React.useState(null)
    const [coverSeed, setCoverSeed] = C.React.useState(null)

    C.React.useEffect(() => {
        if (bookloreClient.accessToken) {
            bookloreClient.getAuthorList().then((response) => {
                setCoverSeed(Math.random())
                setAuthorBooks(response.authorBooks)
                setAuthorList(response.authorNames)
            })
        }
    }, [bookloreClient])

    if (!authorList) {
        return <Snow.Label center>Loading authors for {bookloreClient.username}...</Snow.Label>
    }

    return (
        <Snow.View {...props}>
            <Snow.Label center>Author [{authorList?.length}]</Snow.Label>
            <Snow.Grid focusStart items={authorList} renderItem={(authorName) => {
                let coverId = authorBooks[authorName].at(Math.floor(coverSeed * authorBooks[authorName].length))
                const thumbnail = bookloreClient.getBookThumbnail(coverId, bookloreClient.accessToken)
                return <Snow.ImageButton
                    title={authorName}
                    imageUrl={thumbnail}
                    onPress={navPush({
                        path: routes.authorDetails,
                        params: {
                            authorName: authorName
                        }
                    })} />
            }} />
        </Snow.View>
    )
}
