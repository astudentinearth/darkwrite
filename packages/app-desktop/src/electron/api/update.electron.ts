import { UpdateServerResponse } from "@darkwrite/common";
import { app } from "electron";
import semver from "semver";

interface UpdateStatus extends UpdateServerResponse {
  updateAvailable: boolean;
}

async function checkUpdate(
  // FIXME: Use the correct URL
  url: string = "http://localhost:3000/api/latest-release",
) {
  const res = await (await fetch(url)).json();
  if (!("latest" in res || "release_page" in res)) return undefined;
  const info = <UpdateServerResponse>res;
  return {
    ...info,
    updateAvailable: semver.gt(info.latest, app.getVersion()),
  } satisfies UpdateStatus;
}

export const Updater = {
  checkUpdate,
};
