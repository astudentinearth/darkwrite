import { parse as parseYaml } from "yaml";
import { MarkdownConverter } from "./markdown";
import {
  NoteProperty,
  PropertyType,
  serializeRange,
  TextProperty,
} from "./note";

it("converts markdown to html", () => {
  const markdown = "# Hello";
  const html = MarkdownConverter.convertMarkdownToHTML(markdown);
  expect(html).toBe('<h1 id="hello">Hello</h1>');
});

describe("properties to markdown", () => {
  const isFrontmatter = (str: string) =>
    str.startsWith("---\n") && str.endsWith("---\n");

  const parseBack = (frontmatter: string) =>
    parseYaml(frontmatter.substring(3, frontmatter.length - 4));

  it.each([
    {
      property: {
        type: PropertyType.Text,
        value: "Darkwrite",
      } satisfies NoteProperty,
      yamlValue: "Darkwrite",
    },
    {
      property: {
        type: PropertyType.Checkbox,
        value: false,
      } satisfies NoteProperty,
      yamlValue: false,
    },
    {
      property: {
        type: PropertyType.Checkbox,
        value: true,
      } satisfies NoteProperty,
      yamlValue: true,
    },
    {
      property: {
        type: PropertyType.Date,
        value: serializeRange({
          from: new Date("2026-09-06"),
          to: new Date("2026-09-07"),
        }),
      } satisfies NoteProperty,
      yamlValue: `${new Date("2026-09-06").toISOString()} / ${new Date("2026-09-07").toISOString()}`,
    },
    {
      property: {
        type: PropertyType.Date,
        value: serializeRange({
          from: new Date("2026-09-06"),
          to: new Date("2026-09-06"),
        }),
      } satisfies NoteProperty,
      yamlValue: `${new Date("2026-09-06").toISOString()}`,
    },
    {
      property: {
        type: PropertyType.Date,
        value: serializeRange({
          from: new Date("2026-09-06"),
        }),
      } satisfies NoteProperty,
      yamlValue: `${new Date("2026-09-06").toISOString()}`,
    },
  ])("exports $property.type frontmatter", ({ property, yamlValue }) => {
    const frontmatter = MarkdownConverter.propertiesToFrontmatter(
        { Property: property },
        ["Property"],
      ),
      parsedYaml = parseBack(frontmatter);

    expect(isFrontmatter(frontmatter)).toBe(true);
    expect(parsedYaml).toEqual({ Property: yamlValue });
  });

  it("preserves order of properties", () => {
    const properties = {
        a: NoteProperty.default(PropertyType.Text),
        b: NoteProperty.default(PropertyType.Text),
        c: NoteProperty.default(PropertyType.Text),
      },
      order = ["b", "c", "a"],
      frontmatter = MarkdownConverter.propertiesToFrontmatter(
        properties,
        order,
      );

    expect(isFrontmatter(frontmatter)).toBe(true);

    const lines = frontmatter.split("\n");
    expect(lines[1].startsWith(`"b"`)).toBe(true);
    expect(lines[2].startsWith(`"c"`)).toBe(true);
    expect(lines[3].startsWith(`"a"`)).toBe(true);
  });
});
