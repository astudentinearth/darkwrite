import { Extension } from "@tiptap/core";

/** @deprecated - use darkwrite/editor instead. */
export const KeymapFixer = Extension.create({
  addKeyboardShortcuts() {
    return {
      "Mod-n": () => false,
    };
  },
});
