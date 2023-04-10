![Darkwrite Logo](res/readme.png)
### Notes and todo, the way you want.
[Follow me on Twitter](https://twitter.com/astudentinearth)  
Darkwrite is a simple and easy way to organize your notes and todos. 
### Customization beyond expectations
The look and feel is very tweakable. You can change the color theme as well as the user interface font. You can also add a wallpaper if you want to. You can change the font of each note individually as well.
### Your todos right by your side
Todos are displayed on a sidebar, and you can drag them around as you wish.
### Cross platform
The application is built on web technologies and Rust, which makes it possible to run the app on Windows, Linux and macOS.
# Development Status
The application is currently unstable and subject to breaking changes with every commit. I'm currently doing some design changes, which will significantly change the way the application works. All features except for search have been ported from the Electron version to the Tauri rewrite. 
Feel free to create an issue if you have any suggestions :)

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
Licensed under GNU General Public License, version 3 or any later versionat your option.
