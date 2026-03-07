import { use, useMemo } from "react";
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

export default function useEditorBuilder() {
  const { imageUploadConfig, codeBlockIndentSize, commandItems } = use(
    DarkwriteEditorContext,
  );
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
    ],
    [codeBlockIndentSize, imageUploadConfig, commandItems],
  );

  const children = useMemo(
    () => (
      <>
        <EventHelper />
        <Bubble />
        <TableMenu />
      </>
    ),
    [],
  );

  return { extensions, children };
}
