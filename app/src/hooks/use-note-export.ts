import { DarkwriteAPIClient } from "@/api/api-client";
import { FontStyle } from "@/common/note-customization";
import {
  currentDocumentToSerializable,
  useEditorStore,
} from "@/context/editor-store";
import { EditorContent } from "@/features/editor/types";
import { HtmlDocumentBuilder } from "@/features/export/html-document-builder";
import { useNoteById } from "@/query/use-note-by-id";
import { useSettings } from "@/query/use-settings";

async function toHTML(
  content: EditorContent,
  font: string,
  title?: string,
  icon?: string | null,
) {
  const builder = await new HtmlDocumentBuilder(content).embedImages();
  return builder.font(font).title(title).icon(icon).build();
}

function useFontFromDocument() {
  const settings = useSettings().data;
  const getFont = (style: FontStyle = FontStyle.SANS, customFont?: string) => {
    const fonts = settings.appearance.fonts;
    let targetFont = "";
    switch (style) {
      case FontStyle.SANS:
        targetFont = fonts.sans;
        break;
      case FontStyle.SERIF:
        targetFont = fonts.serif;
        break;
      case FontStyle.MONO:
        targetFont = fonts.code;
        break;
      case FontStyle.CUSTOM:
        targetFont = customFont || "";
        break;
    }
    return targetFont;
  };
  return { getFont };
}

export function usePersistedNoteExport(noteId: string) {
  const { getFont } = useFontFromDocument();
  const { note } = useNoteById(noteId);

  const serializeHtml = async () => {
    const result = await DarkwriteAPIClient.note.getDocument(noteId);
    const doc = result.document;
    const targetFont = getFont(
      doc.customizations.font,
      doc.customizations.customFont,
    );
    const html = await toHTML(
      doc.contents,
      targetFont,
      note?.title,
      note?.icon,
    );
    return html;
  };

  const exportHTML = async () => {
    const html = await serializeHtml();
    await DarkwriteAPIClient.note.export(html, "html", note?.title);
  };

  const exportJSON = async () => {
    const result = await DarkwriteAPIClient.note.getDocument(noteId);
    const doc = result.document;
    const jsonString = JSON.stringify(doc);
    await DarkwriteAPIClient.note.export(jsonString, "json", note?.title);
  };

  const exportPdf = async () => {
    const html = await serializeHtml();
    await DarkwriteAPIClient.note.exportPdf(html, note?.title);
  };

  return { exportHTML, exportJSON, exportPdf };
}

export default function useNoteExport() {
  const noteId = useEditorStore((s) => s.noteId);
  const { note } = useNoteById(noteId);
  const { getFont } = useFontFromDocument();

  const exportHTML = async () => {
    const doc = currentDocumentToSerializable();
    const targetFont = getFont(
      doc.customizations.font,
      doc.customizations.customFont,
    );
    const html = await toHTML(
      doc.contents,
      targetFont,
      note?.title,
      note?.icon,
    );
    await DarkwriteAPIClient.note.export(html, "html", note?.title);
  };

  const exportJSON = async () => {
    const doc = currentDocumentToSerializable();
    const jsonString = JSON.stringify(doc);
    await DarkwriteAPIClient.note.export(jsonString, "json", note?.title);
  };

  const exportPdf = async () => {
    const doc = currentDocumentToSerializable();
    const targetFont = getFont(
      doc.customizations.font,
      doc.customizations.customFont,
    );
    const html = await toHTML(
      doc.contents,
      targetFont,
      note?.title,
      note?.icon,
    );
    await DarkwriteAPIClient.note.exportPdf(html, note?.title);
  };
  return { exportHTML, exportJSON, exportPdf };
}
