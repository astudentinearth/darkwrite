# Building Darkwrite on Windows
## Installing dependencies
Install pnpm, git and Visual C++ Build Tools.  
>TODO (work in progress)

## Building
Building on Windows is a bit janky and might fail at first try, so I will include troubleshooting steps as well.  
The safest bet to create a Windows installer is to clone the repository to the root of your C:\ drive. and run the commands in `C:\darkwrite`.
```ps
cd C:\
git clone https://github.com/astudentinearth/darkwrite
cd darkwrite
pnpm build:win
```
> If electron-builder hangs at the packaging step or the nsis step, restart your terminal as administrator and run `pnpm build:win` in project root again.   

An installer should appear in the `release` folder, under a subdirectory which is named after the compiled version number.