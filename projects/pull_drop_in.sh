#!/bin/bash

set -euo pipefail

rm -rf drop-in
mkdir drop-in

(cd ../../drop-in && ./scripts/build.sh)
cp -r ../../drop-in/packages/website/dist/* ./drop-in/
