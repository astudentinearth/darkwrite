import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import { FileLinkAttributesType } from "./file-link-extension";
import { cn } from "@/lib/utils";
import { useFileLink } from "./use-file-link";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui";
import { useTranslation } from "react-i18next";
import { use, useState, MouseEvent } from "react";
import { DarkwriteAPIClient } from "@/api/api-client";
import { FileIcon } from "@/components/file-icon";
import { DarkwriteEditorContext } from "../context";

const filename = (fullPath: string) => {
  const parts = fullPath.split(/[/\\]/);
  return parts[parts.length - 1];
};

export function FileLinkNode(props: ReactNodeViewProps) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const { linkId } = props.node.attrs as FileLinkAttributesType;
  const { fileLink } = useFileLink(linkId);
  const { t } = useTranslation();
  const { openFilesOnDoubleClick } = use(DarkwriteEditorContext);

  const openFile = () => {
    if (!fileLink) return;
    DarkwriteAPIClient.fileLink.openById(fileLink.id);
  };

  const changeFile = async () => {
    const newLink = await DarkwriteAPIClient.fileLink.pickAndCreate();
    if (!newLink) return;
    const { id } = newLink;
    props.updateAttributes({ linkId: id });
  };

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileLink) changeFile();
    else if (!openFilesOnDoubleClick) openFile();
  };

  const handleDoubleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (openFilesOnDoubleClick && fileLink) openFile();
  };

  return (
    <NodeViewWrapper>
      <ContextMenu onOpenChange={setContextMenuOpen}>
        <ContextMenuTrigger asChild>
          <div
            tabIndex={0}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            className={cn(
              "bg-transparent hover:bg-secondary/75 font-semibold text-(--dw-editor-foreground) cursor-pointer flex gap-2 rounded-md items-center px-1 py-0.5 my-2",
              (props.selected || contextMenuOpen) && "bg-primary/20",
            )}
          >
            {fileLink && (
              <>
                <FileIcon
                  mimeType={fileLink.mimeType}
                  className="size-5 shrink-0"
                />
                <span>{filename(fileLink.filePath)}</span>
              </>
            )}
            {!fileLink && (
              <span className="text-muted-foreground">
                {t("editor.blocks.fileLink.placeholder")}
              </span>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {fileLink && (
            <>
              <ContextMenuItem onClick={openFile}>
                {t("editor.blocks.fileLink.open")}
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  if (!fileLink) return;
                  DarkwriteAPIClient.desktop.shell.showItemInFolder(
                    fileLink.filePath,
                  );
                }}
              >
                {t("editor.blocks.fileLink.revealInFolder")}
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  if (!fileLink) return;
                  navigator.clipboard.writeText(fileLink.filePath);
                }}
              >
                {t("editor.blocks.fileLink.copyPath")}
              </ContextMenuItem>
            </>
          )}
          <ContextMenuItem onSelect={changeFile}>
            {t("editor.blocks.fileLink.changeFile")}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onSelect={() => {
              props.deleteNode();
            }}
          >
            {t("ui.contextmenu.delete")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </NodeViewWrapper>
  );
}
