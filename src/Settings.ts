export class GlobalSettings {
    public ThemeFile = "colors_dark.json";
    public Font = "Roboto";
    public Version = "1.0d";
    public AccentColor = "87 104 255";
    public WallpaperBlurRadius = 0;
    public static GetDefault() {
        return new GlobalSettings();
    }
    public static toJSON(s: GlobalSettings) {
        const json = {
            "themeFile": s.ThemeFile,
            "font": s.Font,
            "accentColor": s.AccentColor,
            "version": s.Version,
            "wallpaperBlurRadius": s.WallpaperBlurRadius
        };
        return json;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static fromJSON(json: any): GlobalSettings {
        const s = GlobalSettings.GetDefault();
        s.ThemeFile = json.themeFile ?? "colors_dark.json";
        s.Font = json.font ?? "Roboto";
        s.AccentColor = json.accentColor ?? "87 104 255";
        s.WallpaperBlurRadius = json.wallpaperBlurRadius ?? 0;
        return s;
    }
}
