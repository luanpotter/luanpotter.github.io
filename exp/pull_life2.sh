#!/bin/bash

rm -rf life2
mkdir life2

cd ../../gamedev/life2/game
git_tag=`git log --pretty=format:'%h' -n 1`
flutter build web
cp -r build/web/* ../../../luanpotter.github.io/exp/life2
perl -i -pe "s/gitVersionTag:dev/gitVersionTag:$git_tag/" ../../../luanpotter.github.io/exp/life2/*.js
