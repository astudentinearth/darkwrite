import type { PageSize, ThemeSettings } from "@darkwrite/common";
import { FontStyle } from "@darkwrite/common";
import { ResultAsync } from "neverthrow";
import { useMemo } from "react";
import { DarkwriteAPIClient } from "@/api/api-client";
import type { EditorContent } from "@/features/editor/types";
import { HtmlDocumentBuilder } from "@/features/export/html-document-builder";
import { resolveDocument, resolveNote } from "../note/store/fetcher";
import { selectNoteById } from "../note/store/note-selectors";
import { getSettingsActions } from "../settings/store/settings-actions";
import { useAppStore } from "../store/hooks";
import type { AppStore } from "../store/types";
import { showExportToast } from "./export-toast";
import { generateMarkdown } from "./serializers";

export async function documentBodyToHTML(
  content: EditorContent,
  font: string,
  title?: string,
  icon?: string | null,
  monospaceFont?: string,
) {
  const builder = await new HtmlDocumentBuilder(content).embedImages();
  return builder
    .font(font)
    .monospaceFont(monospaceFont)
    .title(title)
    .icon(icon)
    .build();
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

  function noteToHTML(id: string) {
    return ResultAsync.combine([resolveDocument(id), resolveNote(id, store)])
      .map(([doc, note]) => {
        const font = determineDocumentFont(
          getSettings().appearance.fonts,
          doc.customizations.font,
          doc.customizations.customFont,
        );
        return { doc, note, font };
      })
      .andThen(({ doc, note, font }) =>
        ResultAsync.fromSafePromise(
          documentBodyToHTML(
            doc.contents,
            font,
            note.title,
            note.icon,
            getSettings().appearance.fonts.code,
          ),
        ),
      );
  }

  function noteToJSON(id: string) {
    return resolveDocument(id).map(JSON.stringify);
  }

  function exportJSON(noteId: string) {
    return ResultAsync.combine([noteToJSON(noteId), resolveNote(noteId, store)])
      .andThen(([json, note]) =>
        DarkwriteAPIClient.note.export(json, "json", note.title),
      )
      .andTee(showExportToast);
  }

  function exportHTML(noteId: string) {
    return ResultAsync.combine([noteToHTML(noteId), resolveNote(noteId, store)])
      .andThen(([html, note]) =>
        DarkwriteAPIClient.note.export(html, "html", note.title),
      )
      .andTee(showExportToast);
  }

  function exportPDF(
    noteId: string,
    pageSize: PageSize = getSettings().editor.preferredPageSize,
  ) {
    return ResultAsync.combine([noteToHTML(noteId), resolveNote(noteId, store)])
      .andThen(([html, note]) =>
        DarkwriteAPIClient.note.exportPdf(html, note.title, pageSize),
      )
      .andTee(showExportToast);
  }

  const exportMarkdown = (noteId: string) =>
    resolveDocument(noteId)
      .andThen((content) =>
        DarkwriteAPIClient.note.export(
          generateMarkdown(content.contents),
          "md",
          selectNoteById(store.getState(), noteId)?.title,
        ),
      )
      .andTee(showExportToast);

  return {
    exportJSON,
    exportHTML,
    exportPDF,
    exportMarkdown,
  };
}

export function useNoteExport() {
  const store = useAppStore();
  const exporter = useMemo(() => getNoteExporter(store), [store]);
  return exporter;
}
