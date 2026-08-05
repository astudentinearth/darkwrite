import { IconPaperclip } from "@tabler/icons-react";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { AppWindow } from "lucide-react";
import { type MouseEvent, use, useState } from "react";
import { useTranslation } from "react-i18next";
import { DarkwriteAPIClient } from "@/api/api-client";
import { FileIcon } from "@/components/file-icon";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui";
import { pickAndCreateFileLink } from "@/features/link/store/file-link.thunk";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { cn } from "@/lib/utils";
import { DarkwriteEditorContext } from "../context";
import { selectEditorEditable } from "../store/editor-selectors";
import type { FileLinkAttributesType } from "./file-link-extension";
import { useFileLink } from "./use-file-link";

const filename = (fullPath: string) => {
  const parts = fullPath.split(/[/\\]/);
  return parts[parts.length - 1];
};

const isApplication = (filePath: string) => {
  const ext = filePath.split(".").pop()?.toLowerCase();
  return (
    ext === "exe" ||
    ext === "app" ||
    ext === "bat" ||
    ext === "cmd" ||
    ext === "sh"
  );
};

export function FileLinkNode(props: ReactNodeViewProps) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const { linkId } = props.node.attrs as FileLinkAttributesType;
  const { fileLink } = useFileLink(linkId);
  const { t } = useTranslation();
  const { openFilesOnDoubleClick } = use(DarkwriteEditorContext);
  const editable = useAppSelector(selectEditorEditable);
  const dispatch = useAppDispatch();

  const openFile = () => {
    if (!fileLink) return;
    DarkwriteAPIClient.fileLink.openById(fileLink.id);
  };

  const changeFile = () => {
    dispatch(pickAndCreateFileLink()).map((link) =>
      link ? props.updateAttributes({ linkId: link.id }) : undefined,
    );
  };

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileLink) {
      if (editable) changeFile();
    } else if (!openFilesOnDoubleClick) openFile();
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
              "bg-transparent hover:bg-secondary/75 font-semibold text-(--dw-editor-foreground) cursor-pointer grid grid-cols-[20px_1fr] gap-2 rounded-md items-center px-1 py-0.5 my-2 overflow-hidden text-ellipsis whitespace-nowrap wrap-break-word",
              (props.selected || contextMenuOpen) && "bg-primary/20",
            )}
          >
            {fileLink && (
              <>
                {isApplication(fileLink.filePath) ? (
                  <AppWindow className="size-5 shrink-0" />
                ) : (
                  <FileIcon
                    mimeType={fileLink.mimeType}
                    className="size-5 shrink-0"
                  />
                )}

                <span className="grow text-ellipsis overflow-hidden whitespace-nowrap">
                  {filename(fileLink.filePath)}
                </span>
              </>
            )}
            {!fileLink && (
              <>
                <IconPaperclip size={20} />
                <span className="text-muted-foreground grow text-ellipsis overflow-hidden whitespace-nowrap">
                  {t("editor.blocks.fileLink.placeholder")}
                </span>
              </>
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
          {editable && (
            <>
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
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </NodeViewWrapper>
  );
}
