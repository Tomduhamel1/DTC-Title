#!/bin/sh
# Regenerate and check the handout PDFs served at /pdfs/* from their HTML sources.
set -eu
cd "$(dirname "$0")/.."
node marketing/build-pdfs.mjs
