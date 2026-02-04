#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

# Git hooks setup
HOOK_PATH=".git/hooks/pre-commit"
HOOK_SOURCE="scripts/_git_hook.sh"

# Parse arguments
REMOVE=0
if [[ "${1:-}" == "--remove" ]]; then
    REMOVE=1
fi

install_hook() {
    echo -e "${BLUE}▶ Installing pre-commit hook...${NC}"
    mkdir -p "$(dirname "$HOOK_PATH")"
    cp "$HOOK_SOURCE" "$HOOK_PATH"
    chmod +x "$HOOK_PATH"
    echo -e "${GREEN}✓ Pre-commit hook installed${NC}\n"
}

remove_hook() {
    if [[ -f "$HOOK_PATH" ]]; then
        rm "$HOOK_PATH"
        echo -e "${GREEN}✓ Pre-commit hook removed${NC}"
    else
        echo -e "${BLUE}▶ No pre-commit hook to remove${NC}"
    fi
    exit 0
}

if [[ "$REMOVE" -eq 1 ]]; then
    remove_hook
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}                    Project Setup                            ${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if [[ -f "$HOOK_PATH" ]]; then
    # Check if the hook already has our lint script
    if grep -q "./scripts/lint.sh" "$HOOK_PATH"; then
        echo -e "${GREEN}✓ Pre-commit hook already installed${NC}\n"
    else
        echo -e "${BLUE}▶ Pre-commit hook exists but doesn't run lint.sh${NC}"
        read -p "Do you want to replace it? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_hook
        else
            echo -e "${RED}✗ Skipped hook installation${NC}\n"
        fi
    fi
else
    install_hook
fi

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}                    Setup Complete!                          ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
