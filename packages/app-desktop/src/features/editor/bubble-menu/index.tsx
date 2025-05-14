import { EditorBubble } from "novel";
import { useState } from "react";
import { FormattingButtons } from "./formatting";
import { HeadingSelector } from "./heading";
import { BubbleLink } from "./link";
import { ListSelector } from "./list";
export default function Bubble() {
  const [headingOpen, setHeadingOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  return (
    <EditorBubble
      tippyOptions={{
        placement: "top",
        animation: "slide",
      }}
      className="flex w-fit h-fit max-w-[90vw] overflow-hidden gap-1 rounded-xl border border-border 
      bg-view-2 shadow-xl p-1 slide-in-from-top-1 transition-opacity"
    >
      <FormattingButtons />
      <div className="w-[1px] bg-border"></div>
      <BubbleLink />
      <div className="w-[1px] bg-border"></div>
      <HeadingSelector open={headingOpen} setOpen={setHeadingOpen} />
      <ListSelector open={listOpen} setOpen={setListOpen} />
    </EditorBubble>
  );
}
