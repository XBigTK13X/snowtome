#! /bin/bash

echo "THIS IS THE ONE TO USE!"

source script/variables.sh

cd expo/android
mkdir -p build-out
export EXPO_TV=0
./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk build-out/snowtome-mobile.apk