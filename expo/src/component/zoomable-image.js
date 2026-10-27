import React from 'react'
import { Dimensions, PanResponder, Animated, View } from 'react-native'
import {
    TAP_BORDER_PERCENT,
    SWIPE_THRESHOLD_X,
    SWIPE_THRESHOLD_Y,
    PINCH_RELEASE_THRESHOLD,
    DOUBLE_TAP_THRESHOLD,
    PAGE_TURN_ZOOM_THRESHOLD
} from './book-reader-constants'

function getDistance(touches) {
    const deltaX = touches[0].pageX - touches[1].pageX
    const deltaY = touches[0].pageY - touches[1].pageY
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}

const ZoomableImageContext = React.createContext(null)

export function useZoomableImage(handlers) {
    const context = React.useContext(ZoomableImageContext)
    React.useEffect(() => {
        if (!context) return
        context.onNextPage.current = handlers.onNextPage
        context.onPreviousPage.current = handlers.onPreviousPage
        context.onSwipeUp.current = handlers.onSwipeUp
        context.onSwipeDown.current = handlers.onSwipeDown
    }, [handlers.onNextPage, handlers.onPreviousPage, handlers.onSwipeUp, handlers.onSwipeDown])
}

export function ZoomableImageBinder({ onNextPage, onPreviousPage, onSwipeUp, onSwipeDown }) {
    useZoomableImage({ onNextPage, onPreviousPage, onSwipeUp, onSwipeDown })
    return null
}

export default function ZoomableImage({ children }) {
    const scaleRef = React.useRef(1)
    const translateXRef = React.useRef(0)
    const translateYRef = React.useRef(0)
    const scaleAnim = React.useRef(new Animated.Value(1)).current
    const translateXAnim = React.useRef(new Animated.Value(0)).current
    const translateYAnim = React.useRef(new Animated.Value(0)).current

    const initialPinchDistance = React.useRef(0)
    const pinchActive = React.useRef(false)
    const lastPinchTime = React.useRef(-1)
    const lastTapTime = React.useRef(-1)
    const tapCount = React.useRef(0)
    const doubleTapTime = React.useRef(-1)
    const touchStart = React.useRef({ x: 0, y: 0 })
    const panStart = React.useRef({ x: 0, y: 0 })
    const panActive = React.useRef(false)

    const onNextPage = React.useRef(null)
    const onPreviousPage = React.useRef(null)
    const onSwipeUp = React.useRef(null)
    const onSwipeDown = React.useRef(null)

    const resetZoom = React.useCallback(() => {
        scaleRef.current = 1
        translateXRef.current = 0
        translateYRef.current = 0
        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(translateXAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(translateYAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start()
    }, [])

    const panResponder = React.useRef(
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
                    const diffX = (touches[0].pageX - touchStart.current.x) / scaleRef.current
                    const diffY = (touches[0].pageY - touchStart.current.y) / scaleRef.current
                    const { width, height } = Dimensions.get('window')
                    const maxX = (width * (scaleRef.current - 1)) / 2
                    const maxY = (height * (scaleRef.current - 1)) / 2
                    const newX = Math.max(-maxX, Math.min(maxX, panStart.current.x + diffX))
                    const newY = Math.max(-maxY, Math.min(maxY, panStart.current.y + diffY))
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

                const deltaX = gestureState.dx
                const deltaY = gestureState.dy
                const { width } = Dimensions.get('window')
                const leftBorder = width * TAP_BORDER_PERCENT
                const rightBorder = width - leftBorder
                const startX = touchStart.current.x
                const endX = startX + deltaX

                if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                    if (startX < leftBorder && endX < leftBorder) {
                        onPreviousPage.current?.()
                    } else if (startX > rightBorder && endX > rightBorder) {
                        onNextPage.current?.()
                    }
                } else if (Math.abs(deltaY) >= Math.abs(deltaX)) {
                    if (deltaY > SWIPE_THRESHOLD_Y) {
                        onSwipeDown.current?.()
                    } else if (deltaY < -SWIPE_THRESHOLD_Y) {
                        onSwipeUp.current?.()
                    }
                } else {
                    if (deltaX > SWIPE_THRESHOLD_X) {
                        onPreviousPage.current?.()
                    } else if (deltaX < -SWIPE_THRESHOLD_X) {
                        onNextPage.current?.()
                    }
                }
            },
        })
    ).current

    return (
        <ZoomableImageContext.Provider value={{ onNextPage, onPreviousPage, onSwipeUp, onSwipeDown, resetZoom }}>
            <View style={{ flex: 1, width: '100%', height: '100%', overflow: 'hidden' }} {...panResponder.panHandlers}>
                <Animated.View
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: [
                            { scale: scaleAnim },
                            { translateX: translateXAnim },
                            { translateY: translateYAnim },
                        ],
                    }}
                >
                    {children}
                </Animated.View>
            </View>
        </ZoomableImageContext.Provider>
    )
}