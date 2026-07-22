#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# shellcheck source=scripts/_lib.sh
source ./scripts/_lib.sh

# Git hooks setup
HOOK_PATH=".git/hooks/pre-commit"
HOOK_SOURCE="scripts/_git_hook.sh"

# Parse arguments
REMOVE=0
if [[ "${1:-}" == "--remove" ]]; then
    REMOVE=1
fi

install_hook() {
    info "Installing pre-commit hook..."
    mkdir -p "$(dirname "$HOOK_PATH")"
    cp "$HOOK_SOURCE" "$HOOK_PATH"
    chmod +x "$HOOK_PATH"
    success "Pre-commit hook installed"
}

remove_hook() {
    if [[ -f "$HOOK_PATH" ]]; then
        rm "$HOOK_PATH"
        success "Pre-commit hook removed"
    else
        info "No pre-commit hook to remove"
    fi
    exit 0
}

if [[ "$REMOVE" -eq 1 ]]; then
    remove_hook
fi

banner "Project Setup"

info "Checking Python tooling for resume rendering..."
if ! command -v uv &>/dev/null; then
    warn "uv not found"
    echo "  Install uv (https://docs.astral.sh/uv/) to render the resume:"
    echo "  curl -LsSf https://astral.sh/uv/install.sh | sh"
    echo "  Then run 'uv sync --project resume' to populate resume/.venv"
else
    success "uv found"
    info "Provisioning resume venv..."
    if uv sync --project resume; then
        success "Resume venv ready"
    else
        error "uv sync failed (resume)"
    fi
fi

if [[ -f "$HOOK_PATH" ]]; then
    # Check if the hook already has our lint script
    if grep -q "./scripts/lint.sh" "$HOOK_PATH"; then
        success "Pre-commit hook already installed"
    else
        warn "Pre-commit hook exists but doesn't run lint.sh"
        read -p "Do you want to replace it? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_hook
        else
            warn "Skipped hook installation"
        fi
    fi
else
    install_hook
fi

banner "Setup Complete!" green
