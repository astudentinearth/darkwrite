import { DarkwriteAPIClient } from "@/api/api-client";
import showUpdateToast from "@/features/notifications/update";
import type { AppDispatch } from "@/features/store/types";
import { clientSlice } from "./client-slice";

const act = clientSlice.actions;

export const loadClientInfo = () => (dispatch: AppDispatch) =>
  DarkwriteAPIClient.desktop
    .getClientInfo()
    .andTee((info) => dispatch(act.setClientInfo(info)));

/** Checks GitHub for a newer release. When `notify` is set and an update is
 * available, the toast is deferred to the next animation frame so the
 * `<Toaster/>` (mounted inside Layout) is rendered before it fires. */
export const checkForUpdate =
  (opts?: { notify?: boolean }) => (dispatch: AppDispatch) => {
    dispatch(act.setUpdateStatus("loading"));
    return DarkwriteAPIClient.checkUpdate()
      .andTee((data) => {
        dispatch(act.setUpdate({ data, status: "idle" }));
        if (opts?.notify && data?.updateAvailable) {
          requestAnimationFrame(() =>
            showUpdateToast(data.latest, data.release_page),
          );
        }
      })
      .orTee(() => dispatch(act.setUpdateStatus("error")));
  };
