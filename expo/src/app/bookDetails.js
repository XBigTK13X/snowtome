import C from '../common'
import { TVEventHandler, useTVEventHandler } from 'react-native';

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function BookDetailsPage() {
    const { routes, apiClient } = C.useAppContext()
    const localParams = C.useLocalSearchParams()
    const [pages, setPages] = C.React.useState(null)
    const [showTwoPages, setShowTwoPages] = C.React.useState(false)
    const [pageNumber, setPageNumber] = C.React.useState(1)
    const pageNumberRef = C.React.useRef(1)
    const maxPageNumberRef = C.React.useRef(2)
    const [showCount, setShowCount] = C.React.useState(false)

    C.React.useEffect(() => {
        if (!pages) {
            apiClient.getPageList(localParams.bookId).then((response) => {
                setPages(response)
                maxPageNumberRef.current = response.length
            })

        }
    })


    const myTVEventHandler = evt => {
        const page = pageNumberRef.current
        const max = maxPageNumberRef.current
        const diff = showTwoPages ? 2 : 1
        if (evt.eventType === 'right' || evt.eventType === 'select') {
            if (page < max) {
                pageNumberRef.current += diff
                setPageNumber(page + diff)
            }
            else {
                routes.back()
            }
        }
        else if (evt.eventType === 'left') {
            if (page > 1) {
                pageNumberRef.current -= diff
                setPageNumber(page - diff)
            }
            else {
                routes.back()
            }
        }
        else if (evt.eventType === 'up') {
            setShowTwoPages(!showTwoPages)
        }
        else if (evt.eventType === 'down') {
            setShowCount(!showCount)
        }
    };


    if (C.isTV) {
        useTVEventHandler(myTVEventHandler);
    }


    if (!pages) {
        return <C.SnowText>Loading pages...</C.SnowText>
    }

    const imageSource = apiClient.getPage(localParams.bookId, pageNumber)
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
        if (pageNumber + 1 < pages.length) {
            const secondImageSource = apiClient.getPage(localParams.bookId, pageNumber + 1)
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
        countDisplay = <C.SnowText style={{ margin: 0, padding: 0, backgroundColor: 'black', color: 'white' }}>
            {`Page ${pageNumber} of ${pages.length}`}
        </C.SnowText>
    }

    return (
        <C.Modal
            style={{ flex: 1, backgroundColor: 'black' }}
            onRequestClose={() => { routes.back() }} >
            {countDisplay}
            {images}
        </ C.Modal>
    )
}
