#!/bin/bash

rm -rf table-maker
mkdir table-maker

cd ../../labs/labs-table-maker
yarn
webpack
cp dist/* ../../luanpotter.github.io/exp/table-maker/
