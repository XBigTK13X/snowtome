import Snow from '@snowsuite/expo-snowui'
import C from '../../common'
import { Dimensions, PanResponder, Animated } from 'react-native'

const TAP_BORDER_PERCENT = 0.15
const SWIPE_THRESHOLD_X = 50
const SWIPE_THRESHOLD_Y = 80
const PINCH_RELEASE_THRESHOLD = 300
const DOUBLE_TAP_THRESHOLD = 300
const PAGE_TURN_ZOOM_THRESHOLD = 1.15

export const initialReaderHubState = {
    bookId: null,
    pagesInfo: null,
    pageNumber: 1,
    maxPageNumber: 1,
    showTwoPages: false,
    showCount: false,
    showPagePicker: false
}

function getDistance(touches) {
    const dx = touches[0].pageX - touches[1].pageX
    const dy = touches[0].pageY - touches[1].pageY
    return Math.sqrt(dx * dx + dy * dy)
}

const ZoomableImageContext = C.React.createContext(null)

function useZoomableImage(handlers) {
    const ctx = C.React.useContext(ZoomableImageContext)
    C.React.useEffect(() => {
        if (!ctx) return
        ctx.onNextPage.current = handlers.onNextPage
        ctx.onPreviousPage.current = handlers.onPreviousPage
        ctx.onSwipeUp.current = handlers.onSwipeUp
        ctx.onSwipeDown.current = handlers.onSwipeDown
    }, [handlers.onNextPage, handlers.onPreviousPage, handlers.onSwipeUp, handlers.onSwipeDown])
}

function ZoomableImageBinder({ onNextPage, onPreviousPage, onSwipeUp, onSwipeDown }) {
    useZoomableImage({ onNextPage, onPreviousPage, onSwipeUp, onSwipeDown })
    return null
}

function ZoomableImage({ children }) {
    const scaleRef = C.React.useRef(1)
    const translateXRef = C.React.useRef(0)
    const translateYRef = C.React.useRef(0)
    const scaleAnim = C.React.useRef(new Animated.Value(1)).current
    const translateXAnim = C.React.useRef(new Animated.Value(0)).current
    const translateYAnim = C.React.useRef(new Animated.Value(0)).current

    const initialPinchDistance = C.React.useRef(0)
    const pinchActive = C.React.useRef(false)
    const lastPinchTime = C.React.useRef(-1)
    const lastTapTime = C.React.useRef(-1)
    const tapCount = C.React.useRef(0)
    const doubleTapTime = C.React.useRef(-1)
    const touchStart = C.React.useRef({ x: 0, y: 0 })
    const panStart = C.React.useRef({ x: 0, y: 0 })
    const panActive = C.React.useRef(false)

    const onNextPage = C.React.useRef(null)
    const onPreviousPage = C.React.useRef(null)
    const onSwipeUp = C.React.useRef(null)
    const onSwipeDown = C.React.useRef(null)

    const resetZoom = C.React.useCallback(() => {
        scaleRef.current = 1
        translateXRef.current = 0
        translateYRef.current = 0
        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(translateXAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(translateYAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start()
    }, [])

    const panResponder = C.React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const now = Date.now()
                const touches = evt.nativeEvent.touches

                if (touches.length === 1) {
                    if (lastTapTime.current !== -1 && now - lastTapTime.current < DOUBLE_TAP_THRESHOLD) {
                        tapCount.current += 1
                    } else {
                        tapCount.current = 1
                    }
                    if (tapCount.current >= 3) {
                        resetZoom()
                        doubleTapTime.current = now
                        lastTapTime.current = -1
                        tapCount.current = 0
                        return
                    }
                    touchStart.current = { x: touches[0].pageX, y: touches[0].pageY }
                    panActive.current = false
                    lastTapTime.current = now
                }
            },
            onPanResponderMove: (evt) => {
                const touches = evt.nativeEvent.touches

                if (touches.length >= 2) {
                    const dist = getDistance(touches)
                    if (!pinchActive.current) {
                        pinchActive.current = true
                        initialPinchDistance.current = dist
                        return
                    }
                    const newScale = Math.max(0.5, scaleRef.current * (dist / initialPinchDistance.current))
                    initialPinchDistance.current = dist
                    scaleRef.current = newScale
                    scaleAnim.setValue(newScale)
                    lastPinchTime.current = Date.now()
                } else if (touches.length === 1 && !pinchActive.current && scaleRef.current > PAGE_TURN_ZOOM_THRESHOLD) {
                    if (!panActive.current) {
                        panActive.current = true
                        touchStart.current = { x: touches[0].pageX, y: touches[0].pageY }
                        panStart.current = { x: translateXRef.current, y: translateYRef.current }
                        return
                    }
                    const dX = (touches[0].pageX - touchStart.current.x) / scaleRef.current
                    const dY = (touches[0].pageY - touchStart.current.y) / scaleRef.current
                    const { width, height } = Dimensions.get('window')
                    const maxX = (width * (scaleRef.current - 1)) / 2
                    const maxY = (height * (scaleRef.current - 1)) / 2
                    const newX = Math.max(-maxX, Math.min(maxX, panStart.current.x + dX))
                    const newY = Math.max(-maxY, Math.min(maxY, panStart.current.y + dY))
                    translateXRef.current = newX
                    translateYRef.current = newY
                    translateXAnim.setValue(newX)
                    translateYAnim.setValue(newY)
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                const now = Date.now()

                if (pinchActive.current) {
                    pinchActive.current = false
                    lastPinchTime.current = now
                    if (scaleRef.current < 1) {
                        resetZoom()
                    } else {
                        const { width, height } = Dimensions.get('window')
                        const maxX = (width * (scaleRef.current - 1)) / 2
                        const maxY = (height * (scaleRef.current - 1)) / 2
                        const clampedX = Math.max(-maxX, Math.min(maxX, translateXRef.current))
                        const clampedY = Math.max(-maxY, Math.min(maxY, translateYRef.current))
                        translateXRef.current = clampedX
                        translateYRef.current = clampedY
                        translateXAnim.setValue(clampedX)
                        translateYAnim.setValue(clampedY)
                    }
                    return
                }

                if (lastPinchTime.current !== -1 && now - lastPinchTime.current < PINCH_RELEASE_THRESHOLD) {
                    return
                }
                if (doubleTapTime.current !== -1 && now - doubleTapTime.current < PINCH_RELEASE_THRESHOLD) {
                    doubleTapTime.current = -1
                    return
                }

                if (scaleRef.current > PAGE_TURN_ZOOM_THRESHOLD) {
                    return
                }

                const dX = gestureState.dx
                const dY = gestureState.dy
                const { width } = Dimensions.get('window')
                const leftBorder = width * TAP_BORDER_PERCENT
                const rightBorder = width - leftBorder
                const startX = touchStart.current.x
                const endX = startX + dX

                if (Math.abs(dX) < 10 && Math.abs(dY) < 10) {
                    if (startX < leftBorder && endX < leftBorder) {
                        onPreviousPage.current?.()
                    } else if (startX > rightBorder && endX > rightBorder) {
                        onNextPage.current?.()
                    }
                } else if (Math.abs(dY) >= Math.abs(dX)) {
                    if (dY > SWIPE_THRESHOLD_Y) {
                        onSwipeDown.current?.()
                    } else if (dY < -SWIPE_THRESHOLD_Y) {
                        onSwipeUp.current?.()
                    }
                } else {
                    if (dX > SWIPE_THRESHOLD_X) {
                        onPreviousPage.current?.()
                    } else if (dX < -SWIPE_THRESHOLD_X) {
                        onNextPage.current?.()
                    }
                }
            },
        })
    ).current

    return (
        <ZoomableImageContext.Provider value={{ onNextPage, onPreviousPage, onSwipeUp, onSwipeDown, resetZoom }}>
            <C.View style={{ flex: 1, overflow: 'hidden' }} {...panResponder.panHandlers}>
                <Animated.View
                    style={{
                        flex: 1,
                        transform: [
                            { scale: scaleAnim },
                            { translateX: translateXAnim },
                            { translateY: translateYAnim },
                        ],
                    }}
                >
                    {children}
                </Animated.View>
            </C.View>
        </ZoomableImageContext.Provider>
    )
}

function ReaderModalContent({ bookId, onNextPage, onPreviousPage }) {
    const { useHubState, sendHubData } = Snow.useSnowContext()
    const { bookloreClient } = C.useAppContext()

    const pagesInfo = useHubState((state) => state?.pagesInfo)
    const pageNumber = useHubState((state) => state?.pageNumber) || 1
    const showTwoPages = useHubState((state) => state?.showTwoPages) || false
    const showCount = useHubState((state) => state?.showCount) || false
    const showPagePicker = useHubState((state) => state?.showPagePicker) || false

    if (!pagesInfo) {
        return (
            <C.View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <Snow.Header center>Loading pages...</Snow.Header>
            </C.View>
        )
    }

    const imageSource = bookloreClient.getCbzPageImage(bookId, pageNumber, bookloreClient.accessToken)
    let images = (
        <C.Image
            style={{
                flex: 1,
                backgroundColor: 'black'
            }}
            contentFit="contain"
            source={imageSource}
        />
    )

    if (showTwoPages && pageNumber + 1 < pagesInfo.length) {
        const secondImageSource = bookloreClient.getCbzPageImage(bookId, pageNumber + 1, bookloreClient.accessToken)
        images = (
            <C.View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: 'black',
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

    let countDisplay = null
    if (showCount) {
        let displayCurrentCount = pageNumber
        if (pageNumber > 2) {
            displayCurrentCount = (2 * pageNumber) - 2
        }
        let displayMax = (pagesInfo.length * 2) - 2
        countDisplay = (
            <C.View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <Snow.Text style={{ margin: 0, padding: 15, backgroundColor: 'black', color: 'white' }}>
                    {`Page ${displayCurrentCount} of ${displayMax}`}
                </Snow.Text>
            </C.View>
        )
    }

    if (!C.isTV && showPagePicker) {
        return (
            <C.View style={{ flex: 1, backgroundColor: 'black' }}>
                {countDisplay}
                <Snow.Grid items={pagesInfo} renderItem={(pageInfo) => {
                    let pageDisplay = pageInfo?.pageNumber
                    if (pageDisplay > 1) {
                        pageDisplay *= 2
                    }
                    return (
                        <Snow.TextButton
                            title={pageDisplay}
                            onPress={() => {
                                sendHubData({
                                    pageNumber: pageInfo?.pageNumber,
                                    showPagePicker: false
                                }, 'reader.pageSelected')
                            }}
                        />
                    )
                }} />
            </C.View>
        )
    }

    return (
        <C.View style={{ flex: 1, backgroundColor: 'black' }}>
            {countDisplay}
            <ZoomableImage>
                <ZoomableImageBinder
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                    onSwipeUp={() => sendHubData({ showPagePicker: true }, 'reader.openPicker')}
                    onSwipeDown={() => {
                        sendHubData((prev) => ({ showCount: !prev?.showCount }), 'reader.toggleCount')
                    }}
                />
                {images}
            </ZoomableImage>
            <C.View style={{ marginTop: 55 }} />
        </C.View>
    )
}

export default function BookDetailsPage(props) {
    const {
        currentRoute,
        pushModal,
        popModal,
        clearModals,
        navPop,
        addActionListener,
        removeActionListener,
        getHubState,
        sendHubData,
        resetHub
    } = Snow.useSnowContext()

    const { bookloreClient } = C.useAppContext()
    const bookId = currentRoute?.routeParams?.bookId

    const didExitRef = C.React.useRef(false)

    const exitReader = C.React.useCallback(() => {
        if (didExitRef.current) return
        didExitRef.current = true
        clearModals?.()
        navPop?.()
    }, [clearModals, navPop])

    const onNextPage = C.React.useCallback(() => {
        const state = getHubState()
        const page = state?.pageNumber || 1
        const max = state?.maxPageNumber || 1
        const step = state?.showTwoPages ? 2 : 1

        if (page < max) {
            sendHubData({ pageNumber: page + step }, 'reader.nextPage')
        } else {
            exitReader()
        }
    }, [getHubState, sendHubData, exitReader])

    const onPreviousPage = C.React.useCallback(() => {
        const state = getHubState()
        const page = state?.pageNumber || 1
        const step = state?.showTwoPages ? 2 : 1

        if (page > 1) {
            sendHubData({ pageNumber: page - step }, 'reader.prevPage')
        } else {
            exitReader()
        }
    }, [getHubState, sendHubData, exitReader])

    C.React.useEffect(() => {
        resetHub({
            ...initialReaderHubState,
            bookId
        })

        bookloreClient.getCbzPagesInfo(bookId).then((response) => {
            sendHubData({
                pagesInfo: response,
                maxPageNumber: response?.length || 1
            }, 'reader.pagesLoaded')
        })

        return () => {
            resetHub(initialReaderHubState)
        }
    }, [bookId])

    C.React.useEffect(() => {
        const actionListenerKey = addActionListener('book-pages', {
            onRight: () => onNextPage(),
            onLeft: () => onPreviousPage(),
            onUp: () => {
                sendHubData((prev) => ({ showTwoPages: !prev?.showTwoPages }), 'reader.toggleTwoPages')
            },
            onDown: () => {
                sendHubData((prev) => ({ showCount: !prev?.showCount }), 'reader.toggleCount')
            },
            onPress: () => onNextPage(),
            onBack: () => exitReader()
        })

        return () => {
            removeActionListener(actionListenerKey)
        }
    }, [onNextPage, onPreviousPage, exitReader, addActionListener, removeActionListener, sendHubData])

    C.React.useEffect(() => {
        pushModal({
            props: {
                assignFocus: false,
                onRequestClose: () => exitReader()
            },
            render: () => {
                return (
                    <ReaderModalContent
                        bookId={bookId}
                        onNextPage={onNextPage}
                        onPreviousPage={onPreviousPage}
                    />
                )
            }
        })

        return () => {
            popModal()
        }
    }, [bookId])

    return null
}