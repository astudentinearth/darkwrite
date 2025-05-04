import { BubbleMenu, useCurrentEditor } from "@tiptap/react";
import { useState } from "react";
import { FormattingButtons } from "./formatting";
import { HeadingSelector } from "./heading";
import { BubbleLink } from "./link";
import { ListSelector } from "./list";

export default function Bubble() {
  const [headingOpen, setHeadingOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const { editor } = useCurrentEditor();
  return (
    <BubbleMenu
      tippyOptions={{
        placement: "top",
        animation: "slide",
        moveTransition: "transform 0.1s ease-out"
      }}
      editor={editor}
      className="flex w-fit h-fit max-w-[90vw] overflow-hidden gap-1 rounded-xl border border-border 
      bg-view-2 shadow-xl p-1 slide-in-from-top-1 transition-[opacity,transform,translate,scale,rotate]"
    >
      <FormattingButtons />
      <div className="w-[1px] bg-border"></div>
      <BubbleLink />
      <div className="w-[1px] bg-border"></div>
      <HeadingSelector open={headingOpen} setOpen={setHeadingOpen} />
      <ListSelector open={listOpen} setOpen={setListOpen} />
    </BubbleMenu>
  );
}
