# Building

> This document is work in progress. If you run into issues while building, open an issue.

### [Build on Windows 10 or above](#windows-1011)

### [Build on Linux](#linux)

### [Build on macOS](#macos)

# Windows 10/11

## Requirements

- pnpm
- git
- Visual C++ Build Tools
- node-gyp
- Node 22
- Windows 10 or later (no testing was done for older versions)
- Python
- a good internet connection to download dependencies

> [!WARNING]
> If you are using Python 3.12+, you need to install the `setuptools` package. You can do this by running `pip install setuptools` in your terminal.
> on macOS, you can use `brew install python-setuptools` to install it.

> [!WARNING]
> The Electron builder stage may exceed 10 minutes in some cases. I don't know the exact cause, however if it looks like it's stuck, please be patient and wait for it to finish.

## Building

Run the following commands:

```ps
cd C:\
git clone https://github.com/astudentinearth/darkwrite
cd darkwrite/app
pnpm build
```

This will run our [custom build script,](../app/darkwrite-builder.js) which will install dependencies, compile the app, and create the final build automatically.

> See the troubleshooting section below if the build fails.

An installer should appear in `release/`, under a subdirectory which is named after the compiled version number.

## Troubleshooting

### better-sqlite3 was compiled against a different node version

Run the command below to ensure the module is compiled against the correct node and electron version.

```
pnpm install_app_deps
```

### Electron builder throws some error involving `rcedit-x64.exe`, or `wincodesign` (or anything else)

Clone the repository to the root of your `C:\` drive and run the build commands in an admin shell (run your terminal as administrator). This fixed issues on my end a few times, it might be completely unrelated but I'm leaving this here just in case.

# Linux

> [!NOTE]  
> These instructions were tested on Arch Linux, however any mainstream and recent distribution should work. The release builds are built on Ubuntu 22.04.

> [!NOTE]
> The CI Ubuntu version is always one LTS release behind to ensure binary compatibility - which means support for 22.04 will be dropped once 26.04 is out. Builds compiled on a rolling distribution might not work on fixed release distributions.

## Requirements

- pnpm
- Node 22 (using nvm is recommended)
- git

## Building

```bash
git clone https://github.com/astudentinearth/darkwrite
cd darkwrite/app
pnpm build
```

You can find your AppImage and Debian package in `release/<version>/Darkwrite.{deb,AppImage}`

# macOS

> [!WARNING]  
> These instructions have not been tested, though it should work anyways.

> [!WARNING]  
> **Neither code signing nor notarization was set up for Darkwrite. You will need to create an exception for it. [This Apple support page explains how to create an exception.](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unknown-developer-mh40616/mac)**

## Requirements

- pnpm
- Node 22
- git (install whatever XCode provides)

## Building

```bash
git clone https://github.com/astudentinearth/darkwrite
cd darkwrite/app
pnpm build
```

You can find your dmg in `release/<version>/Darkwrite-Installer.dmg`
