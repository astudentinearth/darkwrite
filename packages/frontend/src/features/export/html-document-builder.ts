import _ from "lodash";
import { fromUnicode } from "@/lib/utils";
import type { EditorContent } from "../editor/types";
import { EmbeddedStyleBuilder } from "./exported-note-style";
import { generateHTML, hydrateImages } from "./serializers";

export class HtmlDocumentBuilder {
  private content: EditorContent;
  private _title: string = "";
  private _icon: string = "";
  private _font: string = "";
  private _monospaceFont?: string = "";

  constructor(content: EditorContent) {
    this.content = structuredClone(content);
  }

  title(value: string | null | undefined) {
    this._title = _.escape(value ?? "");
    return this;
  }

  icon(value: string | null | undefined) {
    this._icon = _.escape(value ?? "");
    return this;
  }

  font(value: string) {
    this._font = value;
    return this;
  }

  monospaceFont(value: string | undefined) {
    this._monospaceFont = value;
    return this;
  }

  async embedImages() {
    this.content = (await hydrateImages(this.content)) ?? this.content;
    return this;
  }

  build() {
    const css = new EmbeddedStyleBuilder()
      .font(this._font, this._monospaceFont)
      .build();
    const html = `<!DOCTYPE html>
      <html>
        <head>
          <title>${this._title}</title>
          <meta charset="utf-8">
        </head>
      <body
      ><style>${css}</style>
      <main>${
        this._icon
          ? `<div style="font-size: 72px;margin-bottom: 24px;">${fromUnicode(this._icon)}</div>`
          : ""
      }${
        this._title ? `<h1>${this._title}</h1><hr></hr>` : ""
      }${generateHTML(this.content)}</main></body></html>`;
    return html;
  }
}
