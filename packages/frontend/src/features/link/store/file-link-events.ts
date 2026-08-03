import type { AppStore } from "@/features/store/types";
import { upsertLinkedFiles } from "./file-link.slice";

/** Subscribes to file link creation events broadcast by the main process and
 * mirrors them into the in-memory store. This keeps the file link list in
 * sync across windows and for creations that happen outside of a thunk, such
 * as the editor drop handler. */
export function setupFileLinkEvents(store: AppStore) {
  if (window.events) {
    window.events.onFileLinkCreated((link) => {
      store.dispatch(upsertLinkedFiles([link]));
    });
  }
}
