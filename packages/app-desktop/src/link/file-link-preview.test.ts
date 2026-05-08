import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFileSync, unlinkSync } from "node:fs";
import { FileLinkPreviewer } from "./file-link-preview";
import { FileNotFoundError } from "@/lib/fs";

const tmp = tmpdir();

const testFiles = {
  pdf: join(tmp, ".dwtest-preview.pdf"),
  word: join(tmp, ".dwtest-preview.docx"),
  excel: join(tmp, ".dwtest-preview.xlsx"),
};

let previewer: FileLinkPreviewer;

describe("FileLinkPreviewer", () => {
  beforeAll(() => {
    for (const filePath of Object.values(testFiles)) {
      writeFileSync(filePath, "");
    }
    previewer = new FileLinkPreviewer();
  });

  afterAll(() => {
    for (const filePath of Object.values(testFiles)) {
      unlinkSync(filePath);
    }
  });

  it("should return correct mime type for PDF", async () => {
    const result = await previewer.previewFileLink(testFiles.pdf);
    expect(result.filePath).toBe(testFiles.pdf);
    expect(result.mimeType).toBe("application/pdf");
  });

  it("should return correct mime type for Word document", async () => {
    const result = await previewer.previewFileLink(testFiles.word);
    expect(result.filePath).toBe(testFiles.word);
    expect(result.mimeType).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
  });

  it("should return correct mime type for Excel spreadsheet", async () => {
    const result = await previewer.previewFileLink(testFiles.excel);
    expect(result.filePath).toBe(testFiles.excel);
    expect(result.mimeType).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  });

  it("should throw FileNotFoundError for a non-existent file", async () => {
    await expect(
      previewer.previewFileLink(join(tmp, ".dwtest-preview-ghost.pdf")),
    ).rejects.toThrow(FileNotFoundError);
  });
});
