#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# shellcheck source=scripts/_lib.sh
source ./scripts/_lib.sh

FAILED=0
FIX=0

# Parse arguments
if [[ "${1:-}" == "--fix" ]]; then
    FIX=1
fi

run_check() {
    local name="$1"
    shift
    info "Running: $name"
    if "$@"; then
        success "Passed: $name"
        echo
    else
        fail "Failed: $name"
        echo
        FAILED=1
    fi
}

if [[ "$FIX" -eq 1 ]]; then
    banner "Fixing All Issues"
else
    banner "Running All Checks"
fi

# Check required commands
require_cmds bun uv shellcheck shfmt actionlint cspell markdownlint

# Astro check (TypeScript + Astro validation)
run_check "Astro Check" bun run check

# Resume schema validation (rendercv has no validate subcommand; this renders
# with every output disabled, which still runs the Pydantic schema validation)
run_check "Resume schema (rendercv)" uv run --project resume rendercv render resume/resume.yaml -nopdf -notyp -nomd -nohtml -nopng

# Prettier formatting
if [[ "$FIX" -eq 1 ]]; then
    run_check "Prettier (fix)" bun run prettier --write src
else
    run_check "Prettier" bun run prettier --check src
fi

# Build check (ensures the project actually builds)
run_check "Build" bun run build

# Shellcheck for bash scripts
run_check "Shellcheck" shellcheck -x scripts/*.sh

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

if [ "$FAILED" -eq 0 ]; then
    banner "All checks passed!" green
    exit 0
else
    banner "Some checks failed!"
    exit 1
fi
