import { DarkwriteAPIClient } from "@/api/api-client";
import { useLocalStore } from "@/context/local-state";
import { generateHTML } from "@/features/editor/html-export";
import { useState } from "react";

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
  const workspaceId = useLocalStore((s) => s.workspaceId);
  const [exporting, setExporting] = useState(false);
  const _export = () => {
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
