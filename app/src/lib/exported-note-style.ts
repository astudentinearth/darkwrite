export function styleWithFont(font: string) {
  const sanitizedFont = font.replace(/"/g, '\\"');
  return `
  :root {
    --editor-text-red: hsl(1 100% 66%);
    --editor-text-orange: hsl(26 97% 61%);
    --editor-text-yellow: hsl(54 100% 66%);
    --editor-text-green: hsl(119 100% 66%);
    --editor-text-cyan: hsl(166 100% 66%);
    --editor-text-blue: hsl(202 97% 61%);
    --editor-text-indigo: hsl(251 100% 60%);
    --editor-text-purple: hsl(280 100% 60%);
    --editor-text-pink: hsl(305 100% 60%);
    --editor-highlight-red: hsl(1 100% 66% / 0.4);
    --editor-highlight-orange: hsl(26 97% 61% / 0.4);
    --editor-highlight-yellow: hsl(54 100% 66% / 0.4);
    --editor-highlight-green: hsl(119 100% 66% / 0.4);
    --editor-highlight-cyan: hsl(166 100% 66% / 0.4);
    --editor-highlight-blue: hsl(202 97% 61% / 0.4);
    --editor-highlight-indigo: hsl(251 100% 60% / 0.4);
    --editor-highlight-purple: hsl(280 100% 60% / 0.4);
    --editor-highlight-pink: hsl(305 100% 60% / 0.4);
  }

  * {
    font-family: "${sanitizedFont}", sans-serif;
  }

  h1, h2, h3, h4 {
    margin: 0 0.75rem 0 0;
  }

  h1, h2, h3 {
    font-weight: 700;
  }

  h1 {
    font-size: 1.875rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.125rem;
  }

  h4 {
    font-size: 1.125rem;
    font-weight: 600;
  }

  hr {
    margin-bottom: 0.5rem;
    opacity: 0.3;
  }

  body {
    margin: 4rem;
    background: hsl(0 0% 5%);
    color: #ffffff;
  }

  main {
    max-width: 800px;
    margin: auto;
  }

  pre, code {
    font-family: "JetBrains Mono", monospace;
  }

  @media print {
    body {
      background-color: white !important;
      color: black;
      margin: 0;
    }
  }
  `.replace(/<\/style/gi, "<\\/style");
}
