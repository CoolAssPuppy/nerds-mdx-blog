#!/bin/bash
# Test the package locally against a Next.js project.
# Usage: ./scripts/test-local.sh ~/Developer/sites/midnight-coders

set -e

TARGET="${1:?Usage: ./scripts/test-local.sh <path-to-nextjs-project>}"
PACKAGE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Building package..."
cd "$PACKAGE_DIR"
npm run build
npm pack

TARBALL=$(ls -t "$PACKAGE_DIR"/*.tgz | head -1)
echo "Packed: $TARBALL"

echo "Installing into $TARGET..."
cd "$TARGET"
npm install "$TARBALL"

echo "Running init..."
npx nerds-mdx-blog init

echo ""
echo "Done. Run 'npm run dev' in $TARGET to test."
