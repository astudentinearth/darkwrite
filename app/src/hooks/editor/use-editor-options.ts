import { ImageExtensionConfig } from "@/features/editor/extensions/image/image-config";
import { useCenteredLayout } from "../layout/use-centered-layout";
import { DarkwriteAPIClient } from "@/api/api-client";
import { useLocalStore } from "@/context/local-state";
import { useEditorStore } from "@/context/editor-store";
import { CSSProperties } from "react";
import { FONT_VARS, FontStyle } from "@/common/note-customization";
import { useEditorSettings } from "@/features/settings/store/settings-selectors";

export function useEditorOptions(widePage: boolean = false) {
  const editorWidth = useCenteredLayout(widePage ? 0 : 984);
  const customizations = useEditorStore((s) => s.customizations);
  const workspaceId = useLocalStore((s) => s.workspaceId);
  const imageConfig: ImageExtensionConfig = {
    saveArrayBuffer: async (buf, filetype) =>
      (
        await DarkwriteAPIClient.embed.create({
          file: buf,
          fileType: filetype,
          workspaceId,
        })
      ).embed?.id ?? "",
    uploadFile: async (file) =>
      (
        await DarkwriteAPIClient.embed.create({
          file,
          fileType: file.type,
          workspaceId,
        })
      ).embed?.id ?? "",
  };
  const indentSize = useEditorSettings().codeIndentSize;
  const style: CSSProperties = {};
  style.fontFamily =
    customizations.font === FontStyle.CUSTOM
      ? (customizations.customFont ?? `var(${FONT_VARS.custom})`)
      : customizations.font
        ? `var(${FONT_VARS[customizations.font]})`
        : `var(${FONT_VARS.sans})`;

  if (customizations.backgroundColor)
    style.background = customizations.backgroundColor;
  if (customizations.textColor) {
    style.color = customizations.textColor;
    //@ts-expect-error assigning CSS variable to React.CSSProperties
    style["--dw-editor-foreground"] = customizations.textColor;
  }
  return { editorWidth, imageConfig, indentSize, style };
}
