import { type Editor, findParentNode } from "@tiptap/core";
import { CellSelection } from "@tiptap/pm/tables";

export function getActiveTable(editor: Editor) {
  const { view, state } = editor;
  const tableNode = findParentNode((node) => node.type.name === "table")(
    state.selection,
  );
  if (!tableNode) return null;

  const domNode = view.nodeDOM(tableNode.pos);
  if (!domNode) return null;
  else return domNode as HTMLTableElement;
}

export function calculateTableMenuPosition(
  table: HTMLTableElement,
  menu: HTMLDivElement,
  offset = 0,
) {
  const tableRect = table.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const yTable = tableRect.top;
  const hMenu = menuRect.height;
  let yMenu = yTable - hMenu - offset;

  if (yMenu < 60) yMenu = 60;

  const xTable = tableRect.left;

  const wTable = tableRect.width;

  const wMenu = menuRect.width;
  const xMenu = xTable + (wTable - wMenu) / 2;

  return { x: xMenu, y: yMenu };
}

export function positionTableMenu(menu: HTMLDivElement, x: number, y: number) {
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.position = "fixed";
}

export function setCellBackground(editor: Editor, color: string | null) {
  const { state, view } = editor;
  const { selection } = state;
  const tr = state.tr;

  if (selection instanceof CellSelection) {
    selection.forEachCell((node, pos) => {
      tr.setNodeAttribute(pos, "background", color);
    });
  } else {
    const cell = findParentNode(
      (n) => n.type.name === "tableHeader" || n.type.name === "tableCell",
    )(selection);
    if (cell) tr.setNodeAttribute(cell.pos, "background", color);
  }

  if (tr.docChanged) view.dispatch(tr);
}
