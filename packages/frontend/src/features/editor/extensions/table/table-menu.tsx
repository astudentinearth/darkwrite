import { useCurrentEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  calculateTableMenuPosition,
  getActiveTable,
  positionTableMenu,
} from "./table-util";
import { useCallback, useEffect, useRef } from "react";
import { BubbleButton } from "../bubble-menu/bubble-button";
import {
  PanelBottomClose,
  PanelRightClose,
  PanelRightOpen,
  PanelTopClose,
  Sheet,
  Trash,
} from "lucide-react";
import { CellSelection } from "@tiptap/pm/tables";
import { TableBackgroundPicker } from "./table-background-picker";
import DeleteColumn from "@/assets/delete-column.svg?react";
import DeleteRow from "@/assets/delete-row.svg?react";
import { useTranslation } from "react-i18next";

export default function TableMenu() {
  const { editor } = useCurrentEditor();
  const menuRef = useRef<HTMLDivElement | null>(null!);

  const { t } = useTranslation("translation", { keyPrefix: "editor.table" });

  const adjustTablePos = useCallback(() => {
    if (!editor) return;
    const table = getActiveTable(editor);
    if (!table || !menuRef.current) return;
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
      shouldShow={({ editor, state }) => {
        if (!editor.isActive("table")) return false;
        if (state.selection.empty || state.selection instanceof CellSelection)
          return true;
        return false;
      }}
      options={{
        flip: true,
        placement: "bottom",
        offset: 8,
        shift: true,
        onShow() {
          if (!menuRef.current) return;
          menuRef.current.setAttribute("data-state", "visible");
          adjustTablePos();
        },
        onUpdate() {
          adjustTablePos();
        },
        onHide() {
          if (!menuRef.current) return;
          menuRef.current.setAttribute("data-state", "hidden");
        },
      }}
    >
      <div
        ref={menuRef}
        //data-animation="slide"
        className="flex w-fit h-fit max-w-[90vw] overflow-hidden gap-1 bubble-menu rounded-xl border border-border table-menu
                    bg-view-2/80 top-highlight backdrop-blur-lg shadow-xl p-1 slide-in-from-top-1 transition-[opacity,transform,translate,scale,rotate]"
      >
        <BubbleButton
          isActive={() => false}
          editor={{ editor }}
          command={(e) => e.chain().focus().addColumnBefore().run()}
          icon={PanelRightOpen}
          name="add-column-before"
          title={t("addColBefore")}
        ></BubbleButton>
        <BubbleButton
          isActive={() => false}
          editor={{ editor }}
          command={(e) => e.chain().focus().addColumnAfter().run()}
          icon={PanelRightClose}
          name="add-column-after"
          title={t("addColAfter")}
        ></BubbleButton>
        <BubbleButton
          isActive={() => false}
          editor={{ editor }}
          command={(e) => e.chain().focus().deleteColumn().run()}
          icon={DeleteColumn}
          name="delete-column"
          title={t("deleteCol")}
        ></BubbleButton>
        <div className="w-[1px] bg-border"></div>
        <BubbleButton
          isActive={() => false}
          editor={{ editor }}
          command={(e) => e.chain().focus().addRowBefore().run()}
          icon={PanelTopClose}
          name="add-row-before"
          title={t("addRowBefore")}
        ></BubbleButton>
        <BubbleButton
          isActive={() => false}
          editor={{ editor }}
          command={(e) => e.chain().focus().addRowAfter().run()}
          icon={PanelBottomClose}
          name="add-row-after"
          title={t("addRowAfter")}
        ></BubbleButton>
        <BubbleButton
          isActive={() => false}
          editor={{ editor }}
          command={(e) => e.chain().focus().deleteRow().run()}
          icon={DeleteRow}
          name="delete-row"
          title={t("deleteRow")}
        ></BubbleButton>
        <div className="w-[1px] bg-border"></div>
        <BubbleButton
          isActive={() => false}
          editor={{ editor }}
          command={(e) => e.chain().focus().toggleHeaderRow().run()}
          icon={Sheet}
          name="toggle-header-row"
          title={t("headerRow")}
        ></BubbleButton>
        <BubbleButton
          isActive={() => false}
          editor={{ editor }}
          command={(e) => e.chain().focus().toggleHeaderColumn().run()}
          icon={Sheet}
          name="toggle-header-column"
          className="-rotate-90"
          title={t("headerCol")}
        ></BubbleButton>
        <div className="w-[1px] bg-border"></div>
        <TableBackgroundPicker />
        <div className="w-[1px] bg-border"></div>
        <BubbleButton
          isActive={() => false}
          editor={{ editor }}
          command={(e) => e.chain().focus().deleteTable().run()}
          icon={Trash}
          name="delete-table"
          title={t("delete")}
        ></BubbleButton>
      </div>
    </BubbleMenu>
  );
}
