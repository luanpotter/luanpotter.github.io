#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# shellcheck source=scripts/_lib.sh
source ./scripts/_lib.sh

require_cmds bun uv

# Clean previous build output
info "Cleaning dist and resume output folders..."
rm -rf dist resume/dist
mkdir -p resume/dist

# Install JS dependencies (idempotent)
info "Installing JS dependencies..."
if ! bun install; then
    error "bun install failed"
fi
success "JS dependencies ready"

# Run linting first
info "Running lint checks..."
if ! ./scripts/lint.sh; then
    error "Lint failed. Fix errors before building."
fi
success "Lint passed"

# Render resume PDF via rendercv into resume/dist/
info "Rendering resume..."
if ! uv run --project resume rendercv render resume/resume.yaml \
    --pdf-path dist/resume.pdf \
    --typst-path dist/resume.typ \
    --dont-generate-png \
    --dont-generate-markdown; then
    error "Resume rendering failed"
fi
if [[ ! -f resume/dist/resume.pdf ]]; then
    error "Resume output missing after rendering"
fi
success "Resume rendered"

# Build the static site
info "Building static site..."
if ! bun run build; then
    error "Build failed"
fi
success "Build completed"

# Publish resume PDF into dist/ (mirrors the projects/* post-build copy)
info "Publishing resume artifacts..."
mkdir -p dist/me
cp resume/dist/resume.pdf dist/me/resume.pdf

# Verify output
if [[ ! -f dist/index.html ]]; then
    error "Build output missing: dist/index.html"
fi
if [[ ! -f dist/me/resume.pdf ]]; then
    error "Resume artifacts missing in dist/"
fi

# Report
FILE_COUNT=$(find dist -type f | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh dist | cut -f1)

echo ""
success "Static site built successfully!"
echo "  Files:  $FILE_COUNT"
echo "  Size:   $TOTAL_SIZE"
echo "  Output: dist/"
