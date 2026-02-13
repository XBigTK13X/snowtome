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

import { useDebouncedCallback } from 'use-debounce';

import util from './util'

import { useAppContext } from './app-context'

const isWeb = Platform.OS === 'web'
const isAndroid = Platform.OS === 'android'
const isTV = Platform.isTV

export default {
    isAndroid,
    isTV,
    isWeb,
    useAppContext,
    useDebouncedCallback,
    util,
    Image,
    Linking,
    Modal,
    React,
    ScrollView,
    TouchableOpacity,
    View,
}
