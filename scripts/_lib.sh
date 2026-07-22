#!/usr/bin/env bash
# Shared helpers for setup.sh, build.sh, and lint.sh. Sourced, not executed.
# Exposes: info, success, warn, fail, error, banner, require_cmd, require_cmds.
# Color variables are private to this file (not exported) and only used below.

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

info() { printf "${BLUE}▶${NC} %s\n" "$1"; }
success() { printf "${GREEN}✓${NC} %s\n" "$1"; }
warn() { printf "${YELLOW}!${NC} %s\n" "$1"; }
fail() { printf "${RED}✗${NC} %s\n" "$1"; }
error() {
    printf "${RED}✗${NC} %s\n" "$1"
    exit 1
}

banner() {
    # $1=title, $2=color (cyan|green), defaults to cyan
    local title="$1"
    local color="${2:-cyan}"
    local c
    case "$color" in
    green) c="$GREEN" ;;
    *) c="$CYAN" ;;
    esac
    local line='━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    printf "${c}%s${NC}\n" "$line"
    printf "${c}%-60s${NC}\n" "                    $title                          "
    printf "${c}%s${NC}\n\n" "$line"
}

require_cmd() {
    if ! command -v "$1" &>/dev/null; then
        error "Required command not found: $1 (run ./scripts/setup.sh to install dependencies)"
    fi
}

require_cmds() {
    for cmd in "$@"; do
        require_cmd "$cmd"
    done
}
