import { ImageExtensionConfig } from "@/features/editor/extensions/image/image-config";
import { useCenteredLayout } from "../layout/use-centered-layout";
import { DarkwriteAPIClient } from "@/api/api-client";
import { useLocalStore } from "@/context/local-state";
import { useSettings } from "@/query/use-settings";

export function useEditorOptions(widePage: boolean = false) {
  const editorWidth = useCenteredLayout(widePage ? 0 : 984);
  const workspaceId = useLocalStore(s => s.workspaceId);
  const imageConfig: ImageExtensionConfig = {
    saveArrayBuffer: async (buf, filetype) =>
      (await DarkwriteAPIClient.embed.create({file: buf, fileType: filetype, workspaceId})).embed?.id ?? "",
    uploadFile: async (file) => (await DarkwriteAPIClient.embed.create({file, fileType: file.type, workspaceId})).embed?.id ?? ""
  };
  const indentSize = useSettings().data.editor.codeIndentSize;
  return { editorWidth, imageConfig, indentSize}
}
