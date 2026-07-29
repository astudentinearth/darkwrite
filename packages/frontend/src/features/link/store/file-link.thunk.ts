import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import type { AppDispatch } from "@/features/store/types";
import { fileLinkSlice, upsertLinkedFiles } from "./file-link.slice";

export const loadFileLinks = () => (dispatch: AppDispatch) =>
  DarkwriteAPIClient.fileLink
    .getAll()
    .andTee((links) =>
      dispatch(fileLinkSlice.actions.setAllLinkedFiles(links)),
    );

export const pickAndCreateFileLink = () => (dispatch: AppDispatch) =>
  DarkwriteAPIClient.fileLink.pickAndCreate().andThen((link) => {
    // null means the action was cancelled, we can ignore it
    if (link) dispatch(upsertLinkedFiles([link]));
    return okAsync(link);
  });

export const createFileLinkFromPath =
  (path: string) => (dispatch: AppDispatch) =>
    DarkwriteAPIClient.fileLink.createFromPath(path).andThen((link) => {
      dispatch(upsertLinkedFiles([link]));
      return okAsync(link);
    });
