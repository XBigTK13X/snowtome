import Snow from 'expo-snowui'
import C from '../../common'
export default function LibraryDetailsPage() {
    const { navPush, currentRoute, navUpdate } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [libraryDetails, setLibraryDetails] = C.React.useState(null)
    const libraryView = currentRoute?.routeParams?.libraryView ?? 'book'

    C.React.useEffect(() => {
        bookloreClient.getBookListByLibrary(currentRoute?.routeParams?.libraryId).then((response) => {
            setLibraryDetails(response)
        })
    }, [])

    if (!libraryDetails) {
        return <Snow.Label center>Loading books in {currentRoute?.routeParams?.libraryName}...</Snow.Label>
    }

    let viewPicker = null
    if (libraryDetails?.seriesList?.length) {
        viewPicker = (
            <Snow.Grid>
                <Snow.TextButton title="Books" onPress={() => { navUpdate({ libraryView: 'book' }) }} />
                <Snow.TextButton title="Series" onPress={() => { navUpdate({ libraryView: 'series' }) }} />
            </Snow.Grid>
        )
    }
    if (libraryView === 'series') {
        return (
            <>
                {viewPicker}
                <Snow.Label center>Series [{libraryDetails.seriesList.length}]</Snow.Label>
                <Snow.Grid itemsPerRow={4} items={libraryDetails.seriesList} renderItem={(item) => {
                    return <Snow.TextButton
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
    return (
        <>
            {viewPicker}
            <Snow.Label center>Books [{libraryDetails.bookList.length}]</Snow.Label>
            <Snow.Grid itemsPerRow={4} items={libraryDetails.bookList} renderItem={(item) => {
                const thumbnail = bookloreClient.getBookThumbnail(item.id)
                return <Snow.ImageButton
                    title={item?.metadata?.title ?? `[${item?.id}]`}
                    imageUrl={thumbnail}
                    onPress={navPush({
                        path: routes.bookDetails,
                        params: {
                            libraryId: item.libraryId,
                            libraryName: item.libraryName,
                            bookId: item.id,
                            bookName: item.metadata?.title,
                            bookKind: item.bookType
                        }
                    })} />
            }} />
        </>
    )
}
