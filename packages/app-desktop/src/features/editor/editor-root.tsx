import { ImageExtensionConfig, useSlashCommand } from "@darkwrite/editor";
import { EmbedAPI } from "@renderer/api";
import {
  setEditorContent,
  setEditorCustomizations,
  useEditorState,
} from "@renderer/context/editor-state";
import { useLocalStore } from "@renderer/context/local-state";
import { useSettingsStore } from "@renderer/context/settings-store";
import { useNotesQuery, useUpdateNoteMutation } from "@renderer/hooks/query";
import { debouncedSave } from "@renderer/hooks/query/use-note-contents-mutation";
import { useCenteredLayout } from "@renderer/hooks/use-centered-layout";
import { useNoteEditor } from "@renderer/hooks/use-note-editor";
import { cn } from "@renderer/lib/utils";
import { JSONContent } from "novel";
import React, { useEffect, useRef } from "react";
import DarkwriteEditorView from "../editorv2/editor";
import { EditorCover } from "./cover";
import { CoverImage } from "./cover-image";
// import "./css/command.css";
// import "./css/drag-handle.css";
// import "./css/editor.css";
// import "./css/image.css";
// import "./css/lists.css";
// import "./css/text.css";
import { WordCounter } from "./word-count";
import "@darkwrite/editor/dist/editor.css";
import "@darkwrite/editor/dist/styles.css";
import { useNavigateToNote } from "@renderer/hooks/use-navigate-to-note";
import { useTranslation } from "react-i18next";

export function EditorRoot() {
  const { note, isFetching, isError, content, customizations, spellcheck } =
    useNoteEditor();
  const update = useUpdateNoteMutation().mutate;
  const value = useEditorState((s) => s.content);
  const setValue = useEditorState((s) => s.setContent);
  const _customizations = useEditorState((s) => s.customizations);
  const rootContainerRef = useRef<HTMLDivElement>(null);
  const editorWidth = useCenteredLayout(_customizations.widePage ? 0 : 984);
  const wordCountEnabled = useLocalStore((s) => s.alwaysShowWordCount);
  const notes = useNotesQuery().data;
  const indentSize = useSettingsStore(
    (s) => s.settings.editor.codeBlockIndentSize,
  );
  const imageConfig: ImageExtensionConfig = {
    saveArrayBuffer: async (buf, filetype) =>
      (await EmbedAPI().createFromArrayBuffer(buf, filetype)).id,
    uploadFile: async (file) => (await EmbedAPI().create(file)).id,
  };
  const setEditor = useEditorState((s) => s.setEditorInstance);
  const nav = useNavigateToNote();
  const { i18n } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { items } = useSlashCommand(imageConfig, i18n as any);
  useEffect(() => {
    if (content && customizations) {
      setEditorContent(content);
      setEditorCustomizations(customizations);
    }
  }, [content, customizations]);

  useEffect(() => {
    if (!isFetching && note != null && note.id !== "") {
      debouncedSave(
        note.id,
        JSON.stringify({
          contents: value,
          customizations: _customizations ?? {},
        }),
      );
    }
    // Adding mutations will create a black hole
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_customizations, isFetching, note?.id, value]);

  useEffect(() => {
    if (!rootContainerRef.current) return;
    rootContainerRef.current.style.setProperty(
      "--dw-custom-font-name",
      _customizations.customFont ?? "",
    );
    rootContainerRef.current.style.setProperty(
      "--dw-editor-background",
      _customizations.backgroundColor || "transparent",
    );
    rootContainerRef.current.style.setProperty(
      "--dw-editor-foreground",
      _customizations.textColor || "var(--foreground)",
    );
  }, [_customizations]);

  // Something must have failed if we are not fetching and there is no note to be seen
  if (isError || (!note && !isFetching))
    return (
      <div className="bg-destructive text-destructive-foreground">
        Something went wrong loading note.
      </div>
    );

  const handleContentChange = (content: JSONContent) => {
    //console.log("Updating content");
    setValue(content);
  };

  return (
    <div
      spellCheck={spellcheck}
      ref={rootContainerRef}
      className={cn(
        "h-full w-full overflow-y-auto overflow-x-auto main-view flex bg-(--dw-editor-background) text-(--dw-editor-foreground) flex-col items-center",
        (_customizations.font == "sans" || _customizations.font == null) &&
          "darkwrite-sans",
        _customizations.font == "serif" && "darkwrite-serif",
        _customizations.font == "mono" && "darkwrite-mono",
        _customizations.font == "custom" && "darkwrite-custom-font",
      )}
      style={
        {
          "--editor-max-width": `${editorWidth}px`,
        } as React.CSSProperties
      }
    >
      {note != null && !isFetching ? (
        <>
          <CoverImage
            key={`coverimg-${note.id}`}
            note={note}
            embedId={_customizations?.coverEmbedId}
          />
          <EditorCover
            key={`cover-${note.id}`}
            note={note}
            update={update}
            hasCover={!!_customizations.coverEmbedId}
            wide={_customizations.widePage}
          />
        </>
      ) : (
        ""
      )}
      {content != null && !isError && !isFetching && note && (
        <>
          <div
            className={cn(
              "w-full max-w-(--editor-max-width)",
              "p-0 px-16",
              "grow",
            )}
          >
            <DarkwriteEditorView
              codeBlockIndentSize={indentSize}
              commandItems={items}
              content={content}
              onContentChange={handleContentChange}
              key={`editor-${note.id}`}
              onInstanceChange={(e) => setEditor(e)}
              notes={notes ?? undefined}
              embedSourceResolver={EmbedAPI().resolveSourceURL}
              imageUploadConfig={imageConfig}
              onNavigateToNote={nav}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              i18n={i18n as any}
            />
          </div>
          {/* <TextEditor
            key={`editor-${note.id}`}
            customizations={_customizations ?? {}}
            initialValue={content}
            onChange={handleContentChange}
          /> */}
          {wordCountEnabled && <WordCounter />}
        </>
      )}
    </div>
  );
}
