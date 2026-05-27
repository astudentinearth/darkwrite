import { FONT_VARS, FontStyle } from "@darkwrite/common";
import type { Editor, JSONContent } from "@tiptap/core";
import { type CSSProperties, use, useCallback, useMemo } from "react";
import { DarkwriteAPIClient } from "@/api/api-client";
import EditorUtil from "@/features/editor/editor-util";
import type { ImageExtensionConfig } from "@/features/editor/extensions/image/image-config";
import { useEditorActions } from "@/features/editor/store/editor-actions";
import { EditorContext } from "@/features/editor/store/editor-context";
import { selectEditorCustomizations } from "@/features/editor/store/editor-selectors";
import { useCenteredLayout } from "@/features/layout/hooks/use-centered-layout";
import { useEditorSettings } from "@/features/settings/hooks/use-settings";
import { useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";

export function useEditorView(noteId: string, rootView: boolean = false) {
  const customizations = useAppSelector((s) =>
    selectEditorCustomizations(s, noteId),
  );
  const editorWidth = useCenteredLayout(customizations?.widePage ? 0 : 984);
  const style: CSSProperties = useMemo(() => {
    const draft: CSSProperties = {};

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

    if (rootView) {
      if (customizations?.backgroundColor) {
        document.documentElement.style.setProperty(
          "--dw-editor-background",
          customizations.backgroundColor,
        );
      } else {
        document.documentElement.style.removeProperty("--dw-editor-background");
      }

      if (customizations?.textColor) {
        document.documentElement.style.setProperty(
          "--dw-editor-foreground",
          customizations.textColor,
        );
      } else {
        document.documentElement.style.removeProperty("--dw-editor-foreground");
      }
    }

    return draft;
  }, [customizations, rootView]);

  return { style, editorWidth };
}

export function useEditorOptions() {
  const {
    setCanUndo,
    setCanRedo,
    setWordCount,
    setEditorContent,
    setCharacterCount,
  } = useEditorActions();
  const workspaceId = useCurrentWorkspaceId() ?? "";
  const indentSize = useEditorSettings().codeIndentSize;
  const { noteId } = use(EditorContext);
  const imageConfig: ImageExtensionConfig = useMemo(
    () => ({
      saveArrayBuffer: async (buf, filetype) =>
        (
          await DarkwriteAPIClient.embed.create({
            file: buf,
            fileType: filetype,
            workspaceId,
          })
        )
          .map((r) => r.embed.id)
          .unwrapOr(""),
      uploadFile: async (file) =>
        (
          await DarkwriteAPIClient.embed.create({
            file,
            fileType: file.type,
            workspaceId,
          })
        )
          .map((r) => r.embed.id)
          .unwrapOr(""),
    }),
    [workspaceId],
  );

  const handleContentChange = useCallback(
    (content: JSONContent) => {
      setEditorContent(noteId, content);
    },
    [noteId, setEditorContent],
  );

  const onUpdate = useCallback(
    (editor: Editor) => {
      const util = EditorUtil(editor);
      const wordCount = util.countWords();
      const characterCount = util.countCharacters();
      setWordCount(noteId, wordCount);
      setCharacterCount(noteId, characterCount);
      setCanUndo(noteId, util.canUndo()());
      setCanRedo(noteId, util.canRedo()());
    },
    [noteId, setCanRedo, setCanUndo, setCharacterCount, setWordCount],
  );

  const onCreate = useCallback(
    (editor: Editor) => {
      const util = EditorUtil(editor);
      const wordCount = util.countWords();
      const characterCount = util.countCharacters();
      setWordCount(noteId, wordCount);
      setCharacterCount(noteId, characterCount);
    },
    [noteId, setCharacterCount, setWordCount],
  );

  return { imageConfig, indentSize, handleContentChange, onUpdate, onCreate };
}
