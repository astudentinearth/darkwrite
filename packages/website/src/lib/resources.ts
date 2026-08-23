// This is a temporary measure, next release will use named artifacts
export const WINDOWS_LATEST_RELEASE =
  "https://github.com/astudentinearth/darkwrite/releases/latest/download/Darkwrite-Installer.exe";
export const LINUX_LATEST_RELEASE =
  "https://github.com/astudentinearth/darkwrite/releases/latest/download/Darkwrite.AppImage";
export const MACOS_LATEST_RELEASE =
  "https://github.com/astudentinearth/darkwrite/releases/latest/download/Darkwrite-Installer.dmg";
export const UBUNTU_LATEST_RELEASE =
  "https://github.com/astudentinearth/darkwrite/releases/latest/download/Darkwrite.deb";

export const AUR_PACKAGE_URL =
  "https://aur.archlinux.org/packages/darkwrite-bin";

export const GIT_REPO_URL = "https://github.com/astudentinearth/darkwrite";
export const RELEASE_PAGE_URL = `${GIT_REPO_URL}/releases`;

export const github = (path: string) => `${GIT_REPO_URL}/${path}`;

export const InternalLinks = {
  ThirdParty: "/licenses.md",
  Privacy: "/privacy",
  Roadmap: "/#roadmap",
  Downloads: "/downloads",
  Docs: "/docs"
}

export const ExternalLinks = {
  AGPL: "https://www.gnu.org/licenses/agpl-3.0.en.html#license-text",
  Releases: github("releases"),
  Changelog: github("blob/dev/CHANGES.md"),
  BugTracker: github("issues")
}

