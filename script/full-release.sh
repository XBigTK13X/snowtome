#! /bin/bash

export NODE_ENV="production"

echo "=-=- Build the apks -=-="
script/prod-generate-apks.sh

echo "=-=- Push the apks up to the file server -=-="
~/script/push-apks.sh snowtome

echo "=-=- Deploy the apks to all devices -=-="
~/script/remote-adb.py All deploy_snowtome

unset NODE_ENV