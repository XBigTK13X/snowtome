import { C, useAppContext } from 'snowtome'

export default function SearchPage() {
    const { bookloreClient, routes } = useAppContext()
    const { navPush, currentRoute } = C.useSnowContext()

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
            resultsTabs = <C.SnowText>No results found for [{queryText}].</C.SnowText>
        }
        else {
            let headers = searchResults.map(searchResult => {
                return `${searchResult.name} [${searchResult.items.length}]`
            })
            resultsTabs = (
                <C.SnowTabs key={resultKey} focusKey="search-results" headers={headers}>
                    {searchResults.map((searchResult, resultIndex) => {
                        const isBook = searchResult.name === 'Book'
                        const isSeries = searchResult.name === 'Series'
                        const isCategory = searchResult.name === 'Category'
                        return (
                            <C.SnowGrid items={searchResult.items} renderItem={() => {
                                if (isBook) {
                                    const thumbnail = bookloreClient.getBookThumbnail(item.id)
                                    return (
                                        <C.SnowImageButton
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
                                    )
                                }
                                if (isSeries) {
                                    return <C.SnowTextButton
                                        title={item}
                                        onPress={navPush({
                                            path: routes.seriesDetails,
                                            params: {
                                                seriesName: item
                                            }
                                        })} />
                                }
                                if (isCategory) {
                                    return <C.SnowTextButton
                                        title={item}
                                        onPress={navPush({
                                            path: routes.seriesDetails,
                                            params: {
                                                seriesName: item
                                            }
                                        })} />
                                }
                            }} />
                        )
                    })}
                </C.SnowTabs>
            )
        }
    }

    return (
        <C.SnowGrid
            assignFocus={false}
            itemsPerRow={1}>
            <C.SnowLabel>Enter a search query</C.SnowLabel>
            <C.SnowInput
                focusStart
                focusKey="page-entry"
                focusDown="search-results"
                value={queryText}
                onValueChange={setQueryText}
                onSubmit={executeQuery}
                onDebounce={executeQuery} />
            {resultsTabs}
        </C.SnowGrid>
    )
}
