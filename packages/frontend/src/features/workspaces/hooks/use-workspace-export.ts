import { DarkwriteAPIClient } from "@/api/api-client";
import { generateHTML } from "@/features/editor/html-export";
import { useState } from "react";
import { useCurrentWorkspaceId } from "./use-workspace";

async function exportWorkspace(workspaceId: string, _generator = generateHTML) {
  await DarkwriteAPIClient.backup.initCache();
  const { notes } =
    await DarkwriteAPIClient.note.getAllByWorkspaceId(workspaceId);
  for (const noteId in notes) {
    try {
      const { document } = await DarkwriteAPIClient.note.getDocument(noteId);
      const html = _generator(document.contents);
      await DarkwriteAPIClient.backup.pushFile(`${noteId}.html`, html);
    } catch {
      continue;
    }
  }
  await DarkwriteAPIClient.backup.finishExport();
}

export function useWorkspaceExport() {
  const workspaceId = useCurrentWorkspaceId();
  const [exporting, setExporting] = useState(false);
  const _export = () => {
    if (!workspaceId) return;
    setExporting(true);
    exportWorkspace(workspaceId).finally(() => {
      setExporting(false);
    });
  };
  return {
    export: _export,
    exporting,
  };
}
