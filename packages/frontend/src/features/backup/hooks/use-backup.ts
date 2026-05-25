import { DarkwriteAPIClient } from "@/api/api-client";
import { useState } from "react";

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
