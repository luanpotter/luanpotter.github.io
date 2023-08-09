#!/bin/bash

rm -rf dim-rift

cd ../../gamedev/dimensional-rift
./scripts/build-site.sh

cd ../../luanpotter.github.io/projects
cp -r ../../gamedev/dimensional-rift/site/_site/ dim-rift
