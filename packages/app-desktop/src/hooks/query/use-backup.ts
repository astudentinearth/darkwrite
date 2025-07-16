import { BackupModel } from "@/lib/api/backup";
import { useMutation } from "@tanstack/react-query";

export const useBackup = () => {
  return useMutation({
    mutationKey: ["darkwrite-backup-mutation"],
    mutationFn: window.isElectron ? new BackupModel().backupData : async ()=>{},
  });
};

export const useRestore = () => {
  return useMutation({
    mutationKey: ["darkwrite-restore"],
    mutationFn: (path: string) => new BackupModel().restoreData(path),
  });
};
