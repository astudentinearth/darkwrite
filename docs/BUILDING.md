# Building Darkwrite
This page contains instructions on compiling Darkwrite from source code.  
## Introduction
To build Darkwrite, you must have npm and a Rust environment ready. Darkwrite uses Tauri 1.x as of writing, which supports building an installer package for Windows, a `.dmg` image for macOS, `.deb`, for Debian-based systems and `.AppImage` for all Linux distributions.  
Tauri hasn't added Flatpak support yet. Flatpak bundling support may be added in the future.  
A `PKGBUILD` file will be created for Arch Linux systems once Darkwrite reaches beta stage.

# First step for all platforms
Clone the repository and enter it. I strongly recommend installing Git if you haven't already.

# Building on Windows
I'm continuing development on Windows for now. As far as I'm concerned, Linux in a virtual machine runs Darkwrite faster than Edge WebView2. I had to cripple down blur effects quite a bit so Edge could handle it. I also had to recently switch to dnd-kit as drag-drop library, because HTML5 drag-drop and native file drop functionality doesn't work with Tauri on Windows for whatever reason.  

Darkwrite stores application data in `%USERPROFILE%/AppData/Roaming/io.github.astudentinearth.darkwrite` directory.
### C++ Build Tools Setup
Download the [Visual Studio Community installer.](https://visualstudio.microsoft.com/)
Once the installer launches, choose "Desktop development with C++" and "Windows 10 SDK" workloads to be installed.

### WebView2
WebView2 is required to run Darkwrite on Windows systems. **If you are running Windows 10 version 1803 (or later) or Windows 11, WebView2 is already installed.** If your system doesn't have WebView2 (you can check programs and features in control panel to be sure), [get the Evergreen Bootstrapper installer here.](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section)

### Rust
Go to https://www.rust-lang.org/tools/install and get rustup. The installer will launch in a terminal window and you will be asked 2 or 3 questions. Alternatively you can install the `Rustlang.Rustup` package using `winget`.

### npm
Download (preferably the latest version of) Node.js from the official site. It should come with npm by default.

## Build
Building is very straight forward. 
```
npm install
npm run tauri build
```

...should do it for you. The resulting package will be placed in `src-tauri\target\release`

# Building on Linux
Darkwrite stores application data at `$XDG_CONFIG_HOME/io.github.astudentinearth.darkwrite` or `$HOME/.config/io.github.astudentinearth.darkwrite`.
**Do NOT run Darkwrite with root privileges under any circumstances. Darkwrite doesn't access anywhere outside its configuration folder by default, but a bug in the backend might nuke your system, you never know.**  
A pic of your `neofetch` is highly appreciated when creating an issue.
## System dependencies
Install the packages below that correspond to your distribution. (Source: Tauri Documentation)
If you are feeling great today, also add Vim to make your day even better.
**Make sure you update your system packages beforehand to avoid partial upgrades.**  
### Debian / Ubuntu
I recommend building on Ubuntu 22.04 (any flavor of Ubuntu is OK), which is also used for building with GitHub Actions. If you are on Linux Mint/LMDE, PeppermintOS, Kali Linux, Raspberry Pi OS or elementaryOS these should also work. *I probably will not package Darkwrite as a snap.*
```
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```
### Arch Linux
This should apply to pretty much every Arch-based system(including Garuda Linux and EndeavourOS), unless they replace these with custom repositories. I used Arch Linux extensively while creating Darkwrite, and it should run just fine. **Manjaro might have dependency issues when building with the future PKGBUILD since they hold packages back.** If you are using SteamOS I recommend just getting the AppImage, use your CPU power for your library instead :)
```
sudo pacman -Syu
sudo pacman -S --needed \
    webkit2gtk \
    base-devel \
    curl \
    wget \
    openssl \
    appmenu-gtk-module \
    gtk3 \
    libappindicator-gtk3 \
    librsvg \
    libvips
```
### Fedora (and its spins)
Fedora 36/37/38 and Nobara should work.
```
sudo dnf check-update
sudo dnf install webkit2gtk4.0-devel \
    openssl-devel \
    curl \
    wget \
    libappindicator-gtk3 \
    librsvg2-devel
sudo dnf group install "C Development Tools and Libraries"
```
### openSUSE
Both Leap and Tumbleweed editions should work fine.
```
sudo zypper up
sudo zypper in webkit2gtk3-soup2-devel \
    libopenssl-devel \
    curl \
    wget \
    libappindicator3-1 \
    librsvg-devel
sudo zypper in -t pattern devel_basis
```
### Nix
Go to https://tauri.app/v1/guides/getting-started/prerequisites#setting-up-linux and follow instructions for NixOS. NixOS requires some configuration I can't explain here. I also have no idea about how Nix packaging works ¯\_(ツ)_/¯

### Gentoo
If you are on Gentoo, don't bloat up your system by building webkit2gtk. It will also be a pain for you when updating @world set. I recommend simply using the AppImage like any normal person. But if there is not an AppImage available for the specific commit you need/you will make changes to the code, or simply want to contribute to the project, here you go. I might write an ebuild after setting up a Gentoo virtual machine.

These steps should work on both OpenRC and systemd, but I can't give a guarantee for musl. If you are using systemd on Gentoo, I hope you are having a good day. 

I had to look up dependency for their equivalents on the Gentoo package index, I hope this saves you some time. Make sure you have configured `ACCEPT_LICENSE` variable in your portage configuration properly. The command below should work on stable (not bleeding edge) systems, but if you are on bleeding edge (i.e. your `ACCEPT_KEYWORDS` is set to `~amd64`), this should also work(will add extra overhead to your updates however).  
You need to enable the `npm` local use flag for `net-libs/nodejs` to have npm installed.
```emerge -av net-libs/webkit-gtk net-misc/curl net-misc/wget dev-libs/openssl x11-misc/appmenu-gtk-module x11-libs/gtk+ dev-libs/libappindicator gnome-base/librsvg sys-devel/binutils sys-devel/gcc sys-devel/libtool net-libs/nodejs```
This command has the potential of taking hours because of the WebKit engine, so be patient. Once you are done, proceed with the steps below to install Rust and continue with the build. Go ahead and post your beautiful dwm setup at r/unixporn in the end.  

Note: If you are using LibreSSL for whatever reason, good chance it won't work.

### LFS
Assuming you have proceeded to BLFS and got a desktop running, you can install the same dependencies listed in the Gentoo section.

### Void Linux
Install `libwebkitgtk60 libwebkitgtk60-devel curl wget openssl openssl-devel appmenu-gtk-module appmenu-gtk-module-devel gtk+3 gtk+3-devel libappindicator libappindicator-devel gcc librsvg librsvg-devel binutils` packages using xbps. I don't know if these packages are overkill/insufficient. I have never used Void before.
Install NodeJS and npm using `nvm`.
*Note: I don't know if Darkwrite works with musl.*

## Rust
The following command is enough to install Rust. 
```curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh```  
**Disclaimer: The script does what it's supposed to, but if the URL gets compromised or anything, I'm not responsible. Don't blindly curl-bash a script.**  
Alternatively you can install using your distribution's package manager.

## Build
```
npm install
npm run tauri build
```
...will compile Darkwrite. It will drop the Debian package and the AppImage to somewhere in `src-tauri/target/release`

# Building on macOS
Disclaimer: I don't own a Mac. If you see any inaccuracy in these instructions, feel free to raise an issue or create a pull request. These instructions are based on Tauri's official documentation.
Accorring to Tauri API documentation, application data goes to `$HOME/Library/Application Support`.
## Dependencies
Install CLang and macOS development dependencies with the following command:
```xcode-select --install```

To install Rust, you can use the following command.  
```curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh```
**The same disclaimer I wrote on the Linux part still applies :)**

## Build
```
npm install
npm run tauri dev
```
...should drop a `.dmg` somewhere in `src-tauri/target/release`. **Note that the .dmg is not signed, so Apple might complain about unidentified developer. You can create an exception in System Preferences.**

# Updating manual builds
Darkwrite dependencies may get updated as a part of project progression. Therefore I recommend running `npm install` before every compilation to ensure correct node dependencies are available. I also recommend updating your Rust toolchain and Node.JS / npm from time to time. (If you are on Linux and installed Rust, node or npm using your package manager, they should get updated automatically with your system.)
