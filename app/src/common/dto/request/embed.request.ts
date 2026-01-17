import { z } from "zod";

const isFile = (val: unknown): val is File => {
  return typeof File !== "undefined" && val instanceof File;
};

export const CreateEmbedDTOSchema = z.object({
  workspaceId: z.string(),
  fileType: z.string(),
  file: z.custom<File>(isFile),
});

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateEmbedDTO extends z.infer<typeof CreateEmbedDTOSchema> {}
