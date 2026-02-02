#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

echo "Running pre-commit lint checks..."
if ! ./scripts/lint.sh; then
    echo "Lint checks failed. Commit aborted."
    exit 1
fi
