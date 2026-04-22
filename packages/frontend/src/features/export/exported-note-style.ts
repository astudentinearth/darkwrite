import { sanitizeQuotedCssValue } from "@darkwrite/common";
import embeddedStyle from "./embedded-style.css?raw";

export class EmbeddedStyleBuilder {
  private value: string = embeddedStyle;
  constructor() {}
  font(f: string, monospaceFont?: string) {
    const cleanFont = sanitizeQuotedCssValue(f);
    const cleanMonospaceFont = sanitizeQuotedCssValue(
      monospaceFont || "Jetbrains Mono",
    );
    this.value = `${this.value}
      * {
        font-family: "${cleanFont}", sans-serif;
        --monospace: "${cleanMonospaceFont}", monospace;
      }
      `;
    return this;
  }
  build() {
    return this.value;
  }
}
