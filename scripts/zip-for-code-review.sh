#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/zip-for-review.sh [app-name]
# Examples:
#   ./scripts/zip-for-review.sh day01-french-flashcards
#   ./scripts/zip-for-review.sh day06-url-shortener
#   ./scripts/zip-for-review.sh   (zips all apps)

OUTPUT="$HOME/review.zip"
rm -f "$OUTPUT"

if [ -n "${1:-}" ]; then
  APP_DIR="apps/$1"
  if [ ! -d "$APP_DIR" ]; then
    echo "❌ Directory $APP_DIR not found"
    exit 1
  fi
  echo "📦 Zipping $APP_DIR..."

  # Collect files that exist
  FILES=()

  # Frontend-only app (src/ at top level)
  if [ -d "$APP_DIR/src" ]; then
    FILES+=("$APP_DIR/src/")
    [ -f "$APP_DIR/package.json" ] && FILES+=("$APP_DIR/package.json")
    [ -f "$APP_DIR/vite.config.js" ] && FILES+=("$APP_DIR/vite.config.js")
  fi

  # Full-stack app (frontend/ and backend/ subdirs)
  if [ -d "$APP_DIR/frontend" ]; then
    FILES+=("$APP_DIR/frontend/src/")
    [ -f "$APP_DIR/frontend/package.json" ] && FILES+=("$APP_DIR/frontend/package.json")
    [ -f "$APP_DIR/frontend/vite.config.js" ] && FILES+=("$APP_DIR/frontend/vite.config.js")
  fi
  if [ -d "$APP_DIR/backend" ]; then
    FILES+=("$APP_DIR/backend/src/")
    [ -d "$APP_DIR/backend/tests" ] && FILES+=("$APP_DIR/backend/tests/")
    [ -f "$APP_DIR/backend/pyproject.toml" ] && FILES+=("$APP_DIR/backend/pyproject.toml")
  fi

  zip -r "$OUTPUT" "${FILES[@]}" \
    -x "*/node_modules/*" "*/dist/*" "*/.turbo/*" "*/__pycache__/*" "*/.venv/*"
else
  echo "📦 Zipping all apps..."
  zip -r "$OUTPUT" \
    apps/ \
    -x "*/node_modules/*" "*/dist/*" "*/.turbo/*" "*/__pycache__/*" "*/.venv/*" "*/.gitkeep"
fi

echo ""
echo "✅ Created $OUTPUT ($(du -h "$OUTPUT" | cut -f1))"
echo "📎 Upload this file to the chat for review"
