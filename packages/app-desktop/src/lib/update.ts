import { app } from "electron";
import semver from "semver";
import log from "electron-log";
import { buildDwError, UpdateServerResponse } from "@darkwrite/common";
import { handler } from "@/types";
import { ResultAsync } from "neverthrow";

async function checkUpdateFromGithub() {
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

export const updateCheckHandler = handler(() =>
  ResultAsync.fromPromise(checkUpdate(), (e) =>
    buildDwError("Failed to check for updates.", String(e)),
  ),
);
