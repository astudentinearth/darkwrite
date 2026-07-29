import { DarkwriteAPIClient } from "@/api/api-client";
import type { AppDispatch } from "@/features/store/types";
import { fileLinkSlice } from "./file-link.slice";

export const loadFileLinks = () => (dispatch: AppDispatch) =>
  DarkwriteAPIClient.fileLink
    .getAll()
    .andTee((links) =>
      dispatch(fileLinkSlice.actions.setAllLinkedFiles(links)),
    );

// Creations flow into the store via the main process broadcast
// (see setupFileLinkEvents), so these thunks only surface the result to the
// caller and do not upsert into the store themselves.
export const pickAndCreateFileLink = () => () =>
  DarkwriteAPIClient.fileLink.pickAndCreate();

export const createFileLinkFromPath = (path: string) => () =>
  DarkwriteAPIClient.fileLink.createFromPath(path);
