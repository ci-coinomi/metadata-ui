#!/bin/bash

# Wait for build output to be available
echo "Checking for build output..."
MAX_WAIT=300  # 5 minutes timeout
WAIT_TIME=0

while [ ! -f ".output/server/index.mjs" ] && [ $WAIT_TIME -lt $MAX_WAIT ]; do
    echo "Build output not ready, waiting... (${WAIT_TIME}s)"
    sleep 5
    WAIT_TIME=$((WAIT_TIME + 5))
done

if [ ! -f ".output/server/index.mjs" ]; then
    echo "Build output not found after ${MAX_WAIT}s, running build..."
    yarn build
fi

if [ ! -f ".output/server/index.mjs" ]; then
    echo "ERROR: Build failed, .output/server/index.mjs not found"
    exit 1
fi

echo "Starting server..."
node .output/server/index.mjs 