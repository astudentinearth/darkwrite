import { NoteDTO, NotesResponseDTO } from "@/common/dto";
import {
  combineIds,
  fetchListState,
  getSortedIds,
  selectIds,
} from "./use-note-list";
import { DarkwriteAPIClient } from "@/api/api-client";

vi.mock("@/api/api-client", () => ({
  DarkwriteAPIClient: {
    note: {
      getByParentId: vi.fn(),
    },
  },
}));

vi.mock("@/context/local-state", () => ({
  useLocalStore: vi.fn(),
}));

describe("note list hooks", () => {
  it("should combine note IDs with the default delimiter", () => {
    const notes = [{ id: "1" }, { id: "2" }, { id: "3" }];
    const result = combineIds(notes as NoteDTO[]);
    expect(result).toBe("1$2$3");
  });

  it("should combine note IDs with a custom delimiter", () => {
    const notes = [{ id: "1" }, { id: "2" }, { id: "3" }];
    const result = combineIds(notes as NoteDTO[], ",");
    expect(result).toBe("1,2,3");
  });

  it("should sort note IDs by orderHint", () => {
    const response: NotesResponseDTO = {
      notes: {
        "1": { id: "1", orderHint: "c" } as NoteDTO,
        "2": { id: "2", orderHint: "a" } as NoteDTO,
        "3": { id: "3", orderHint: "b" } as NoteDTO,
      },
    };
    const result = getSortedIds(response);
    expect(result).toBe("2$3$1");
  });

  it("should transform api responses correctly", async () => {
    const mockApi = vi.mocked(DarkwriteAPIClient.note.getByParentId);
    mockApi.mockResolvedValue({
      notes: {
        "2": { id: "2", orderHint: "b" } as NoteDTO,
        "1": { id: "1", orderHint: "a" } as NoteDTO,
        "3": { id: "3", orderHint: "c" } as NoteDTO,
      },
    } as NotesResponseDTO);

    const result = await fetchListState("workspace-id", "parent-id");

    expect(mockApi).toHaveBeenCalledWith("workspace-id", "parent-id");
    expect(selectIds(result)).toEqual("1$2$3");
  });
});
