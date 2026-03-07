#!/bin/bash
# This single specific switch is causing devtools to break on my system. So we are removing it from vite-plugin-electron/simple by force.
sed -i 's/\(\["inherit", "inherit", "inherit"\), "ipc"\]/\1]/' node_modules/vite-plugin-electron/dist/index.mjs