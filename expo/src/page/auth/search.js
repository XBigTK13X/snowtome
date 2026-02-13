import Snow from 'expo-snowui'
import { C, useAppContext } from 'snowtome'

export default function SearchPage() {
    const { bookloreClient, routes } = useAppContext()
    const { navPush, currentRoute } = Snow.useSnowContext()

    const [queryText, setQueryText] = C.React.useState('')
    const queryTextRef = C.React.useRef(queryText)
    const [searchResults, setSearchResults] = C.React.useState(null)
    const [resultKey, setResultKey] = C.React.useState(null)

    C.React.useEffect(() => {
        let query = currentRoute?.routeParams?.queryText
        if (query) {
            setQueryText(query)
            queryTextRef.current = query
            if (query?.length > 1) {
                bookloreClient.search(query).then(response => {
                    if (queryTextRef.current === query) {
                        setSearchResults(response)
                        setResultKey(`query-${query}`)
                    }
                })
            }
        } else {
            setQueryText('')
            queryTextRef.current = ''
        }

    }, [currentRoute])

    const executeQuery = (input) => {
        navPush({
            params: {
                ...currentRoute?.routeParams,
                queryText: input ?? queryText
            },
            func: false
        })
    }

    let resultsTabs = null
    if (searchResults) {
        if (!searchResults.length) {
            resultsTabs = <Snow.Text>No results found for [{queryText}].</Snow.Text>
        }
        else {
            let headers = searchResults.map(searchResult => {
                return `${searchResult.name} [${searchResult.items.length}]`
            })
            resultsTabs = (
                <Snow.Tabs key={resultKey} focusKey="search-results" headers={headers}>
                    {searchResults.map((searchResult, resultIndex) => {
                        if (searchResult.name === 'Book') {
                            return <Snow.Grid items={searchResult.items} renderItem={(item) => {
                                const thumbnail = bookloreClient.getBookThumbnail(item.id)
                                return <Snow.ImageButton
                                    title={item?.metadata?.title}
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
                            }
                            } />
                        }
                        if (searchResult.name === 'Series') {
                            return <Snow.Grid items={searchResult.items} renderItem={(item) => {
                                return <Snow.TextButton
                                    title={item.metadata.seriesName}
                                    onPress={navPush({
                                        path: routes.seriesDetails,
                                        params: {
                                            seriesName: item.metadata.seriesName
                                        }
                                    })} />
                            }
                            } />
                        }
                        if (searchResult.name === 'Category') {
                            return <Snow.Grid items={searchResult.items} renderItem={(item) => {
                                return <Snow.TextButton
                                    title={item.name}
                                    onPress={navPush({
                                        path: routes.seriesDetails,
                                        params: {
                                            seriesName: item.name
                                        }
                                    })} />
                            }
                            } />
                        }
                        return <Snow.TextButton title="This shouldn't appear" />
                    })}
                </Snow.Tabs>
            )
        }
    }

    return (
        <Snow.Grid
            assignFocus={false}
            itemsPerRow={1}>
            <Snow.Label>Enter a search query</Snow.Label>
            <Snow.Input
                focusStart
                focusKey="page-entry"
                focusDown="search-results"
                value={queryText}
                onValueChange={setQueryText}
                onSubmit={executeQuery}
                onDebounce={executeQuery} />
            {resultsTabs}
        </Snow.Grid>
    )
}
