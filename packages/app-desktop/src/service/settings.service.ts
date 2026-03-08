import { readFile, writeFile } from "fs/promises";
import { exists } from "fs-extra";
import { SETTINGS_PATH } from "../lib/paths";
import { SettingsModel } from "@darkwrite/common/settings";

export class SettingsService {
  async readSettingsFile() {
    const fileExists = await exists(SETTINGS_PATH);
    if (!fileExists) {
      const defaults = JSON.stringify(SettingsModel.getDefaults());
      await this.writeSettingsFile(defaults);
      return defaults;
    }
    return readFile(SETTINGS_PATH, "utf8");
  }

  async writeSettingsFile(contents: string) {
    return writeFile(SETTINGS_PATH, contents);
  }
}
