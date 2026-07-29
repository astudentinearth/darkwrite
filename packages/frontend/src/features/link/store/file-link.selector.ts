import type { RootState } from "@/features/store/types";
import { fileLinkAdapter } from "./file-link.slice";

export const { selectById: selectFileLinkById } = fileLinkAdapter.getSelectors(
  (state: RootState) => state.linkedFile,
);
