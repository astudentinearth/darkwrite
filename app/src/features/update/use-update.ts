import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import showUpdateToast from "../notifications/update";

export const useUpdate = () => {
  const [notified, setNotified] = useState(true);
  const updateQuery = useQuery({
    queryKey: ["update"],
    queryFn: async () => {
      if (!window.isElectron) return undefined;
      const result = await window.api.checkUpdate();
      setNotified(false);
      return result;
    },
    enabled: false,
  });

  useEffect(() => {
    if (updateQuery.isFetching) return;
    if (notified) return;
    if (!updateQuery.data) return;
    if (!updateQuery.data.updateAvailable) return;
    showUpdateToast(updateQuery.data.latest, updateQuery.data.release_page);
    setNotified(true);
  }, [updateQuery.data, notified, updateQuery.isFetching]);

  return updateQuery;
};
