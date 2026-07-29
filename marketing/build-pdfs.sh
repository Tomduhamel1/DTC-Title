#!/bin/sh
# Regenerate the one-pager PDFs served at /pdfs/* after editing the HTML sources.
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --no-pdf-header-footer --print-to-pdf="public/pdfs/betterclose-for-agents.pdf" "file://$(pwd)/marketing/agents-one-pager.html"
"$CHROME" --headless=new --no-pdf-header-footer --print-to-pdf="public/pdfs/betterclose-for-brokers.pdf" "file://$(pwd)/marketing/brokers-one-pager.html"
