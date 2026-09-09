import showdown from "showdown";
import { stringify } from "yaml";
import {
  type DateRange,
  deserializeRange,
  type NoteProperty,
  type NotePropertyMap,
  PropertyType,
} from "./note";

const convertMarkdownToHTML = (markdown: string) => {
  const converter = new showdown.Converter({}),
    html = converter.makeHtml(markdown);
  return html;
};

type YAMLExportValue = string | boolean;

const stringifyRange = (range: DateRange) => {
  if (!range.from) return "";
  if (!range.to || range.from.valueOf() === range.to?.valueOf())
    return range.from.toISOString();

  return `${range.from.toISOString()} / ${range.to.toISOString()}`;
};

const getYamlExportValue = (prop: NoteProperty): YAMLExportValue => {
  switch (prop.type) {
    case PropertyType.Text:
      return prop.value;
    case PropertyType.Date:
      return deserializeRange(prop.value).match(
        (range) => stringifyRange(range),
        () => prop.value,
      );
    case PropertyType.Checkbox:
      return prop.value;
  }
};

/**
 * Convert a note's properties into Markdown frontmatter, preserving order.
 * @param properties
 * @param order
 * @returns complete frontmatter wrapped in `---` delimiters, with all strings wrapped in double quotes.
 */
const propertiesToFrontmatter = (
  properties: NotePropertyMap,
  order: string[],
) => {
  const map = new Map<string, YAMLExportValue>();
  for (const name of order) {
    // order list has deleted entries
    if (!Object.hasOwn(properties, name)) continue;
    map.set(name, getYamlExportValue(properties[name]));
  }
  return `---\n${stringify(map, { defaultStringType: "QUOTE_DOUBLE" })}---\n`;
};

export const MarkdownConverter = {
  convertMarkdownToHTML,
  propertiesToFrontmatter,
};
