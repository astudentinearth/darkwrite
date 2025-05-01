# Building

> This document is work in progress. If you run into issues while building, open an issue.

### [Build on Windows 10 or above](#windows-1011)

### [Build on Linux](#linux)

### [Build on macOS](#macos)

# Windows 10/11

## Requirements

- yarn
- git
- Visual C++ Build Tools
- node-gyp
- Node 20
- Windows 10 or later (no testing was done for older versions)
- Python
- a good internet connection to download dependencies

> [!WARNING]
> If you are using Python 3.12+, you need to install the `setuptools` package. You can do this by running `pip install setuptools` in your terminal.
> on macOS, you can use `brew install python-setuptools` to install it.

## Building

Run the following commands:

```ps
cd C:\
git clone https://github.com/astudentinearth/darkwrite
cd darkwrite
yarn
yarn build:desktop
```

> See the troubleshooting section below if the build fails.

An installer should appear in `packages/app-desktop/release/`, under a subdirectory which is named after the compiled version number.

## Troubleshooting

### better-sqlite3 was compiled against a different node version

Run the command below to ensure the module is compiled against the correct node and electron version.

```
yarn workspace @darkwrite/app-desktop install_app_deps
```

### Electron builder throws some error involving `rcedit-x64.exe` (or anything else)

Clone the repository to the root of your `C:\` drive and run the build commands in an admin shell (run your terminal as administrator). This fixed issues on my end a few times, it might be completely unrelated but I'm leaving this here just in case.

# Linux

> [!NOTE]  
> These instructions were tested on Fedora 41, however any mainstream and recent distribution should work.

## Requirements

- yarn
- Node 20 (using nvm is recommended)
- git

## Building

```bash
git clone https://github.com/astudentinearth/darkwrite
cd darkwrite
yarn
yarn build:desktop
```

You can find your AppImage in `packages/app-desktop/release/<version>/`

# macOS

> [!WARNING]  
> These instructions have not been tested, though it should work anyways.

> [!WARNING]  
> **Neither code signing nor notarization was set up for Darkwrite. You will need to create an exception for it. [This Apple support page explains how to create an exception.](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unknown-developer-mh40616/mac)**

## Requirements

- yarn
- Node 20
- git (install whatever XCode provides)

## Building

```bash
git clone https://github.com/astudentinearth/darkwrite
cd darkwrite
yarn
yarn build:desktop
```

You can find your dmg in `packages/app-desktop/release/<version>/`
