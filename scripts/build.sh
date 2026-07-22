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

# Render resume (PDF + HTML) via rendercv into resume/dist/
info "Rendering resume..."
if ! uv run --project resume rendercv render resume/resume.yaml \
    --pdf-path dist/resume.pdf \
    --html-path dist/resume.html \
    --typst-path dist/resume.typ \
    --markdown-path dist/resume.md \
    --dont-generate-png; then
    error "Resume rendering failed"
fi
if [[ ! -f resume/dist/resume.pdf ]] || [[ ! -f resume/dist/resume.html ]]; then
    error "Resume output missing after rendering"
fi
success "Resume rendered"

# Build the static site
info "Building static site..."
if ! bun run build; then
    error "Build failed"
fi
success "Build completed"

# Publish resume artifacts into dist/ (mirrors the projects/* post-build copy)
info "Publishing resume artifacts..."
mkdir -p dist/me/resume
cp resume/dist/resume.pdf dist/me/resume.pdf
cp resume/dist/resume.html dist/me/resume.html
cp resume/dist/resume.html dist/me/resume/index.html

# Verify output
if [[ ! -f dist/index.html ]]; then
    error "Build output missing: dist/index.html"
fi
if [[ ! -f dist/me/resume.pdf ]] || [[ ! -f dist/me/resume.html ]]; then
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
