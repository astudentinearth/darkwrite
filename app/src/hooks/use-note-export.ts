import { DarkwriteAPIClient } from "@/api/api-client";
import { FontStyle } from "@/common/note-customization";
import {
  currentDocumentToSerializable,
  useEditorStore,
} from "@/context/editor-store";
import { generateHTML, hydrateImages } from "@/features/editor/html-export";
import { EditorContent } from "@/features/editor/types";
import { styleWithFont } from "@/lib/exported-note-style";
import { fromUnicode } from "@/lib/utils";
import { useNoteById } from "@/query/use-note-by-id";
import { useSettings } from "@/query/use-settings";
import _ from "lodash";

async function toHTML(
  content: EditorContent,
  css: string,
  title?: string,
  icon?: string | null,
) {
  const body = generateHTML(await hydrateImages(content));
  const sanitizedTitle = _.escape(title ?? "");
  const sanitizedIcon = _.escape(icon ?? "");
  const html = `<!DOCTYPE html><html><head><title>${sanitizedTitle}</title></head><body><style>${css.replace(/<\/style/gi, "<\\/style")}</style><main>${
    sanitizedIcon
      ? `<div style="font-size: 72px;margin-bottom: 24px;">${fromUnicode(sanitizedIcon)}</div>`
      : ""
  }${
    sanitizedTitle ? `<h1>${sanitizedTitle}</h1><hr></hr>` : ""
  }${body}</main></body></html>`;
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

  const serializeHtml = async () => {
    const result = await DarkwriteAPIClient.note.getDocument(noteId);
    const doc = result.document;
    const targetFont = getFont(
      doc.customizations.font,
      doc.customizations.customFont,
    );
    const css = styleWithFont(targetFont);
    const html = await toHTML(doc.contents, css, note?.title, note?.icon);
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
    const css = styleWithFont(targetFont);
    const html = await toHTML(doc.contents, css, note?.title, note?.icon);
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
    const css = styleWithFont(targetFont);
    const html = await toHTML(doc.contents, css, note?.title, note?.icon);
    await DarkwriteAPIClient.note.exportPdf(html, note?.title);
  };
  return { exportHTML, exportJSON, exportPdf };
}
