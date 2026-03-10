import { create } from "zustand";

export interface EditorStore {
  width: number;
}

export const useEditorStore = create<EditorStore>()(() => ({
  width: 800,
}));
