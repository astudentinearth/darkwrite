import { useSlashCommand, EditorContent } from "@darkwrite/editor";
import "@darkwrite/editor/dist/editor.css";
import "@darkwrite/editor/dist/styles.css";
import { EmbedAPI } from "@/api";
import {
  setEditorContent,
  setEditorCustomizations,
  useEditorState,
} from "@/context/editor-state";
import { useNotesQuery, useUpdateNoteMutation } from "@/hooks/query";
import { debouncedSave } from "@/hooks/query/use-note-contents-mutation";
import { useEditorOptions } from "@/hooks/use-editor-options";
import { useEditorStateManager } from "@/hooks/use-editor-state-manager";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";
import { useNoteEditor } from "@/hooks/use-note-editor";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import DarkwriteEditorView from "../editorv2/editor";
import { EditorCover } from "./cover";
import { CoverImage } from "./cover-image";
import { WordCounter } from "./word-count";
import { useEditorCustomizations } from "@/hooks/use-editor-customizations";
import { serializeNote } from "@darkwrite/common";

export function EditorRoot() {
  const { note, isFetching, isError, content, customizations, spellcheck } =
    useNoteEditor();

  const { editorWidth, imageConfig, indentSize, wordCountEnabled } =
    useEditorOptions();

  const { setEditor, setValue, value } = useEditorStateManager();
  const update = useUpdateNoteMutation().mutate;

  const _customizations = useEditorState((s) => s.customizations);
  const rootContainerRef = useRef<HTMLDivElement>(null);
  useEditorCustomizations(rootContainerRef);

  const notes = useNotesQuery().data;

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
        serializeNote(value, _customizations)
      );
    }
    // Adding mutations will create a black hole
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_customizations, isFetching, note?.id, value]);



  // Something must have failed if we are not fetching and there is no note to be seen
  if (isError || (!note && !isFetching))
    return (
      <div className="bg-destructive text-destructive-foreground">
        Something went wrong loading note.
      </div>
    );

  const handleContentChange = (content: EditorContent) => {
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
            embedId={_customizations?.coverImageSource}
          />
          <EditorCover
            key={`cover-${note.id}`}
            note={note}
            update={(dto)=>update({id: note.id, dto})}
            hasCover={!!_customizations.coverImageSource}
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
