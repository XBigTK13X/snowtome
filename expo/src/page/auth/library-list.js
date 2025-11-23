import C from '../../common'
export default function LibraryListPage() {
    const { navPush } = C.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [libraryList, setLibraryList] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getLibraryList().then((response) => {
            setLibraryList(response)
        })
    }, [])

    if (!libraryList) {
        return <C.SnowText>Loading libraries for {bookloreClient.username}...</C.SnowText>
    }

    return (
        <>
            <C.SnowLabel center>Libraries [{libraryList?.length}]</C.SnowLabel>
            <C.SnowGrid itemsPerRow={3} items={libraryList} renderItem={(item) => {
                return <C.SnowTextButton
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
