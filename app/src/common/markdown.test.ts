import { MarkdownConverter } from "./markdown";

it("converts markdown to html", () => {
  const markdown = "# Hello";
  const html = MarkdownConverter.convertMarkdownToHTML(markdown);
  expect(html).toBe('<h1 id="hello">Hello</h1>');
});
