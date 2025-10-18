import showdown from "showdown";
export const MarkdownConverter = {
  convertMarkdownToHTML: (markdown: string) => {
    const converter = new showdown.Converter(),
      html = converter.makeHtml(markdown);
    return html;
  },
};
