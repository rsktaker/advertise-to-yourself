#!/bin/sh
# Builds the Chrome Web Store package: goals stored in chrome.storage.sync,
# no demo goals, no Hammerspoon. Output: dist/advertise-to-yourself-<version>.zip
set -e
cd "$(dirname "$0")"
VERSION=$(python3 -c 'import json; print(json.load(open("extension/manifest.json"))["version"])')
rm -rf dist/store && mkdir -p dist/store
cp extension/manifest.json extension/newtab.html extension/script.js extension/style.css extension/icon-*.png dist/store/
printf 'const STORE = true;\n' > dist/store/mode.js
printf 'const GOALS = [];\n' > dist/store/goals.js
rm -f "dist/advertise-to-yourself-$VERSION.zip"
(cd dist/store && zip -qr "../advertise-to-yourself-$VERSION.zip" .)
echo "dist/advertise-to-yourself-$VERSION.zip"
