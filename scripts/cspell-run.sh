#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

cspell "$@" --no-progress -c .github/cspell.json "src/**/*.{md,ts,astro}"
