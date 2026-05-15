import { DocumentStoreErr, IDocumentStore } from "@/lib/document-store";
import { errAsync, okAsync } from "neverthrow";

export function MockDocumentStore(): IDocumentStore {
  const docs: Map<string, string> = new Map();
  function create(noteId: string) {
    docs.set(noteId, "");
    return okAsync();
  }

  function exists(noteId: string) {
    return okAsync(docs.has(noteId));
  }

  function read(noteId: string) {
    return docs.has(noteId)
      ? okAsync(docs.get(noteId) ?? "")
      : errAsync({
          type: "document-not-found",
          id: noteId,
        } satisfies DocumentStoreErr);
  }

  function write(noteId: string, content: string) {
    docs.set(noteId, content);
    return okAsync();
  }

  function ls() {
    return okAsync(Array.from(docs.keys()));
  }

  function del(key: string) {
    docs.delete(key);
    return okAsync();
  }

  return {
    create,
    exists,
    read,
    write,
    ls,
    delete: del,
  };
}
