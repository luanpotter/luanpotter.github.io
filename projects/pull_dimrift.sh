#!/bin/bash

rm -rf dim-rift

cd ../../gamedev/dimensional-rift
ENV=production ./scripts/build-site.sh
find site/_site -name '*.html' -exec sed -i "s/\[\[\[VERSION\]\]\]/$(git rev-parse --short HEAD)/g" {} +

cd ../../luanpotter.github.io/projects
cp -r ../../gamedev/dimensional-rift/site/_site/ dim-rift
