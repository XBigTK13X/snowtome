#! /bin/bash

export NODE_ENV="production"

echo "=-=- Build the apks -=-="
script/prod-generate-apks.sh

echo "=-=- Push the apks up to the file server -=-="
~/script/push-apks.py snowtome

echo "=-=- Deploy to the TVs -=-="
~/script/remote-adb.py All deploy_snowtome

unset NODE_ENV