#!/bin/bash

rm -rf flaky-flasks

cd ../../gamedev/flaky-flasks
ENV=production ./scripts/build-site.sh

cd ../../luanpotter.github.io/projects
cp -r ../../gamedev/flaky-flasks/site/_site/ flaky-flasks
