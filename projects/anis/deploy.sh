#!/bin/bash

cd ../../../luanpotter.github.io/projects
git pull --rebase

./pull_anis.sh

git add -A
git commit -m '.'
git push
