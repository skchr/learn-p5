#!/bin/sh
set -e
SHORT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "0000000")
echo "export const APP_VERSION = \"debug+$SHORT_HASH\";" > src/constants/Version.generated.ts
