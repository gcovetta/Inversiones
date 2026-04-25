#!/bin/bash
# build.sh — copia PortafolioGDC.html → www/index.html
# Correr antes de cada "npx cap sync"

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$SCRIPT_DIR/../GDC/PortafolioGDC.html"
DEST="$SCRIPT_DIR/www/index.html"

if [ ! -f "$SRC" ]; then
  echo "ERROR: No se encontró $SRC"
  exit 1
fi

mkdir -p "$SCRIPT_DIR/www"
cp "$SRC" "$DEST"
echo "✓ www/index.html actualizado ($(wc -c < "$DEST" | tr -d ' ') bytes)"
