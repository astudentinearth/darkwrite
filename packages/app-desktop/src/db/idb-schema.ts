
import { Database, Embed, Note, Workspace } from "@darkwrite/common/models";
import { DBSchema } from "idb";

export interface IndexedDBSchema extends DBSchema {
  workspace: {
    key: string;
    value: Workspace;
  };
  database: {
    key: string;
    value: Database;
  };
  note: {
    key: string;
    value: Note;
    indexes: {
      workspaceId: string;
    }
  };
  embed: {
    key: string;
    value: Embed;
  };
  "embed-file": {
    key: string;
    value: Blob;
  };
  "note-content": {
    key: string;
    value: string;
  };
}


