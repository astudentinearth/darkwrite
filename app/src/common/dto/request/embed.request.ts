import { z } from "zod";

const isFile = (val: unknown): val is File => {
  return typeof File !== "undefined" && val instanceof File;
};

export const CreateEmbedDTOSchema = z.object({
  workspaceId: z.string(),
  fileType: z.string(),
  file: z.custom<File>(isFile),
});

 
export type CreateEmbedDTO = z.infer<typeof CreateEmbedDTOSchema>;
