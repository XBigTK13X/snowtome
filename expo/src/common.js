import React from 'react'

import {
    Link,
    Redirect,
    Slot,
    Stack,
    useLocalSearchParams,
    useNavigation,
    useRouter
} from 'expo-router'

import { Image } from 'expo-image'

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

import {
    SnowFillView,
    SnowGrid,
    SnowHeader,
    SnowImageButton,
    SnowInput,
    SnowLabel,
    SnowText,
    SnowTextButton,
} from 'react-native-snowui'

const isWeb = Platform.OS === 'web'
const isAndroid = Platform.OS === 'android'
const isTV = Platform.isTV

export default {
    isAndroid,
    isTV,
    isWeb,
    useAppContext,
    useDebouncedCallback,
    useLocalSearchParams,
    useNavigation,
    useRouter,
    util,
    FillView: SnowFillView,
    Image,
    Link,
    Linking,
    Modal,
    Platform,
    React,
    Redirect,
    ScrollView,
    Slot,
    SnowGrid,
    SnowHeader,
    SnowImageButton,
    SnowInput,
    SnowLabel,
    SnowText,
    SnowTextButton,
    Stack,
    TouchableOpacity,
    View,
}
