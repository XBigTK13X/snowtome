import React from 'react'

import {
    Dimensions,
    Linking,
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

import Snow, {
    Image
} from '@snowsuite/expo-snowui'

import { useDebouncedCallback } from 'use-debounce';

import util from './util'

import download from './download'

import cache from './cache'

import { useAppContext } from './app-context'

const isWeb = Platform.OS === 'web'
const isAndroid = Platform.OS === 'android'
const isTV = Platform.isTV

import BookList from './component/book-list'
import BookReaderConstants from './component/book-reader-constants'
import BookReaderModal from './component/book-reader-modal'
import ZoomableImage from './component/zoomable-image'

export default {
    cache,
    download,
    isAndroid,
    isTV,
    isWeb,
    useAppContext,
    useDebouncedCallback,
    util,
    Snow,
    BookList,
    BookReaderConstants,
    BookReaderModal,
    Image,
    Linking,
    Modal,
    React,
    ScrollView,
    TouchableOpacity,
    View,
    ZoomableImage,
}
