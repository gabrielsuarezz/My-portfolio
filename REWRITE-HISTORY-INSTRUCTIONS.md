# Git History Rewrite Instructions

This script will rewrite the git history to make Gabriel Suarez the sole contributor by changing all commits from `lovable-dev[bot]` to your name.

## ⚠️ Important Warnings

1. **This rewrites git history** - it cannot be easily undone
2. **Force push required** - this will overwrite the remote repository
3. **Collaborators affected** - anyone who has cloned this repo will need to re-clone it
4. **Backup recommended** - make a backup before running

## Prerequisites

- Git installed on your machine
- You must be in the root directory of the cloned repository
- You must have push access to the repository

## How to Run

### Step 1: Create a backup (recommended)
```bash
cd ..
git clone https://github.com/gabrielsuarezz/My-portfolio.git My-portfolio-backup
cd My-portfolio
```

### Step 2: Make the script executable
```bash
chmod +x remove-bot-commits.sh
```

### Step 3: Run the script
```bash
./remove-bot-commits.sh
```

### Step 4: Verify on GitHub
Go to https://github.com/gabrielsuarezz/My-portfolio/graphs/contributors and verify that only "gabrielsuarezz" appears as a contributor.

## After Running

Once complete:
- You can delete the script: `git rm remove-bot-commits.sh REWRITE-HISTORY-INSTRUCTIONS.md`
- Commit and push the deletion: `git commit -m "Remove history rewrite scripts" && git push`

## Troubleshooting

If you encounter any issues:
1. Restore from your backup
2. Make sure you're on the main/master branch
3. Ensure you have the latest changes: `git pull`
4. Check that you have force push permissions

## What This Does

The script will:
1. Change all commit authors from "gpt-engineer-app[bot]" to "Gabriel Suarez"
2. Update both author and committer information
3. Force push all branches and tags to GitHub
4. Clean up temporary git references
5. Run garbage collection

After completion, the GitHub contributors graph will show only "gabrielsuarezz" as the contributor.
