#!/bin/bash

# Define paths relative to the script location
ICON_SOURCE="resources/512x512.png"
ICON_DEST="resources/icon.ico"

# Check if magick is installed
if ! command -v magick &> /dev/null; then
    echo "Error: ImageMagick (magick) is not installed or not in PATH."
    exit 1
fi

# Check if source file exists
if [ ! -f "$ICON_SOURCE" ]; then
    echo "Error: Source icon not found at $ICON_SOURCE"
    exit 1
fi

# Generate the .ico file
echo "Generating $ICON_DEST from $ICON_SOURCE..."
magick "$ICON_SOURCE" -define icon:auto-resize=256,128,64,48,32,16 "$ICON_DEST"

if [ $? -eq 0 ]; then
    echo "Success: $ICON_DEST created."
else
    echo "Error: Failed to create icon."
    exit 1
fi
