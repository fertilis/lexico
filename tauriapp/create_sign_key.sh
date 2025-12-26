#!/bin/bash
set -e

: "${ANDROID_KEYSTORE_PATH:?Missing ANDROID_KEYSTORE_PATH}"
: "${ANDROID_KEY_ALIAS:?Missing ANDROID_KEY_ALIAS}"
: "${ANDROID_KEYSTORE_PASSWORD:?Missing ANDROID_KEYSTORE_PASSWORD}"

# Ensure parent directory exists
mkdir -p "$(dirname "$ANDROID_KEYSTORE_PATH")"

# Check if alias already exists
if keytool -list \
    -keystore "$ANDROID_KEYSTORE_PATH" \
    -alias "$ANDROID_KEY_ALIAS" \
    -storepass "$ANDROID_KEYSTORE_PASSWORD" \
    >/dev/null 2>&1; then
  echo "Keystore alias '$ANDROID_KEY_ALIAS' already exists. Skipping generation."
else
  echo "Generating Android release keystore..."
  keytool -genkeypair \
    -keystore "$ANDROID_KEYSTORE_PATH" \
    -alias "$ANDROID_KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$ANDROID_KEYSTORE_PASSWORD" \
    -dname "CN=My App,O=My Company,C=US"
fi
