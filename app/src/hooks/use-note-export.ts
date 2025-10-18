import {
  currentDocumentToSerializable,
  useEditorStore,
} from "@/context/editor-store";
import { useNoteById } from "@/query/use-note-by-id";
import { useNotes } from "@/query/use-notes";
import { generateHTML } from "@/features/editor/html-export";
import { DarkwriteAPIClient } from "@/api/api-client";
import { useSettings } from "@/query/use-settings";
import { FontStyle } from "@/common/note-customization";
import { styleWithFont } from "@/lib/exported-note-style";
import { useThemes } from "@/query/use-themes";

export default function useNoteExport() {
  const noteId = useEditorStore((s) => s.noteId);
  const { note } = useNoteById(noteId);
  const settings = useSettings().data;

  const exportHTML = async () => {
    const doc = currentDocumentToSerializable();

    const fonts = settings.appearance.fonts;
    let targetFont = "";
    switch (doc.customizations.font) {
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
        targetFont = doc.customizations.customFont || "";
        break;
    }

    const css = styleWithFont(targetFont);

    const body = generateHTML(doc.contents);

    const html = `
        <!DOCTYPE html>
        <html>
          <body>
            <style>
              ${css}
            </style>
            <main>
            ${body}
            </main>
          </body>
        </html>
      `;
    await DarkwriteAPIClient.note.export(html, "html", note?.title);
  };

  const exportJSON = async () => {
    const doc = currentDocumentToSerializable();
    const jsonString = JSON.stringify(doc);
    await DarkwriteAPIClient.note.export(jsonString, "json", note?.title);
  };

  return { exportHTML, exportJSON };
}
