export interface SettingsV1Schema {
  appearance: {
    theme: string;
    accentColor: string;
    useSystemWindowFrame: boolean;
    enableCustomWindowFrameOnDarwin: boolean;
    useSystemAccentColor: boolean;
  };
  fonts: {
    sans: string;
    serif: string;
    code: string;
    ui: string;
  };
  editor: {
    codeBlockIndentSize: number;
  };
  updateCheckEnabled: boolean;
  version: string;
}
