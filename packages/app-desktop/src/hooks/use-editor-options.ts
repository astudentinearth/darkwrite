import { useLocalStore } from "@/context/local-state";
import { useCenteredLayout } from "./layout/use-centered-layout";
import { useSettingsStore } from "@/context/settings-store";
import { ImageExtensionConfig } from "@darkwrite/editor";
import { EmbedAPI } from "@/api";

export const useEditorOptions = (widePage: boolean = false) => {
  const editorWidth = useCenteredLayout(widePage ? 0 : 984);
  const wordCountEnabled = useLocalStore((s) => s.alwaysShowWordCount);
  const indentSize = useSettingsStore(
    (s) => s.settings.editor.codeBlockIndentSize,
  );
  const imageConfig: ImageExtensionConfig = {
    saveArrayBuffer: async (buf, filetype) =>
      (await EmbedAPI().createFromArrayBuffer(buf, filetype)).id,
    uploadFile: async (file) => (await EmbedAPI().create(file)).id,
  };
  return { editorWidth, wordCountEnabled, indentSize, imageConfig };
};
