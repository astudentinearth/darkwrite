import { ExporterModel } from "@/lib/api/exporter";
import { useMutation } from "@tanstack/react-query";

export const useWorkspaceExport = () => {
  return useMutation({
    mutationKey: ["workspace-export"],
    mutationFn: new ExporterModel().exportAllAsHTML,
  });
};
