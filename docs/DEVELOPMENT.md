# Development docs

> [!WARNING]
> If you are using Python 3.12+, you need to install the `setuptools` package. You can do this by running `pip install setuptools` in your terminal.
> on macOS, you can use `brew install python-setuptools` to install it.

## Running development builds

Install packages by invoking `pnpm install`. Development requires that both the frontend dev server and the main process bundler are running. Before you begin, run `pnpm build:common` in the repository root to ensure the core library is built.

To run the development environment, open up 2 terminals and change your working directory to `packages/app-desktop` in one and `packages/frontend` in another. Run `pnpm dev` on the frontend project **first**, then run `pnpm dev` in the app-desktop project.

## Tooling

Darkwrite uses `pnpm` for package management. `vite-plugin-electron` is used to bundle the app. Changes to source code within isolated projects trigger hot module reload in that project during development. Changes to main process code automatically restarts the app. **If you make changes in @darkwrite/common, you should rebuild it, or run Vite in watch mode.**

### Node versions not matching with better-sqlite3

This issue may happen in some cases. If this happens, run `pnpm --filter=@darkwrite/app-desktop electron-rebuild -f -w better-sqlite3`
