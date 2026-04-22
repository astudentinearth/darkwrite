import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navigateToNote } from "@/features/navigation/navigator";
import { useNoteById } from "@/features/note/hooks/use-note-by-id";
import { getNoteIcon } from "@/lib/utils";
import { DarkwriteResource, getResourceRefFromUrl } from "@darkwrite/common";
import { MarkViewRendererProps } from "@tiptap/core";
import { MarkViewContent } from "@tiptap/react";
import { Link } from "lucide-react";
import { useTranslation } from "react-i18next";

function NotePreview(props: { noteId: string }) {
  const { note } = useNoteById(props.noteId);
  const { t } = useTranslation();
  return (
    <TooltipContent
      sideOffset={-2}
      side="bottom"
      onClick={(e) => {
        e.preventDefault();
        navigateToNote(props.noteId);
      }}
      className="flex gap-2 bg-view-2/85 hover:bg-view-2/75 cursor-pointer"
    >
      <span>{getNoteIcon(note?.icon)}</span>
      <a>{note?.title || t("defaults.pageTitle")}</a>
    </TooltipContent>
  );
}

function ExternalLinkPreview(props: { url: string }) {
  return (
    <TooltipContent
      sideOffset={-2}
      side="bottom"
      className="flex gap-2 bg-view-2/85 hover:bg-view-2/75 cursor-pointer"
    >
      <Link size={16} />
      <a target="_blank" rel="noopener" href={props.url}>
        {props.url}
      </a>
    </TooltipContent>
  );
}

export function LinkView(props: MarkViewRendererProps) {
  const url = props.mark.attrs.href;
  if (!url) return null;
  const resource = getResourceRefFromUrl(url);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild={false}>
          <MarkViewContent
            as="a"
            onClick={(e) => {
              if (resource?.type === DarkwriteResource.Note) {
                e.preventDefault();
                navigateToNote(resource.id);
              }
            }}
          />
        </TooltipTrigger>
        <TooltipPortal container={document.body}>
          {resource?.type === DarkwriteResource.Note ? (
            <NotePreview noteId={resource.id} />
          ) : (
            <ExternalLinkPreview url={url} />
          )}
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}
