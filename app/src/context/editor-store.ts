import { create } from "zustand";

export interface EditorStore {
  noteId: string;
  width: number;
}

export const useEditorStore = create<EditorStore>()(() => ({
  noteId: "",
  width: 800,
}));

