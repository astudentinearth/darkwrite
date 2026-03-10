import { sanitizeQuotedCssValue } from "@darkwrite/common";
import embeddedStyle from "./embedded-style.css?raw";

export class EmbeddedStyleBuilder {
  private value: string = embeddedStyle;
  constructor() {}
  font(f: string) {
    const cleanFont = sanitizeQuotedCssValue(f);
    this.value = `${this.value}
      * {
        font-family: "${cleanFont}", sans-serif;
      }
      `;
    return this;
  }
  build() {
    return this.value;
  }
}
