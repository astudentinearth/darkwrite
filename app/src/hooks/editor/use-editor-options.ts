import { ImageExtensionConfig } from "@/features/editor/extensions/image/image-config";
import { useCenteredLayout } from "../layout/use-centered-layout";
import { DarkwriteAPIClient } from "@/api/api-client";
import { useLocalStore } from "@/context/local-state";
import { useEditorStore } from "@/context/editor-store";
import { CSSProperties, use, useCallback, useMemo } from "react";
import { FONT_VARS, FontStyle } from "@/common/note-customization";
import { useEditorSettings } from "@/features/settings/store/settings-selectors";
import { useAppSelector } from "@/features/store/hooks";
import { selectEditorCustomizations } from "@/features/editor/store/editor-selectors";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { Editor, JSONContent } from "@tiptap/core";
import { setCharacterCount, setEditorContent, setWordCount } from "@/features/editor/store/editor-actions";
import { EditorContext } from "@/features/editor/store/editor-context";
import EditorUtil from "@/features/editor/editor-util";

export function useEditorView(noteId: string) {
  const customizations = useAppSelector(s => selectEditorCustomizations(s, noteId));
  const editorWidth = useCenteredLayout(customizations?.widePage ? 0 : 984);
  const style: CSSProperties = useMemo(() => {
    const draft: CSSProperties = {}

    draft.fontFamily =
      customizations?.font === FontStyle.CUSTOM
        ? (customizations?.customFont ?? `var(${FONT_VARS.custom})`)
        : customizations?.font
          ? `var(${FONT_VARS[customizations.font]})`
          : `var(${FONT_VARS.sans})`;

    if (customizations?.backgroundColor) {
      draft.background = customizations.backgroundColor;
    }

    if (customizations?.textColor) {
      draft.color = customizations.textColor;
      //@ts-expect-error assigning CSS variable to React.CSSProperties
      draft["--dw-editor-foreground"] = customizations.textColor;
    }

    return draft;
  }, [customizations])

  return { style, editorWidth }

}

export function useEditorOptions() {
  const workspaceId = useCurrentWorkspaceId() ?? "";
  const indentSize = useEditorSettings().codeIndentSize;
  const { noteId } = use(EditorContext);
  const imageConfig: ImageExtensionConfig = useMemo(() => ({
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
  }), [workspaceId]);

  const handleContentChange = useCallback((content: JSONContent) => {
    setEditorContent(noteId, content);
  }, [noteId])

  const onUpdate = useCallback((editor: Editor) => {
    const util = EditorUtil(editor);
    const wordCount = util.countWords();
    const characterCount = util.countCharacters();
    setWordCount(noteId, wordCount);
    setCharacterCount(noteId, characterCount);
  }, [])

  return { imageConfig, indentSize, handleContentChange, onUpdate };
}
