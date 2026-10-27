#!/bin/bash
echo "===== Building Picture Dictionary ====="
command -v node >/dev/null 2>&1 || { echo "Install Node.js from https://nodejs.org first"; exit 1; }
npm install
if [[ "$OSTYPE" == "darwin"* ]]; then npm run build-mac; else npm run build-linux; fi
echo "Done. Output is inside the dist folder"
