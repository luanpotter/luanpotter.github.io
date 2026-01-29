#!/bin/bash

rm -rf card-press
mkdir card-press
(cd ../../card-press && rm -rf dist/ && ./scripts/build.sh --deploy)
cp -r ../../card-press/dist/* ./card-press
