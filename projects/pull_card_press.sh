#!/bin/bash

rm -rf card-press
mkdir card-press
(cd ../../card-press && ./scripts/build.sh --deploy)
cp -r ../../card-press/dist/* ./card-press
