import { ResultAsync } from "neverthrow";
import { useState } from "react";
import { DarkwriteAPIClient } from "@/api/api-client";
import { generateHTML } from "@/features/editor/html-export";
import { useCurrentWorkspaceId } from "./use-workspace";

function exportWorkspace(workspaceId: string, _generator = generateHTML) {
  return DarkwriteAPIClient.backup
    .initCache()
    .andThen(() =>
      DarkwriteAPIClient.note
        .getAllByWorkspaceId(workspaceId)
        .map((r) => r.notes),
    )
    .andThen((notes) =>
      ResultAsync.combine(
        Object.keys(notes).map((id) =>
          DarkwriteAPIClient.note.getDocument(id).map((doc) => ({ id, doc })),
        ),
      ),
    )
    .map((docs) =>
      docs.map((d) => ({
        id: d.id,
        html: _generator(d.doc.document.contents),
      })),
    )
    .andThen((files) =>
      ResultAsync.combine(
        files.map((f) =>
          DarkwriteAPIClient.backup.pushFile(`${f.id}.html`, f.html),
        ),
      ),
    )
    .andThen(DarkwriteAPIClient.backup.finishExport);
}

export function useWorkspaceExport() {
  const workspaceId = useCurrentWorkspaceId();
  const [exporting, setExporting] = useState(false);
  const _export = () => {
    if (!workspaceId) return;
    setExporting(true);
    exportWorkspace(workspaceId).then(() => {
      setExporting(false);
    });
  };
  return {
    export: _export,
    exporting,
  };
}
