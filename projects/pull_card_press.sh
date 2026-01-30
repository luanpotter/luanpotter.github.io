#!/bin/bash

rm -rf card-press
mkdir card-press

cd ../../card-press
./scripts/build.sh
sed -i "s/\[\[\[VERSION\]\]\]/$(git rev-parse --short HEAD)/g" dist/assets/*.js
cd -

cp -r ../../card-press/dist/* ./card-press
