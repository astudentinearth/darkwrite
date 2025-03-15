import { Note, NotePartial } from "@darkwrite/common";
import DynamicTextarea from "@renderer/components/dynamic-textarea";
import { EmojiPicker } from "@renderer/components/emoji-picker";
import { FlexibleSpacer } from "@renderer/components/spacer";
import { Button } from "@darkwrite/ui";
import {
  setEditorCustomizations,
  useEditorState,
} from "@renderer/context/editor-state";
import { uploadImage } from "@renderer/lib/upload";
import { cn, fromUnicode } from "@renderer/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Frown, ImagePlus, SmilePlus, TriangleAlert } from "lucide-react";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

export function EditorCover(props: {
  note: Note;
  update: (data: NotePartial) => void;
  hasCover?: boolean;
  wide?: boolean;
}) {
  //TODO: get rid of this mess, maybe rewrite again?
  const { note, update } = props;
  const id = note.id;
  const [inputValue, setInputValue] = useState(note.title);
  const [debouncedValue] = useDebounce(inputValue, 200);
  const queryClient = useQueryClient();
  const lastMutationRef = useRef<string>("");
  const lastInputRef = useRef<string>("");
  const editor = useEditorState((s) => s.editorInstance);
  const customizations = useEditorState((s) => s.customizations);
  const [mouseOver, setMouseOver] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    lastInputRef.current = e.target.value.replace(/\r?\n|\r/g, " ");
    setInputValue(e.target.value);
  };

  // Reset inputValue when note changes
  useEffect(() => {
    if (note.title === lastMutationRef.current) return;
    setInputValue(note.title);
  }, [note]);

  useEffect(() => {
    if (!id || !debouncedValue || !inputValue) return;
    if (debouncedValue === inputValue && note.title !== debouncedValue) {
      lastMutationRef.current = debouncedValue;
      update({ id, title: debouncedValue });
    }
  }, [debouncedValue, inputValue, id, update, queryClient, note.title]);

  const handleEmojiChange = (unified: string) => {
    update({ id, icon: unified });
  };

  const handleNewLine = () => {
    editor?.commands.insertContentAt(0, "<p></p>");
    editor?.commands.focus("start");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNewLine();
    }
    if (e.key === "ArrowDown") {
      editor?.commands.focus("start");
    }
  };

  const addCover = async () => {
    try {
      console.log(">>> Adding cover image");
      const embed = await uploadImage();
      console.log(">>> Added cover image: here's what we got");
      console.table(embed);
      setEditorCustomizations({
        ...customizations,
        coverEmbedId: embed.id,
      });
    } catch (error) {
      console.error(error);
      /**empty */
    }
  };

  const addIcon = () => {
    update({ id, icon: "1f4c4" });
  };

  const removeIcon = () => {
    update({ id, icon: "" });
  };

  return (
    <div
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
      className={cn(
        "shrink-0 flex flex-col w-full p-4 pb-2 px-20 gap-2 max-w-(--editor-max-width)",
        !note.isTrashed && note.icon !== "" && props.hasCover && "mt-[-50px]",
        !note.isTrashed && note.icon !== "" && !props.hasCover && "pt-16",
      )}
    >
      {note.isTrashed && (
        <>
          <div className="bg-destructive/20 font-(family-name:--font-ui) z-30 text-foreground p-3 rounded-xl flex flex-col gap-1 border border-destructive drop-shadow-lg">
            <TriangleAlert />
            <div className="flex items-center">
              <span className="justify-self-start">
                This note is in the trash.
              </span>
              <FlexibleSpacer />
              <Button
                variant={"outline"}
                className="rounded-xl bg-view-2 w-fit justify-self-end"
                onClick={() => {
                  update({ id, isTrashed: false });
                }}
              >
                Restore
              </Button>
            </div>
          </div>
          <div className="h-4"></div>
        </>
      )}

      <div className="flex items-end gap-2">
        {note.icon !== "" && (
          <EmojiPicker
            show={fromUnicode(note.icon ?? "")}
            closeOnSelect
            onSelect={handleEmojiChange}
            className="z-50"
          />
        )}

        {note.icon === "" && (
          <Button
            variant={"ghost"}
            onClick={addIcon}
            className={cn(
              "z-50 bg-secondary/0 gap-2 text-foreground/80 hover:text-foreground font-ui opacity-0",
              note.icon === "" && mouseOver && "opacity-100",
            )}
          >
            <SmilePlus size={18} />
            Add icon
          </Button>
        )}
        {note.icon !== "" && (
          <Button
            variant={"ghost"}
            onClick={removeIcon}
            className={cn(
              "z-50 bg-secondary/0 gap-2 text-foreground/80 hover:text-foreground font-ui opacity-0",
              note.icon !== "" && mouseOver && "opacity-100",
            )}
          >
            <Frown size={18} />
            Remove icon
          </Button>
        )}
        <Button
          onClick={addCover}
          variant={"ghost"}
          disabled={props.hasCover}
          className={cn(
            "z-50 bg-secondary/0 gap-2 text-foreground/80 hover:text-foreground font-ui opacity-0",
            mouseOver && !props.hasCover && "opacity-100",
            props.hasCover && "hidden",
          )}
        >
          <ImagePlus size={18} />
          Add cover
        </Button>
      </div>
      <DynamicTextarea
        className="text-4xl px-0 box-border border-b border-muted/50 bg-transparent p-2 overflow-hidden h-auto grow resize-none outline-hidden font-semibold block"
        value={inputValue}
        onValueChange={handleChange}
        onKeyDown={handleKeyDown}
        preventNewline
        onDrop={(event) => event.preventDefault()}
      />
    </div>
  );
}
