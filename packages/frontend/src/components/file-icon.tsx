import { LucideIcon } from "lucide-react";
import React from "react";
import { getIconForMimeType } from "./file-icon-map";

export type FileIconProps = React.ComponentProps<LucideIcon> & {
  mimeType: string | undefined;
};

export function FileIcon({ mimeType, ...rest }: FileIconProps) {
  const Icon = getIconForMimeType(mimeType);
  return <Icon {...rest} />;
}
