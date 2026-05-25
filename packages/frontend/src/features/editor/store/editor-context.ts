import React from "react";

/**
 * This is used to pass the note id and a buffer id to editor components.
 */
export type IEditorContext = {
  noteId: string;
  /**
   * Stable ID generated once per editor view mount.
   * Used to route bus events to the correct editor instance when the same
   * note is open in multiple views simultaneously (e.g. center-peek).
   */
  instanceId: string;
  // Do NOT add state that frequently changes here. It will make the editor die.
  // This is just a DI container for stable state.
};

export const EditorContext = React.createContext<IEditorContext>({
  noteId: "",
  instanceId: "",
});
