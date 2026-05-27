import type { Theme } from "@/theme";

export interface ThemesResponseDTO {
  themes: Record<string, Theme>;
}
