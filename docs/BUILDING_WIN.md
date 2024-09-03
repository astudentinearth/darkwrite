# Building Darkwrite on Windows
## Requirements
- pnpm
- Visual C++ Build Tools
- node-gyp
- Node.js 20 or later
- Windows 10 or later (no testing was done for older versions)

## Building
Building on Windows may introduce weird errors in some cases. I recommend to cloning the repository to the root of your C:\ drive instead of your user folder for better odds of success.
```ps
cd C:\
git clone https://github.com/astudentinearth/darkwrite
cd darkwrite
pnpm install
pnpm build:win
```
> If electron-builder hangs at the packaging step or the nsis step, or fails after this step, restart your terminal as administrator and run `pnpm build:win` in project root again. 
  
An installer should appear in `packages/app-desktop/release/`, under a subdirectory which is named after the compiled version number.

## Troubleshooting
### pnpm.cjs is not a valid Win32 application
Find your pnpm executable named `pnpm.cjs`. The file path should be included in the error message. If you are using `fnm`, it should be in`%APPDATA%\fnm\node-versions\<node-version>\installation\node_modules\pnpm\bin`.  
Open `pnpm.cjs` in notepad and replace the shebang with `#!node`.

### better-sqlite3 was compiled against a different node version
Run the command below to ensure the module is compiled against the correct node and electron version.
```
pnpm --filter app-desktop run postinstall
```