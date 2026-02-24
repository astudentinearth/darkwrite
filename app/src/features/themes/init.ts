import { DarkwriteAPIClient } from "@/api/api-client";
import { setThemes } from "./store/theme-actions";

export async function initializeThemes() {
  const response = await DarkwriteAPIClient.theme.getThemes();
  setThemes(Object.values(response.themes));
}

