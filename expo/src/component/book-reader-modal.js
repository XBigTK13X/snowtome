import React from 'react'
import { Platform, View } from 'react-native'
import Snow from '@snowsuite/expo-snowui'
import ZoomableImage, { ZoomableImageBinder } from './zoomable-image'

export default function BookReaderModal({ bookId, bookloreClient, onNextPage, onPreviousPage, bottomPadding }) {
    const { useHubState, sendHubData } = Snow.useSnowContext()

    const pagesInfo = useHubState((state) => state?.pagesInfo)
    const pageNumber = useHubState((state) => state?.pageNumber) || 1
    const showTwoPages = useHubState((state) => state?.showTwoPages) || false
    const showCount = useHubState((state) => state?.showCount) || false
    const showPagePicker = useHubState((state) => state?.showPagePicker) || false

    if (!pagesInfo || !bookloreClient) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <Snow.Header center>Loading pages...</Snow.Header>
            </View>
        )
    }

    const imageSource = bookloreClient.getCbzPageImage(bookId, pageNumber, bookloreClient.accessToken)
    let images = (
        <Snow.Image
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'black'
            }}
            contentFit="contain"
            source={imageSource}
        />
    )

    if (showTwoPages && pageNumber + 1 < pagesInfo.length) {
        const secondImageSource = bookloreClient.getCbzPageImage(bookId, pageNumber + 1, bookloreClient.accessToken)
        images = (
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    flexDirection: 'row',
                    backgroundColor: 'black'
                }}
            >
                <Snow.Image
                    style={{ flex: 1, width: '50%', height: '100%' }}
                    contentFit="contain"
                    source={imageSource}
                />
                <Snow.Image
                    style={{ flex: 1, width: '50%', height: '100%' }}
                    contentFit="contain"
                    source={secondImageSource}
                />
            </View>
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
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <Snow.Text style={{ margin: 0, padding: 15, backgroundColor: 'black', color: 'white' }}>
                    {`Page ${displayCurrentCount} of ${displayMax}`}
                </Snow.Text>
            </View>
        )
    }

    if (!Platform.isTV && showPagePicker) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black' }}>
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
            </View>
        )
    }

    let modalStyle = { flex: 1, width: '100%', height: '100%', backgroundColor: 'black' }

    if (bottomPadding !== 0) {
        modalStyle.paddingBottom = bottomPadding
    }

    return (
        <View style={modalStyle}>
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
        </View>
    )
}