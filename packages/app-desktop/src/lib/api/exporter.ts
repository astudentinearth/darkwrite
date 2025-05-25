import { NoteAPI } from "@renderer/api";
import { generateHTML } from "@darkwrite/editor";
import { attempt } from "lodash";

export class ExporterModel {
  async exportAllAsHTML() {
    const API = window.api.exporter;
    const notesOpt = await NoteAPI().getNotes();
    if (!notesOpt || notesOpt.length == 0) return;
    const notes = notesOpt;
    await API.init();
    for (const note of notes) {
      console.log(`Exporting ${note.id}`);
      const contentsOpt = await NoteAPI().getContents(note.id);
      if (!contentsOpt) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let json: any;
      if (contentsOpt != "") {
        json = attempt(() => JSON.parse(contentsOpt));
      } else json = { contents: {}, customizations: {} };
      if (json instanceof Error) {
        console.error(json);
        continue;
      }
      console.error(json);
      if ("contents" in json) {
        if (!("content" in json.contents && "type" in json.contents)) {
          json.contents.content = [];
          json.contents.type = "doc";
        }
        const html = generateHTML(json.contents);
        await API.push(`${note.title}-${note.id}.html`, html);
      }
    }
    await API.finish();
  }
}
