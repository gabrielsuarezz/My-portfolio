#!/bin/bash

# Script to rewrite git history and make Gabriel Suarez the sole contributor
# This will change all commits from lovable-dev[bot] to Gabriel Suarez

echo "⚠️  WARNING: This will rewrite git history!"
echo "Make sure you have a backup of your repository before proceeding."
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Step 1: Rewriting git history..."
git filter-branch --env-filter '
if [ "$GIT_COMMITTER_NAME" = "gpt-engineer-app[bot]" ] || [ "$GIT_AUTHOR_NAME" = "gpt-engineer-app[bot]" ]; then
    export GIT_COMMITTER_NAME="Gabriel Suarez"
    export GIT_COMMITTER_EMAIL="gsuar092@fiu.edu"
    export GIT_AUTHOR_NAME="Gabriel Suarez"
    export GIT_AUTHOR_EMAIL="gsuar092@fiu.edu"
fi
' --tag-name-filter cat -- --branches --tags

echo ""
echo "Step 2: Force pushing to GitHub..."
git push --force --all
git push --force --tags

echo ""
echo "Step 3: Cleaning up backup refs..."
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now

echo ""
echo "✅ Done! You are now the sole contributor."
echo "Check your repository on GitHub to verify."
