import { Editor, findParentNode } from "@tiptap/core";

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
