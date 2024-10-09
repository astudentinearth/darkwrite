import { EditorBubble } from "novel";
import { useState } from "react";
import { FormattingButtons } from "./formatting";
import { HeadingSelector } from "./heading";

export default function Bubble() {
  const [headingOpen, setHeadingOpen] = useState(false);
  return (
    <EditorBubble
      tippyOptions={{
        placement: "top",
        animation: "slide",
      }}
      className="flex w-fit max-w-[90vw] overflow-hidden rounded-xl border border-muted bg-background shadow-xl slide-in-from-top-1 transition-opacity"
    >
      <FormattingButtons />
      <div className="w-[1px] bg-border"></div>
      <HeadingSelector open={headingOpen} setOpen={setHeadingOpen} />
    </EditorBubble>
  );
}
