# Development docs
## Tooling
Darkwrite uses `pnpm` for package management. Code is bundled with [electron-vite](https://electron-vite.org/) for Electron integration. Changes to renderer source code is reflected immediately with hot module reload, however changes in preload and main may require a full page reload, or restarting the app as a whole.

## Running development builds
After installing dependencies with `pnpm install`, use `pnpm run dev` to start Darkwrite.

### Node versions not matching with better-sqlite3
This issue may happen in some cases. If this happens, use `pnpm run rebuild` to recompile better-sqlite3.