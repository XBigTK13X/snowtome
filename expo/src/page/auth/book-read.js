import Snow from '@snowsuite/expo-snowui'
import C from '../../common'

export default function BookReadPage(props) {
    const {
        currentRoute,
        pushModal,
        popModal,
        navPop,
        addActionListener,
        removeActionListener,
        getHubState,
        sendHubData,
        resetHub
    } = Snow.useSnowContext()

    const { bookloreClient, bottomPadding } = C.useAppContext()
    const bookId = currentRoute?.routeParams?.bookId

    const isExitingRef = C.React.useRef(false)
    const isMountedRef = C.React.useRef(true)

    const exitReader = C.React.useCallback(() => {
        if (isExitingRef.current) return
        isExitingRef.current = true
        navPop()
    }, [navPop])

    const exitReaderRef = C.React.useRef(exitReader)
    C.React.useEffect(() => {
        exitReaderRef.current = exitReader
    }, [exitReader])

    const onNextPage = C.React.useCallback(() => {
        const state = getHubState()
        const page = state?.pageNumber || 1
        const max = state?.maxPageNumber || 1
        const step = state?.showTwoPages ? 2 : 1

        if (page < max) {
            sendHubData({ pageNumber: page + step }, 'reader.nextPage')
        } else {
            exitReaderRef.current?.()
        }
    }, [getHubState, sendHubData])

    const onPreviousPage = C.React.useCallback(() => {
        const state = getHubState()
        const page = state?.pageNumber || 1
        const step = state?.showTwoPages ? 2 : 1

        if (page > 1) {
            sendHubData({ pageNumber: page - step }, 'reader.prevPage')
        } else {
            exitReaderRef.current?.()
        }
    }, [getHubState, sendHubData])

    C.React.useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    C.React.useEffect(() => {
        resetHub({
            ...C.BookReaderConstants.initialReaderHubState,
            bookId
        })

        if (bookloreClient && bookId) {
            bookloreClient.getCbzPagesInfo(bookId).then((response) => {
                if (!isMountedRef.current || isExitingRef.current) return
                sendHubData({
                    pagesInfo: response,
                    maxPageNumber: response?.length || 1
                }, 'reader.pagesLoaded')
            })
        }

        return () => {
            resetHub(C.BookReaderConstants.initialReaderHubState)
        }
    }, [bookId, bookloreClient])

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
            onBack: () => exitReaderRef.current?.()
        })

        return () => {
            removeActionListener(actionListenerKey)
        }
    }, [onNextPage, onPreviousPage, addActionListener, removeActionListener, sendHubData])

    C.React.useEffect(() => {
        pushModal({
            props: {
                assignFocus: true,
                onRequestClose: () => {
                    exitReaderRef.current?.()
                }
            },
            render: (modalProps) => {
                return (
                    <C.BookReaderModal
                        bookId={bookId}
                        bookloreClient={bookloreClient}
                        bottomPadding={bottomPadding}
                        onNextPage={onNextPage}
                        onPreviousPage={onPreviousPage}
                        onExit={exitReader}
                        parentPath={modalProps?.parentPath}

                    />
                )
            }
        })

        return () => {
            popModal?.()
            exitReaderRef.current?.()
        }
    }, [bookId])

    return <Snow.Target focusStart />
}