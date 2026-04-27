import Snow from 'expo-snowui'
import C from '../../common'
import { Pressable } from 'react-native';

export default function BookDetailsPage(props) {
    const {
        currentRoute,
        pushModal,
        popModal,
        navPop,
        addActionListener,
        removeActionListener,
        openOverlay,
        closeOverlay
    } = Snow.useSnowContext()
    const {
        bookloreClient,
        routes
    } = C.useAppContext()

    const [pagesInfo, setPagesInfo] = C.React.useState(null)
    const pagesInfoRef = C.React.useRef(null)
    const [localUri, setLocalUri] = C.React.useState(null)
    const { apiClient } = C.useAppContext()
    const [showTwoPages, setShowTwoPages] = C.React.useState(false)
    const showTwoPagesRef = C.React.useRef(showTwoPages)
    const [showCount, setShowCount] = C.React.useState(false)
    const showCountRef = C.React.useRef(showCount)
    const [pageNumber, setPageNumber] = C.React.useState(1)
    const pageNumberRef = C.React.useRef(1)
    const maxPageNumberRef = C.React.useRef(2)

    C.React.useEffect(() => {
        bookloreClient.getCbzPagesInfo(currentRoute.routeParams.bookId).then((response) => {
            setPagesInfo(response)
            maxPageNumberRef.current = response.length
        })
    }, [])

    C.React.useEffect(() => {
        showTwoPagesRef.current = showTwoPages
    }, [showTwoPages])

    C.React.useEffect(() => {
        showCountRef.current = showCount
    }, [showCount])

    const nextPage = () => {
        const page = pageNumberRef.current
        const max = maxPageNumberRef.current
        const diff = showTwoPagesRef.current ? 2 : 1
        if (page < max) {
            pageNumberRef.current += diff
            setPageNumber(page + diff)
        }
        else {
            navPop()
        }
    }

    const previousPage = () => {
        const page = pageNumberRef.current
        const diff = showTwoPagesRef.current ? 2 : 1
        if (page > 1) {
            pageNumberRef.current -= diff
            setPageNumber(page - diff)
        }
        else {
            navPop()
        }
    }

    const imageSource = bookloreClient.getCbzPageImage(currentRoute.routeParams.bookId, pageNumber, bookloreClient.accessToken)
    let images = (
        < C.Image
            style={{
                flex: 1,
                backgroundColor: 'black'
            }}
            contentFit="contain"
            source={imageSource} />
    )
    if (showTwoPages) {
        if (pageNumber + 1 < pagesInfo.length) {
            const secondImageSource = bookloreClient.getCbzPageImage(currentRoute.routeParams.bookId, pageNumber + 1, bookloreClient.accessToken)
            images = (
                <C.View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        backgroundColor: "black",
                    }}
                >
                    <C.Image
                        style={{ flex: 1 }}
                        contentFit="contain"
                        source={imageSource}
                    />
                    <C.Image
                        style={{ flex: 1 }}
                        contentFit="contain"
                        source={secondImageSource}
                    />
                </C.View>
            )
        }
    }

    let countDisplay = null
    if (showCount) {
        countDisplay = (
            <C.View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Snow.Text style={{ margin: 0, padding: 15, backgroundColor: 'black', color: 'white' }}>
                    {`Page ${pageNumber} of ${pagesInfo.length}`}
                </Snow.Text>
            </C.View>
        )
    }

    if (!C.isTV) {
        const tapBook = (evt) => {
            const half = evt.view.innerWidth / 2
            const position = evt.pageX
            if (position >= half) {
                nextPage()
            } else {
                previousPage()
            }
        }
        images = (
            <Pressable style={{ flex: 1 }}>
                {images}
            </Pressable >
        )
    }

    C.React.useEffect(() => {
        const actionListenerKey = addActionListener('book-pages', {
            onRight: () => {
                nextPage()
            },
            onLeft: () => {
                previousPage()
            },
            onUp: () => {
                setShowTwoPages(!showTwoPagesRef.current)
            },
            onDown: () => {
                setShowCount(!showCountRef.current)
            },
            onPress: () => {
                nextPage()
            }
        })
        return () => {
            removeActionListener(actionListenerKey)
        }
    }, [])

    C.React.useEffect(() => {
        pushModal({
            props: {
                assignFocus: false,
                onRequestClose: () => {
                    navPop()
                }
            },
            render: () => {
                if (!pagesInfo) {
                    return <Snow.Text>Loading pages...</Snow.Text>
                }
                return (
                    <>
                        {countDisplay}
                        {images}
                    </>
                )
            }
        })
        return () => {
            popModal()
        }
    }, [pagesInfo, pageNumber, showTwoPages, showCount])

    return null
}
