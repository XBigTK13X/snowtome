#! /bin/bash

cd expo
export BROWSER=none
if [ -z "$1" ]; then
    echo "Running dev web client"
    npx expo start --web -c
else
    echo "Running prod web client"
    npx expo start --web --no-dev --minify -c
fi
cd ..