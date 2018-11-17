#!/bin/bash

cd ../../../luanpotter.github.io/projects
gpr

./pull_anis.sh

git add -A
git commit -m '.'
git push
