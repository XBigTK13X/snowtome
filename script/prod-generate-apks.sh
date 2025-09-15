#! /bin/bash

echo "THIS IS THE ONE TO USE!"

cd expo/android
mkdir -p build-out
export EXPO_TV=1
./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk build-out/snowtome-tv.apk