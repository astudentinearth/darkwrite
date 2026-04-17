import { useCurrentEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { FormattingButtons } from "./formatting";
import { HeadingSelector } from "./heading";
import { BubbleLink } from "./link";
import { ListSelector } from "./list";
import { TextColorSelector } from "./color";
import { HighlightColorSelector } from "./highlight";
import { CellSelection } from "@tiptap/pm/tables";
import { Block } from "../../types";

export default function Bubble() {
  const { editor } = useCurrentEditor();
  if (!editor) return <></>;
  return (
    <BubbleMenu
      pluginKey={"bubbleMenu"}
      className="bubble-menu-wrapper"
      shouldShow={({ editor, state }) => {
        if (state.selection instanceof CellSelection) return false;
        if (editor.isActive(Block.Image) || editor.isActive(Block.LinkToPage))
          return false;
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

          const root = document.querySelector(
            ".bubble-menu-wrapper",
          )?.parentElement;
          root?.classList.remove("bubble-settled");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              root?.classList.add("bubble-settled");
            });
          });

          document
            .querySelector(".bubble-menu-wrapper")
            ?.setAttribute("data-state", "visible");
        },
        onHide() {
          document
            .querySelector(".bubble-menu")
            ?.setAttribute("data-state", "hidden");
          const root = document.querySelector(
            ".bubble-menu-wrapper",
          )?.parentElement;
          root?.classList.remove("bubble-settled");
          document
            .querySelector(".bubble-menu-wrapper")
            ?.setAttribute("data-state", "hidden");
        },
      }}
      editor={editor}
    >
      <div
        data-animation="slide"
        className="flex w-fit h-fit max-w-[90vw] top-highlight overflow-hidden gap-1 bubble-menu rounded-xl border border-border
              bg-view-2/80 backdrop-blur-lg shadow-xl p-1 slide-in-from-top-1 transition-[opacity,transform,translate,scale,rotate]"
      >
        <FormattingButtons />
        <div className="w-px bg-border"></div>
        <BubbleLink />
        <div className="w-px bg-border"></div>
        <HeadingSelector />
        <ListSelector />
        <div className="w-px bg-border"></div>
        <TextColorSelector />
        <HighlightColorSelector />
      </div>
    </BubbleMenu>
  );
}
