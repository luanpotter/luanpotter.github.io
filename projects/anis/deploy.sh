#!/bin/bash

cd ../../../luanpotter.github.io/projects
./pull_anis.sh

git add -A
git commit -m '.'
git push
