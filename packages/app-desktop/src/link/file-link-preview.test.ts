import { unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { previewFileLink } from "./file-link-preview";

const tmp = tmpdir();

const testFiles = {
  pdf: join(tmp, ".dwtest-preview.pdf"),
  word: join(tmp, ".dwtest-preview.docx"),
  excel: join(tmp, ".dwtest-preview.xlsx"),
};

describe("FileLinkPreviewer", () => {
  beforeAll(() => {
    for (const filePath of Object.values(testFiles)) {
      writeFileSync(filePath, "");
    }
  });

  afterAll(() => {
    for (const filePath of Object.values(testFiles)) {
      unlinkSync(filePath);
    }
  });

  it("should return correct mime type for PDF", async () => {
    const result = (await previewFileLink(testFiles.pdf))._unsafeUnwrap();
    expect(result.filePath).toBe(testFiles.pdf);
    expect(result.mimeType).toBe("application/pdf");
  });

  it("should return correct mime type for Word document", async () => {
    const result = (await previewFileLink(testFiles.word))._unsafeUnwrap();
    expect(result.filePath).toBe(testFiles.word);
    expect(result.mimeType).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
  });

  it("should return correct mime type for Excel spreadsheet", async () => {
    const result = (await previewFileLink(testFiles.excel))._unsafeUnwrap();
    expect(result.filePath).toBe(testFiles.excel);
    expect(result.mimeType).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  });

  it("should error for a non-existent file", async () => {
    const result = await previewFileLink(
      join(tmp, ".dwtest-preview-ghost.pdf"),
    );
    expect(result._unsafeUnwrapErr()).not.toBeUndefined();
  });
});
