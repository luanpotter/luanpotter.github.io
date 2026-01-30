#!/bin/bash

set -euo pipefail

rm -rf card-press
mkdir card-press

cd ../../card-press
./scripts/build.sh
sed -i "s/\[\[\[VERSION\]\]\]/$(git rev-parse --short HEAD)/g" dist/*.js
cd -

cp -r ../../card-press/dist/* ./card-press
