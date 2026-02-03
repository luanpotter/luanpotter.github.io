#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

fix=$([[ "$*" == *--fix* ]] && echo true || echo false)

function sort_check_fn() {
    sort -f -c
}

function sort_run_fn() {
    sort -f
}

function sort_dictionary() {
    local file="$1"
    local tmp_file
    tmp_file=$(mktemp)

    head -n 1 "$file" >"$tmp_file"
    tail -n +2 "$file" | sort_run_fn >>"$tmp_file"
    mv "$tmp_file" "$file"
}

function delete_unused() {
    local file="$1"
    local word="$2"

    perl -i -ne "print unless /^\s*${word}\s*([# ].*)?$/i" "$file"
}

function lowercase() {
    tr '[:upper:]' '[:lower:]'
}

word_list="word_list.tmp"

dictionary_dir=".github/.cspell"
tmp_dir=".cspell.tmp"

mv "$dictionary_dir" "$tmp_dir"
mkdir "$dictionary_dir"
for file in "$tmp_dir"/*; do
    if [[ -f "$file" ]]; then
        touch "$dictionary_dir/$(basename "$file")"
    fi
done

./scripts/cspell-run.sh --dot --unique --words-only | lowercase | sort -f >$word_list || exit 1
rm -r "$dictionary_dir"
mv "$tmp_dir" "$dictionary_dir"

error=0

# Check for duplicate words across dictionaries
declare -A word_to_file
for file in .github/.cspell/*.txt; do
    mapfile -t lines <"$file"
    for line in "${lines[@]}"; do
        word=$(echo "$line" | cut -d '#' -f 1 | xargs | lowercase)
        if [[ -n "$word" ]]; then
            if [[ -n "${word_to_file[$word]:-}" ]]; then
                echo "Error: The word '$word' appears in multiple dictionaries: '${word_to_file[$word]}' and '$file'" >&2
                error=1
            else
                word_to_file[$word]="$file"
            fi
        fi
    done
done

for file in .github/.cspell/*.txt; do
    echo "Processing dictionary '$file'..."

    violation=$(awk '!/^\s*(#|$)/' "$file" | sort_check_fn 2>&1 || true)
    if [ -n "$violation" ]; then
        # Extract only the line content after the last ': '
        violation_line="${violation##*: }"
        echo "Error: The dictionary '$file' is not in alphabetical order. First violation: '$violation_line'" >&2
        error=1
        if $fix; then
            echo "Fixing the dictionary '$file'"
            sort_dictionary "$file"
        fi
    fi

    # Read file into array to avoid reading and writing same file in pipeline
    mapfile -t lines <"$file"
    for line in "${lines[@]}"; do
        # split the line by # to remove comments
        word=$(echo "$line" | cut -d '#' -f 1 | xargs | lowercase) # xargs trims whitespace

        # check if the word exists in the project
        if [[ -n "$word" ]] && ! grep -wxF "$word" "$word_list" >/dev/null; then
            echo "Error: The word '$word' in the dictionary '$file' is not needed." >&2
            error=1
            if $fix; then
                echo "Fixing the dictionary '$file' with excess word $word"
                delete_unused "$file" "$word"
            fi
        fi
    done
done

rm $word_list
exit $error
