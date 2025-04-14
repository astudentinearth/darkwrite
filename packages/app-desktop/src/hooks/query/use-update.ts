import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "../use-toast";

export const useUpdate = () => {
  const [notified, setNotified] = useState(true);
  const toaster = useToast();
  const updateQuery = useQuery({
    queryKey: ["update"],
    queryFn: async () => {
      if (!window.isElectron) return false;
      const result = await window.api.settings.checkUpdate();
      setNotified(false);
      return result;
    },
    enabled: false,
  });

  useEffect(() => {
    if(updateQuery.isFetching) return;
    if (notified) return;
    if (!updateQuery.data) return;
    if (!updateQuery.data.updateAvailable) {
      toaster.showNoUpdateNotification();
      return;
    }
    toaster.showUpdateNotification(
      updateQuery.data.latest,
      updateQuery.data.release_page,
    );
    setNotified(true);
  }, [updateQuery.data, notified, updateQuery.isFetching]);

  return updateQuery;
};
