#!/bin/bash

if [ ! -f .env ]; then
    echo put WEB_EXT_API_KEY= and WEB_EXT_API_SECRET= in .env
    exit 1
fi

# shellcheck source=.env
source .env

set -e

web-ext lint --output json --pretty >web-ext-artifacts/lint.json
web-ext build --overwrite-dest
web-ext sign --no-input
