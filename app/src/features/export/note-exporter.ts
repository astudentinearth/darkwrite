import { FontStyle } from "@/common/note-customization";

import { EditorContent } from "@/features/editor/types";
import { HtmlDocumentBuilder } from "@/features/export/html-document-builder";
import { getSettings } from "@/features/settings/store/settings-actions";
import { resolveDocument, resolveNote } from "../note/store/fetcher";
import { DarkwriteAPIClient } from "@/api/api-client";
import { PageSize } from "@/common/pdf";

export async function documentBodyToHTML(
  content: EditorContent,
  font: string,
  title?: string,
  icon?: string | null,
) {
  const builder = await new HtmlDocumentBuilder(content).embedImages();
  return builder.font(font).title(title).icon(icon).build();
}

export function determineDocumentFont(
  style: FontStyle = FontStyle.SANS,
  customFont?: string,
) {
  const fonts = getSettings().appearance.fonts;
  const map = {
    [FontStyle.SANS]: fonts.sans,
    [FontStyle.SERIF]: fonts.serif,
    [FontStyle.MONO]: fonts.code,
    [FontStyle.CUSTOM]: customFont || "",
  };
  return map[style] || fonts.sans;
}

export async function noteToHTML(id: string) {
  const [doc, note] = await Promise.all([resolveDocument(id), resolveNote(id)]);
  const font = determineDocumentFont(
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

export async function noteToJSON(id: string) {
  const doc = await resolveDocument(id);
  const jsonString = JSON.stringify(doc);
  return jsonString;
}

async function exportJSON(noteId: string) {
  const jsonString = await noteToJSON(noteId);
  const note = await resolveNote(noteId);
  await DarkwriteAPIClient.note.export(jsonString, "json", note?.title);
}

async function exportHTML(noteId: string) {
  const html = await noteToHTML(noteId);
  const note = await resolveNote(noteId);
  await DarkwriteAPIClient.note.export(html, "html", note?.title);
}

async function exportPDF(
  noteId: string,
  pageSize: PageSize = getSettings().editor.preferredPageSize,
) {
  const html = await noteToHTML(noteId);
  const note = await resolveNote(noteId);
  await DarkwriteAPIClient.note.exportPdf(html, note?.title, pageSize);
}

export const NoteExporter = {
  exportHTML,
  exportJSON,
  exportPDF,
};
