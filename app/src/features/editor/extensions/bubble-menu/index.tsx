import { useCurrentEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";
import { FormattingButtons } from "./formatting";
import { HeadingSelector } from "./heading";
import { BubbleLink } from "./link";
import { ListSelector } from "./list";
import { TextColorSelector } from "./color";
import { HighlightColorSelector } from "./highlight";

export default function Bubble() {
  const [headingOpen, setHeadingOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const { editor } = useCurrentEditor();
  if (!editor) return <></>;
  return (
    <BubbleMenu
      pluginKey={"bubbleMenu"}
      shouldShow={({ editor, state, from, to }) => {
        return !editor.isEmpty && editor.state.selection?.empty === false;
      }}
      options={{
        placement: "top",
        flip: true,
        offset: 8,
        shift: true,
        onShow() {
          document
            .querySelector(".bubble-menu")
            ?.setAttribute("data-state", "visible");
        },
        onHide() {
          document
            .querySelector(".bubble-menu")
            ?.setAttribute("data-state", "hidden");
        },
      }}
      editor={editor}
    >
      <div
        data-animation="slide"
        className="flex w-fit h-fit max-w-[90vw] overflow-hidden gap-1 bubble-menu rounded-xl border border-border
              bg-view-2 shadow-xl p-1 slide-in-from-top-1 transition-[opacity,transform,translate,scale,rotate]"
      >
        <FormattingButtons />
        <div className="w-[1px] bg-border"></div>
        <BubbleLink />
        <div className="w-[1px] bg-border"></div>
        <HeadingSelector />
        <ListSelector open={listOpen} setOpen={setListOpen} />
        <div className="w-[1px] bg-border"></div>
        <TextColorSelector />
        <HighlightColorSelector />
      </div>
    </BubbleMenu>
  );
}
