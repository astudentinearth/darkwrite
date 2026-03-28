import { app } from "electron";
import semver from "semver";
import log from "electron-log";
import { UpdateServerResponse } from "@darkwrite/common";

async function checkUpdateFromGithub() {
  // return {
  //   name: "v0.6.0-alpha.1",
  //   latest: "0.6.0-alpha.1",
  //   release_page:
  //     "https://github.com/astudentinearth/darkwrite/releases/tag/v0.5.0-alpha.1",
  // };

  const response = await fetch(
    "https://api.github.com/repos/astudentinearth/darkwrite/releases/latest",
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  if (!response.ok) {
    log.error(`GitHub API responded with status ${response.status}`);
    return undefined;
  }

  const latestRelease = await response.json();

  return {
    name: latestRelease.name as string,
    latest: (latestRelease.tag_name as string).substring(1),
    release_page: latestRelease.html_url as string,
  };
}

async function checkUpdate() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //url: string = "http://localhost:3000/api/latest-release",
  // const res = await (await fetch(url)).json();
  const res = await checkUpdateFromGithub();
  if (!res || !("latest" in res || "release_page" in res)) return undefined;
  return {
    ...res,
    updateAvailable: semver.gt(res.latest, app.getVersion()),
  } satisfies UpdateServerResponse;
}

export const Updater = {
  checkUpdate,
};
