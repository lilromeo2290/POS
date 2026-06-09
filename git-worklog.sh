#!/bin/bash
# ============================================
# CloudPOS - Git Commit & Push Worklog Script
# ============================================
# Usage: bash /home/z/my-project/git-worklog.sh "Description of changes"
#
# This script:
# 1. Stages all changes
# 2. Commits with a timestamp and description
# 3. Pushes to GitHub
# ============================================

PROJECT_DIR="/home/z/my-project"
WORKLOG_FILE="$PROJECT_DIR/worklog.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S UTC')

cd "$PROJECT_DIR" || exit 1

# Get description from argument or prompt
if [ -z "$1" ]; then
  echo "Enter commit description:"
  read -r DESCRIPTION
else
  DESCRIPTION="$1"
fi

# Check if there are changes to commit
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "[$TIMESTAMP] No changes to commit."
  exit 0
fi

# Stage all changes
git add -A

# Commit
COMMIT_MSG="$DESCRIPTION"
git commit -m "$COMMIT_MSG"

# Push
git push origin main 2>&1

echo "[$TIMESTAMP] Committed and pushed: $DESCRIPTION"
