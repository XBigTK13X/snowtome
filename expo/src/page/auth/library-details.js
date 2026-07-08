import Snow from 'expo-snowui'
import C from '../../common'

export default function LibraryDetailsPage(props) {
    const { navPush, currentRoute, navUpdate } = Snow.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [libraryDetails, setLibraryDetails] = C.React.useState(null)
    const libraryView = currentRoute?.routeParams?.libraryView ?? 'book'
    const [coverSeed, setCoverSeed] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getBookListByLibrary(currentRoute?.routeParams?.libraryId).then((response) => {
            setLibraryDetails(response)
            setCoverSeed(Math.random())
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
            <Snow.View {...props}>
                {viewPicker}
                <Snow.Label center>Series [{libraryDetails.seriesList.length}]</Snow.Label>
                <Snow.Grid focusKey={"series"} focusStart items={libraryDetails.seriesList} renderItem={(seriesName) => {
                    let coverId = libraryDetails.seriesBooks[seriesName].at(Math.floor(coverSeed * libraryDetails.seriesBooks[seriesName].length))
                    const thumbnail = bookloreClient.getBookThumbnail(coverId, bookloreClient.accessToken)
                    return <Snow.ImageButton
                        overlayTitle
                        title={seriesName}
                        imageUrl={thumbnail}
                        onPress={navPush({
                            path: routes.seriesDetails,
                            params: {
                                seriesName: seriesName
                            }
                        })} />
                }} />
            </Snow.View>
        )
    }
    return (
        <Snow.View {...props}>
            {viewPicker}
            <C.BookList
                focusStart
                getHeader={(routeParams) => { return `Library - ${currentRoute?.routeParams?.libraryName}` }}
                bookList={libraryDetails.bookList}
            />
        </Snow.View>
    )
}
