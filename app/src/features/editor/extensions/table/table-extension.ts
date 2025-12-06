import { mergeAttributes } from "@tiptap/core";
import {
  Table as TiptapTable,
  TableCell as TiptapTableCell,
  TableHeader as TiptapTableHeader,
  TableRow as TiptapTableRow,
} from "@tiptap/extension-table";

export const Table = TiptapTable.configure({
  resizable: true,
  allowTableNodeSelection: true,
});

export const TableCell = TiptapTableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      background: {
        default: null,
        isRequired: false,
        parseHTML: (element) => element.getAttribute("data-bg"),
        renderHTML: (attrs) => {
          if (!attrs.background) return attrs;
          return mergeAttributes(attrs, {
            style: `--td-bg: ${attrs.background};`,
          });
        },
      },
    };
  },
});

export const TableHeader = TiptapTableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      background: {
        default: null,
        isRequired: false,
        parseHTML: (element) => element.getAttribute("data-bg"),
        renderHTML: (attrs) => {
          if (!attrs.background) return attrs;
          return mergeAttributes(attrs, {
            style: `--th-bg: ${attrs.background};`,
          });
        },
      },
    };
  },
});

export const TableRow = TiptapTableRow.configure({});

const TableExtensions = [Table, TableRow, TableHeader, TableCell];

export default TableExtensions;
