import type { FileLinkMetadata } from "@darkwrite/common";
import { selectFileLinkById } from "@/features/link/store/file-link.selector";
import { useAppSelector } from "@/features/store/hooks";

export type UseFileLinkResult = {
  fileLink: FileLinkMetadata | null;
};

export function useFileLink(id: string | null): UseFileLinkResult {
  const fileLink = useAppSelector((state) =>
    id ? selectFileLinkById(state, id) : null,
  );
  return { fileLink };
}
