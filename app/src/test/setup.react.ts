import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as apis from "@/api";
import { MockEmbedAPI, MockNoteAPI, MockSettingsAPI } from "./mock-api";
import indexeddb from "fake-indexeddb"


globalThis.indexedDB = indexeddb;

vi.mock("zustand");
vi.mock("@/lib/api/note", () => ({
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

vi.mock("@/lib/app-menu", () => ({
  showAppMenu: vi.fn(),
}));

vi.mock("@/lib/api/exporter.ts", () => ({
  ExporterModel: {
    exportAllAsHTML: vi.fn(),
  },
}));

vi.mock("@/lib/api/backup.ts", () => ({
  BackupModel: {
    backupData: vi.fn(),
  },
}));

vi.mock("@/lib/api/theme.ts", () => ({}));

vi.mock("@/lib/api/embed.ts", () => ({}));

vi.spyOn(apis, "NoteAPI").mockReturnValue(MockNoteAPI);
vi.spyOn(apis, "SettingsAPI").mockReturnValue(MockSettingsAPI);
vi.spyOn(apis, "EmbedAPI").mockReturnValue(MockEmbedAPI);

vi.mock("@/api/browser/db-actions.browser.ts", ()=>({
  BrowserDBContext: vi.fn(),
}))

afterEach(() => {
  cleanup();
});