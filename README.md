# Darkwrite
Customizable note taking app. Change the colors, change the fonts.

# Electron to Tauri porting status
Currently this branch is very unstable, so you should stick to electron-legacy branch for now. If you want to test the new version, build instructions are below.  
This branch is rewritten to use Tauri instead of Electron. For the Electron version (not maintained), see electron-legacy branch. (It gets the job done in terms of note taking.)
Under development stage. Feel free to raise an issue for suggestions and bugs.

# Build Instructions
Build instructions for Windows and macOS will be added later, as the program hasn't been tested on these platforms.
## Linux
### Dependencies
Regardless of the distribution, you need `npm`. We are writing the rest of the dependencies from [Tauri's documentation](https://tauri.app/v1/guides/getting-started/prerequisites/#setting-up-linux)
Debian/Ubuntu: `libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev`  
Arch: `webkit2gtk base-devel curl wget openssl appmenu-gtk-module gtk3 libappindicator-gtk3 librsvg libvips`  
Fedora: `webkit2gtk3-devel.x86_64 openssl-devel curl wget libappindicator-gtk3 librsvg2-devel` and `C Development Tools and Libraries` package group
#### Rust setup
Tauri uses Rust as a backend, which can be used to do native stuff otherwise can't be done using Node packages. A Rust environment is required.
You can use the bash script mentioned on [Tauri's requirements page](https://tauri.app/v1/guides/getting-started/prerequisites/#setting-up-linux) to install rustup. However we recommend checking your distribution's repositories first. Make sure Rust toolchain binaries are in your `$PATH`.
### Build and Install
We included a Makefile to automate the build process on Linux.
```
git clone https://github.com/astudentinearth/darkwrite.git
cd darkwrite
npm install
npm run tauri build
```
This will create a .deb and a .AppImage in `src-tauri/target/release`, use whichever one suits you.
# License
Licensed under GPLv3 or later. 
