import { useState } from "react";
import { DarkwriteAPIClient } from "@/api/api-client";

export default function useBackup() {
  const [isWorking, setIsWorking] = useState(false);

  const startBackup = () => {
    setIsWorking(true);
    DarkwriteAPIClient.backup.performBackup().then(() => setIsWorking(false));
  };

  return {
    startBackup,
    isWorking,
  };
}
