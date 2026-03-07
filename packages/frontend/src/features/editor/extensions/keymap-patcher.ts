import { Extension } from "@tiptap/core";

export const KeymapFixer = Extension.create({
  addKeyboardShortcuts() {
    return {
      "Mod-n": () => false,
    };
  },
});
