import { FontStyle } from "@/common/note-customization";

import { DarkwriteAPIClient } from "@/api/api-client";
import { PageSize } from "@/common/pdf";
import { EditorContent } from "@/features/editor/types";
import { HtmlDocumentBuilder } from "@/features/export/html-document-builder";
import { useMemo } from "react";
import { resolveDocument, resolveNote } from "../note/store/fetcher";
import { useAppStore } from "../store/hooks";
import { getSettingsActions } from "../settings/store/settings-actions";
import { ThemeSettings } from "@/common/settings";
import { AppStore } from "../store/types";

export async function documentBodyToHTML(
  content: EditorContent,
  font: string,
  title?: string,
  icon?: string | null,
) {
  const builder = await new HtmlDocumentBuilder(content).embedImages();
  return builder.font(font).title(title).icon(icon).build();
}

export function getNoteExporter(store: AppStore) {
  const { getSettings } = getSettingsActions(store);

  function determineDocumentFont(
    fontSettings: ThemeSettings["fonts"],
    style: FontStyle = FontStyle.SANS,
    customFont?: string,
  ) {
    const map = {
      [FontStyle.SANS]: fontSettings.sans,
      [FontStyle.SERIF]: fontSettings.serif,
      [FontStyle.MONO]: fontSettings.code,
      [FontStyle.CUSTOM]: customFont || "",
    };
    return map[style] || fontSettings.sans;
  }

  async function noteToHTML(id: string) {
    const [doc, note] = await Promise.all([
      resolveDocument(id),
      resolveNote(id, store),
    ]);
    const font = determineDocumentFont(
      getSettings().appearance.fonts,
      doc.customizations.font,
      doc.customizations.customFont,
    );
    const html = await documentBodyToHTML(
      doc.contents,
      font,
      note.title,
      note.icon,
    );
    return html;
  }

  async function noteToJSON(id: string) {
    const doc = await resolveDocument(id);
    const jsonString = JSON.stringify(doc);
    return jsonString;
  }

  async function exportJSON(noteId: string) {
    const jsonString = await noteToJSON(noteId);
    const note = await resolveNote(noteId, store);
    await DarkwriteAPIClient.note.export(jsonString, "json", note?.title);
  }

  async function exportHTML(noteId: string) {
    const html = await noteToHTML(noteId);
    const note = await resolveNote(noteId, store);
    await DarkwriteAPIClient.note.export(html, "html", note?.title);
  }

  async function exportPDF(
    noteId: string,
    pageSize: PageSize = getSettings().editor.preferredPageSize,
  ) {
    const html = await noteToHTML(noteId);
    const note = await resolveNote(noteId, store);
    await DarkwriteAPIClient.note.exportPdf(html, note?.title, pageSize);
  }

  return {
    exportJSON,
    exportHTML,
    exportPDF,
  };
}

export function useNoteExport() {
  const store = useAppStore();
  const exporter = useMemo(() => getNoteExporter(store), [store]);
  return exporter;
}
