#!/bin/bash

echo "===================================="
echo "  Blitz Ad Blocker Launcher (macOS)"
echo "===================================="
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if .env file exists, if not create it from example
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "Creating .env file from .env.example..."
        cp ".env.example" ".env"
        echo ".env file created! Using default Blitz path."
        echo ""
    else
        echo "Warning: .env.example not found. Using default Blitz path."
        echo ""
    fi
fi

echo "Starting Blitz Ad Blocker..."
echo ""
npm start