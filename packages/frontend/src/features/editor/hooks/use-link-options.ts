import { useSearch } from "@/features/note/hooks/use-search";
import { useCurrentEditor } from "@tiptap/react";
import { use, useRef, useState } from "react";
import { DarkwriteEditorContext } from "../context";
import { useFormattingState } from "./use-formatting-state";
import { DarkwriteResource, resourceRefToUrl } from "@darkwrite/common";

export function isValidLinkUrl(str: string) {
  try {
    const url = new URL(str.includes("://") ? str : "http://" + str);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function normalizetoHttpUrl(str: string) {
  if (str.startsWith("http://") || str.startsWith("https://")) {
    return str;
  }
  return "https://" + str;
}

export function useLinkOptions() {
  const { editor } = useCurrentEditor();
  const { noteId } = use(DarkwriteEditorContext);
  const [open, _setOpen] = useState(false);
  const url: string | undefined = useFormattingState(noteId).currentLinkUrl;
  const urlRef = useRef<HTMLInputElement>(null);
  const { isLink } = useFormattingState(noteId);
  const externalUrl = url?.startsWith("darkwrite://") ? "" : (url ?? "");
  const [query, setQuery] = useState<string>(externalUrl);
  const { results, debouncedSearch } = useSearch(query);

  const setOpen = (value: boolean) => {
    if (value) {
      setQuery(externalUrl);
    } else setQuery("");
    _setOpen(value);
  };

  const setLink = () => {
    if (!urlRef.current) return;
    if (!isValidLinkUrl(urlRef.current.value)) return;
    editor
      ?.chain()
      .focus()
      .setLink({ href: normalizetoHttpUrl(urlRef.current.value) })
      .run();
    setOpen(false);
  };

  const setLinkToNote = (noteId: string) => {
    const url = resourceRefToUrl({ type: DarkwriteResource.Note, id: noteId });
    editor?.chain().focus().setLink({ href: url }).run();
    setOpen(false);
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
    setOpen(false);
  };

  return {
    open,
    setOpen,
    url,
    urlRef,
    isLink,
    query,
    setQuery,
    results,
    debouncedSearch,
    setLink,
    setLinkToNote,
    removeLink,
  };
}
