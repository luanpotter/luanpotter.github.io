#!/bin/bash

rm -rf life2
mkdir life2

cd ../../gamedev/life2/game
flutter build web
cp -r build/web/* ../../../luanpotter.github.io/exp/life2
