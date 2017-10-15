#!/bin/bash

rm -rf rubiks
mkdir rubiks

cd ../../rubiks
yarn
./node_modules/.bin/webpack
cp index.html ../luanpotter.github.io/projects/rubiks/
cp bundle.js ../luanpotter.github.io/projects/rubiks/
