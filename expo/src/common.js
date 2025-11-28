import React from 'react'

import { Image } from 'expo-image'

import {
    useSnowContext
} from 'expo-snowui'

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

import Snow, {
    SnowApp,
    SnowFillView,
    SnowGrid,
    SnowHeader,
    SnowImageButton,
    SnowInput,
    SnowLabel,
    SnowText,
    SnowTextButton,
} from 'expo-snowui'

const isWeb = Platform.OS === 'web'
const isAndroid = Platform.OS === 'android'
const isTV = Platform.isTV

export default {
    Snow,
    isAndroid,
    isTV,
    isWeb,
    useSnowContext,
    useAppContext,
    useDebouncedCallback,
    util,
    FillView: SnowFillView,
    Image,
    Linking,
    Modal,
    React,
    ScrollView,
    SnowApp,
    SnowGrid,
    SnowHeader,
    SnowImageButton,
    SnowInput,
    SnowLabel,
    SnowText,
    SnowTextButton,
    TouchableOpacity,
    View,
}
