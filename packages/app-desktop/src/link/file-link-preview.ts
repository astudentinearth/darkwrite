import mime from "mime";
import { assertExists } from "@/lib/fs";

export function previewFileLink(filePath: string) {
  return assertExists(filePath).map(() => ({
    mimeType: mime.getType(filePath) ?? undefined,
    filePath,
  }));
}
