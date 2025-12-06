import { useCurrentEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  calculateTableMenuPosition,
  getActiveTable,
  positionTableMenu,
} from "./table-util";
import { useCallback, useEffect, useRef } from "react";

export default function TableMenu() {
  const { editor } = useCurrentEditor();
  const menuRef = useRef<HTMLDivElement>(null!);

  const adjustTablePos = useCallback(() => {
    if (!editor) return;
    const table = getActiveTable(editor);
    if (!table) return;
    const pos = calculateTableMenuPosition(table, menuRef.current);
    positionTableMenu(menuRef.current, pos.x, pos.y);
  }, [editor]);

  useEffect(() => {
    window.addEventListener("resize", adjustTablePos);
    window.addEventListener("scroll", adjustTablePos, { capture: true });
    return () => {
      window.removeEventListener("resize", adjustTablePos);
      window.removeEventListener("scroll", adjustTablePos, { capture: true });
    };
  }, [adjustTablePos]);

  if (!editor) return <></>;
  return (
    <BubbleMenu
      editor={editor}
      pluginKey={"tableMenu"}
      shouldShow={({ editor }) => {
        if (!editor.isActive("table")) return false;
        return true;
      }}
      options={{
        flip: true,
        placement: "bottom",
        offset: 8,
        shift: true,
        onShow() {
          menuRef.current.setAttribute("data-state", "visible");
          adjustTablePos();
        },
        onUpdate() {
          adjustTablePos();
        },
        onHide() {
          menuRef.current.setAttribute("data-state", "hidden");
        },
      }}
    >
      <div
        ref={menuRef}
        data-animation="slide"
        className="flex w-fit h-fit max-w-[90vw] overflow-hidden gap-1 bubble-menu rounded-xl border border-border table-menu
                    bg-view-2 shadow-xl p-1 slide-in-from-top-1 transition-[opacity,transform,translate,scale,rotate]"
      >
        table menu
      </div>
    </BubbleMenu>
  );
}
