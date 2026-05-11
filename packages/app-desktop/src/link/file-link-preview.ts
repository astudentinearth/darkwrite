import { assertExists } from "@/lib/fs";
import mime from "mime";

export function previewFileLink(filePath: string) {
  return assertExists(filePath).map(() => ({
    mimeType: mime.getType(filePath) ?? undefined,
    filePath,
  }));
}
