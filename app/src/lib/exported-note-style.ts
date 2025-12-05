import embeddedStyle from "./embedded-style.css?raw";

export function styleWithFont(font: string) {
  const sanitizedFont = font.replace(/"/g, '\\"');
  return `
  * {
    font-family: "${sanitizedFont}", sans-serif;
  }

  ${embeddedStyle}

  `.replace(/<\/style/gi, "<\\/style");
}
