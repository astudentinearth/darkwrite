import { Placeholder } from "@tiptap/extensions";
import { use, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { EventHelper } from "../components/event-helper";
import { FormattingHelper } from "../components/formatting-helper";
import { DarkwriteEditorContext } from "../context";
import {
  CodeBlockExtension,
  DefaultEditorExtensions,
  ImageExtension,
} from "../extensions";
import Bubble from "../extensions/bubble-menu";
import { DragHandleExtension } from "../extensions/drag-handle";
import slashCommandExtension from "../extensions/slash-command/slash-command-extension";
import TableMenu from "../extensions/table/table-menu";

export default function useEditorBuilder() {
  const { imageUploadConfig, codeBlockIndentSize, commandItems } = use(
    DarkwriteEditorContext,
  );
  const { t } = useTranslation();
  const isDragging = useRef(false);

  const placeholder = Placeholder.configure({
    includeChildren: true,
    placeholder: () => t("editor.placeholder"),
    showOnlyCurrent: true,
  });

  const extensions = useMemo(
    () => [
      ...DefaultEditorExtensions,
      ImageExtension(imageUploadConfig),
      CodeBlockExtension(() => codeBlockIndentSize),
      slashCommandExtension.configure({
        suggestion: {
          items: () => commandItems,
        },
      }),
      placeholder,
    ],
    [imageUploadConfig, placeholder, codeBlockIndentSize, commandItems],
  );

  const children = useMemo(
    () => (
      <>
        <EventHelper />
        <FormattingHelper />
        <Bubble isDragging={isDragging} />
        <DragHandleExtension isDragging={isDragging} />
        <TableMenu />
      </>
    ),
    [],
  );

  return { extensions, children };
}
