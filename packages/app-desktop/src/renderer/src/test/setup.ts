import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("zustand");
vi.mock("@renderer/lib/api/note", () => ({
  createNote: vi.fn(),
  updateContents: vi.fn(),
  getContents: vi.fn(),
  deleteNote: vi.fn(),
  moveNote: vi.fn(),
  updateNote: vi.fn(),
  getNotes: vi.fn(),
  moveToTrash: vi.fn(),
  restoreFromTrash: vi.fn(),
  getNote: vi.fn(),
  saveAll: vi.fn(),
}));
vi.mock("@renderer/lib/app-menu", () => ({
  showAppMenu: vi.fn(),
}));

afterEach(() => {
  cleanup();
});
