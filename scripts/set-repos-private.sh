#!/bin/bash

# Script to set all repositories to private
# Uses GitHub CLI (gh) to update repository visibility

OWNER="C9-Tech-GtitHub"

# List of all repositories
REPOS=(
  "OnPageSheet"
  "Randy"
  "Lead"
  "LSI"
  "Product-Enrichment-Manager"
  "SheetFreak"
  "claude-code-bootstrap"
  "MerrickMonitor"
  "titlestruct"
  "Ecom-price-tracker"
)

echo "🔒 Setting all repositories to PRIVATE..."
echo ""

for REPO in "${REPOS[@]}"; do
  echo "Processing: $OWNER/$REPO"

  # Use GitHub CLI to set repository to private
  gh repo edit "$OWNER/$REPO" --visibility private --accept-visibility-change-consequences

  if [ $? -eq 0 ]; then
    echo "✅ Successfully set $REPO to private"
  else
    echo "❌ Failed to set $REPO to private"
  fi

  echo ""

  # Small delay to avoid rate limiting
  sleep 1
done

echo "🎉 Done! All repositories have been processed."
