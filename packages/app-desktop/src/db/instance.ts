import { IDBPDatabase, openDB } from "idb";
import { IndexedDBSchema } from "./idb-schema";

export const DarkwriteDB: Promise<IDBPDatabase<IndexedDBSchema>> =
  openDB<IndexedDBSchema>("darkwrite-local", 1, {
    upgrade(database) {
      database.createObjectStore("workspace", {keyPath: "id"})
      database.createObjectStore("database", {keyPath: "id"});
      database.createObjectStore("note", { keyPath: "id" });
      database.createObjectStore("embed", { keyPath: "id" });
      database.createObjectStore("embed-file");
      database.createObjectStore("note-content");
    },
  });

export type DarkwriteDBType = typeof DarkwriteDB;