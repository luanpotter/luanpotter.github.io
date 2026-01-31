#!/bin/bash

rm -rf labs
mkdir labs

cd ../../labs/labs-web
yarn
webpack
cp dist/* ../../luanpotter.github.io/exp/labs/
