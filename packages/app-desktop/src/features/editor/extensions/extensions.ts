import { cx } from "class-variance-authority";
import {
  Color,
  GlobalDragHandle,
  HighlightExtension,
  Placeholder,
  TaskItem,
  TaskList,
} from "novel/extensions";
import AutoJoiner from "tiptap-extension-auto-joiner";
import { LinkToPage } from "./link-to-page";
import { TextExtensions } from "./text";
import { DarkwriteImage } from "./darkwrite-image";
import { KeymapFixer } from "./keymap-fixer";


const placeholder = Placeholder.configure({});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2 "),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4"),
  },
  nested: true,
});

/** @deprecated - use darkwrite/editor instead. */
export const defaultExtensions = [
  placeholder,
  DarkwriteImage,
  taskList,
  taskItem,
  GlobalDragHandle,
  AutoJoiner,
  Color,
  HighlightExtension,
  LinkToPage,
  ...TextExtensions,
  KeymapFixer,
];
