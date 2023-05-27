# NPM scripts for development
### `start`
Starts vite with source code watching
### `build`
Builds the frontend code.
### `vite-watch`
Starts vite with source code watching. Uses cross-env to ensure it runs on all platforms.
### `app_build`
Enumerates license files for dependencies and combines them, which gets included in the source code.
### `lint:sort-locale`
Sorts the keys in locale files.
### `tauri dev`
Runs the application in developer mode. Code changes are reflected immediately with hot reload.
### `tauri build`
Builds the code for the current platform.