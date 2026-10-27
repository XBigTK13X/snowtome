export const TAP_BORDER_PERCENT = 0.15
export const SWIPE_THRESHOLD_X = 50
export const SWIPE_THRESHOLD_Y = 80
export const PINCH_RELEASE_THRESHOLD = 300
export const DOUBLE_TAP_THRESHOLD = 300
export const PAGE_TURN_ZOOM_THRESHOLD = 1.15

export const initialReaderHubState = {
    bookId: null,
    pagesInfo: null,
    pageNumber: 1,
    maxPageNumber: 1,
    showTwoPages: false,
    showCount: false,
    showPagePicker: false
}

export default {
    initialReaderHubState,
    TAP_BORDER_PERCENT,
    SWIPE_THRESHOLD_X,
    SWIPE_THRESHOLD_Y,
    PINCH_RELEASE_THRESHOLD,
    DOUBLE_TAP_THRESHOLD,
    PAGE_TURN_ZOOM_THRESHOLD
}