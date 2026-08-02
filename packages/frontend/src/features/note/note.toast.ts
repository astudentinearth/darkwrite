import { t } from "i18next";
import notify from "../notifications/notify";

export const moveSuccessToast = () =>
  notify.success(t("toast.movePage.success"));
export const moveFailToast = () => notify.error(t("toast.movePage.error"));

export const clearTrashSuccessToast = () =>
  notify.success(t("toast.clearTrash.success"));
export const clearTrashFailToast = () =>
  notify.error(t("toast.clearTrash.error"));

export const trashSuccessToast = () =>
  notify.success(t("toast.trashPage.success"));
export const trashFailToast = () => notify.error(t("toast.trashPage.error"));

export const restoreSuccessToast = () =>
  notify.success(t("toast.restorePage.success"));
export const restoreFailToast = () =>
  notify.error(t("toast.restorePage.error"));
