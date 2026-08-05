import { describe, expect, it } from "vitest";
import { editorSlice, initialEditorState } from "./editor-slice";

const { setEditable } = editorSlice.actions;

describe("editorSlice reader mode", () => {
  it("starts editable", () => {
    expect(initialEditorState.editable).toBe(true);
  });

  it("setEditable(false) enters reader mode", () => {
    const state = editorSlice.reducer(initialEditorState, setEditable(false));
    expect(state.editable).toBe(false);
  });

  it("setEditable(true) leaves reader mode", () => {
    const readOnly = editorSlice.reducer(
      initialEditorState,
      setEditable(false),
    );
    const state = editorSlice.reducer(readOnly, setEditable(true));
    expect(state.editable).toBe(true);
  });
});
