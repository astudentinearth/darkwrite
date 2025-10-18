import { DarkwriteAPIClient } from "@/api/api-client";
import { FontStyle } from "@/common/note-customization";
import {
  currentDocumentToSerializable,
  useEditorStore,
} from "@/context/editor-store";
import { generateHTML } from "@/features/editor/html-export";
import { EditorContent } from "@/features/editor/types";
import { styleWithFont } from "@/lib/exported-note-style";
import { useNoteById } from "@/query/use-note-by-id";
import { useSettings } from "@/query/use-settings";

function toHTML(content: EditorContent, css: string) {
  const body = generateHTML(content);
  const html = `<!DOCTYPE html><html><body><style>${css}</style><main>${body}</main></body></html>`;
  return html;
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

  const exportHTML = async () => {
    const result = await DarkwriteAPIClient.note.getDocument(noteId);
    const doc = result.document;
    const targetFont = getFont(
      doc.customizations.font,
      doc.customizations.customFont,
    );
    const css = styleWithFont(targetFont);
    const html = toHTML(doc.contents, css);
    await DarkwriteAPIClient.note.export(html, "html", note?.title);
  };

  const exportJSON = async () => {
    const result = await DarkwriteAPIClient.note.getDocument(noteId);
    const doc = result.document;
    const jsonString = JSON.stringify(doc);
    await DarkwriteAPIClient.note.export(jsonString, "json", note?.title);
  };

  return { exportHTML, exportJSON };
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
    const css = styleWithFont(targetFont);
    const html = toHTML(doc.contents, css);
    await DarkwriteAPIClient.note.export(html, "html", note?.title);
  };

  const exportJSON = async () => {
    const doc = currentDocumentToSerializable();
    const jsonString = JSON.stringify(doc);
    await DarkwriteAPIClient.note.export(jsonString, "json", note?.title);
  };

  return { exportHTML, exportJSON };
}
