#!/bin/bash

rm -rf cora
mkdir cora

cd ../../cora
yarn
webpack
cp index.html ../luanpotter.github.io/projects/cora/
cp bundle.js ../luanpotter.github.io/projects/cora/
cp -r images ../luanpotter.github.io/projects/cora/
