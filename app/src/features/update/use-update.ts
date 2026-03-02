import { useEffect, useState } from "react";
import showUpdateToast from "../notifications/update";
import { useLazyCheckUpdateQuery } from "./store/update-api";

export const useUpdate = () => {
  const [notified, setNotified] = useState(false);
  const [checkUpdate, {isFetching, isLoading, isError, data} ] = useLazyCheckUpdateQuery();

  useEffect(() => {
    if (isFetching) return;
    if (notified) return;
    if (!data) return;
    if (!data.updateAvailable) return;
    showUpdateToast(data.latest, data.release_page);
    setNotified(true);
  }, [data, notified, isFetching]);

  return {data, isError, isLoading, isFetching, refetch: checkUpdate};
};
