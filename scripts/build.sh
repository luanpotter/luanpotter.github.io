#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${BLUE}▶${NC} $1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

require_cmd() {
    if ! command -v "$1" &>/dev/null; then
        echo -e "${RED}✗ Required command not found:${NC} $1"
        echo -e "  Run ${BLUE}./scripts/setup.sh${NC} to install dependencies"
        exit 1
    fi
}

require_cmd bun

# Clean previous build
info "Cleaning dist folder..."
rm -rf dist

# Run linting first
info "Running lint checks..."
if ! ./scripts/lint.sh; then
    error "Lint failed. Fix errors before building."
fi
success "Lint passed"

# Build the static site
info "Building static site..."
if ! bun run build; then
    error "Build failed"
fi
success "Build completed"

# Verify output
if [[ ! -f dist/index.html ]]; then
    error "Build output missing: dist/index.html"
fi

# Report
FILE_COUNT=$(find dist -type f | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh dist | cut -f1)

echo ""
success "Static site built successfully!"
echo -e "  ${BLUE}Files:${NC} $FILE_COUNT"
echo -e "  ${BLUE}Size:${NC}  $TOTAL_SIZE"
echo -e "  ${BLUE}Output:${NC} dist/"
