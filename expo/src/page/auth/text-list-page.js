import Snow from 'expo-snowui'
import C from '../../common'

export default function TestListPage(props) {
    const { navPush } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [resultList, setResultList] = C.React.useState(null)

    C.React.useEffect(() => {
        props.loadData(bookloreClient).then((response) => {
            setResultList(response)
        })
    }, [])

    if (!resultList) {
        return <Snow.Label center>Loading {props.title} for {bookloreClient.username}...</Snow.Label>
    }

    return (
        <>
            <Snow.Label center>{props.title} [{resultList?.length}]</Snow.Label>
            <Snow.Grid itemsPerRow={4} items={resultList} renderItem={(item) => {
                return <Snow.TextButton
                    title={item}
                    onPress={navPush({
                        path: props.buttonRoute(routes),
                        params: props.routeParams(item)
                    })} />
            }} />
        </>
    )
}
