# Scripts in `app/`

## `dev`

Runs the Electron app for development.

## `build`

Creates a production build of Darkwrite.

> It runs [`darkwrite-builder.js`](../packages/app-desktop/darkwrite-builder.js), which automatically detects your operating system and performs the build.

## `build:vite`

Builds both the frontend and main process JavaScript bundles.

## `build:win`, `build:mac`, `build:linux`

Builds the Electron app for the specified platform.

## `test`

Runs unit and component tests.

## `coverage`

Runs unit and component tests with v8 coverage reports.

## `install_app_deps`

Installs production dependencies for the Electron app, compiling any native modules against the correct Electron version.

## `licenses`

Compiles a list of 3rd party licenses used in Darkwrite and outputs them to `THIRDPARTY.txt`.

## `rebuild:restore`

Recompiles any native modules against the system Node version, so you can run tests without Electron. `install_app_deps` should be run again before running `dev`.

## `lint`

Runs ESLint on the codebase.

## `typecheck`

Runs TypeScript type checking on the codebase.
