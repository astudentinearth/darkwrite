import { use, useMemo, useRef } from "react";
import { DarkwriteEditorContext } from "../context";
import {
  CodeBlockExtension,
  DefaultEditorExtensions,
  ImageExtension,
} from "../extensions";
import slashCommandExtension from "../extensions/slash-command/slash-command-extension";
import Bubble from "../extensions/bubble-menu";
import TableMenu from "../extensions/table/table-menu";
import { EventHelper } from "../components/event-helper";
import { FormattingHelper } from "../components/formatting-helper";
import { DragHandleExtension } from "../extensions/drag-handle";
import { Placeholder } from "@tiptap/extensions";
import { useTranslation } from "react-i18next";

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
