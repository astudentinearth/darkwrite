import React from "react";

/**
 * This is used to pass the note ID down the editor subtree.
 */
export type IEditorContext = {
  noteId: string;
  // Do NOT add state that frequently changes here. It will make the editor die.
  // This is just a DI container for stable state.
};

export const EditorContext = React.createContext<IEditorContext>({
  noteId: "",
});
