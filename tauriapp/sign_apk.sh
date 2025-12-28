#!/bin/bash
set -e

VERSION=$1

SCRIPT_DIR="$(cd "$(realpath $(dirname "${BASH_SOURCE[0]}"))" && pwd)"
DIST_DIR=$SCRIPT_DIR/dist

: "${ANDROID_KEYSTORE_PATH:?Missing ANDROID_KEYSTORE_PATH}"
: "${ANDROID_KEYSTORE_PASSWORD:?Missing ANDROID_KEYSTORE_PASSWORD}"
: "${ANDROID_KEY_ALIAS:?Missing ANDROID_KEY_ALIAS}"

mkdir -p $DIST_DIR
rm -f $DIST_DIR/lexico.apk

apksigner sign \
  --ks "$ANDROID_KEYSTORE_PATH" \
  --ks-key-alias "$ANDROID_KEY_ALIAS" \
  --ks-pass env:ANDROID_KEYSTORE_PASSWORD \
  --out $DIST_DIR/lexico-$VERSION.apk \
  $SCRIPT_DIR/src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk
