#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

FAILED=0
FIX=0

# Parse arguments
if [[ "${1:-}" == "--fix" ]]; then
    FIX=1
fi

require_cmd() {
    if ! command -v "$1" &>/dev/null; then
        echo -e "${RED}✗ Required command not found:${NC} $1"
        echo -e "  Run ${BLUE}./scripts/setup.sh${NC} to install dependencies"
        exit 1
    fi
}

run_check() {
    local name="$1"
    shift
    echo -e "${BLUE}▶ Running:${NC} $name"
    if "$@"; then
        echo -e "${GREEN}✓ Passed:${NC} $name\n"
    else
        echo -e "${RED}✗ Failed:${NC} $name\n"
        FAILED=1
    fi
}

if [[ "$FIX" -eq 1 ]]; then
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}                    Fixing All Issues                        ${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
else
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}                    Running All Checks                       ${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
fi

# Check required commands
require_cmd bun
require_cmd shellcheck
require_cmd shfmt
require_cmd actionlint
require_cmd cspell
require_cmd markdownlint

# Astro check (TypeScript + Astro validation)
run_check "Astro Check" bun run check

# Prettier formatting
if [[ "$FIX" -eq 1 ]]; then
    run_check "Prettier (fix)" bun run prettier --write src
else
    run_check "Prettier" bun run prettier --check src
fi

# Build check (ensures the project actually builds)
run_check "Build" bun run build

# Shellcheck for bash scripts
run_check "Shellcheck" shellcheck scripts/*.sh

# Shfmt for bash script formatting
if [[ "$FIX" -eq 1 ]]; then
    run_check "Shfmt (fix)" shfmt -w -i 4 scripts/*.sh
else
    run_check "Shfmt" shfmt -d -i 4 scripts/*.sh
fi

# Actionlint for GitHub Actions
run_check "Actionlint" actionlint

# Markdownlint for markdown files
if [[ "$FIX" -eq 1 ]]; then
    run_check "Markdownlint (fix)" markdownlint --fix "src/**/*.md"
else
    run_check "Markdownlint" markdownlint "src/**/*.md"
fi

# CSpell for spell checking
cspell_version=$(cspell --version)
run_check "CSpell $cspell_version" ./scripts/cspell-run.sh

# CSpell dictionary verification
run_check "CSpell Dictionary" ./scripts/cspell-verify.sh

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some checks failed!${NC}"
    exit 1
fi
