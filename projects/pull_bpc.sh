#!/bin/bash

set -euo pipefail

project="bpc"

rm -rf "$project"
mkdir "$project"

cd ../../"$project"
./scripts/build.sh
cd -

cp -r ../../"$project"/dist/* ./"$project"
