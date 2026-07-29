export * from "./request/note.request";
export type FileImportResult = {
  /** Type of `content` field */
  type: "json" | "text" | "html";
  /** Contents to be imported */
  content: string;
};
