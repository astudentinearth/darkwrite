import {
  File,
  FileArchive,
  FileBox,
  FileBracesCorner,
  FileImage,
  FileMusic,
  FileSpreadsheet,
  FileTerminal,
  FileText,
  Film,
  type LucideIcon,
  Presentation,
} from "lucide-react";

/** A mapping of MIME types to Lucide icons. This is used to determine which icon to display for a given file based on its MIME type. */
export const MIME_TYPE_ICON_MAP: Record<string, LucideIcon> = {
  // Presentations
  "application/vnd.ms-powerpoint": Presentation,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    Presentation,
  "application/vnd.oasis.opendocument.presentation": Presentation,

  // Spreadsheets
  "application/vnd.ms-excel": FileSpreadsheet,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    FileSpreadsheet,
  "application/vnd.oasis.opendocument.spreadsheet": FileSpreadsheet,
  "text/csv": FileSpreadsheet,
  "text/tab-separated-values": FileSpreadsheet,

  // Documents
  "application/msword": FileText,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    FileText,
  "application/vnd.oasis.opendocument.text": FileText,
  "application/rtf": FileText,
  "text/rtf": FileText,
  "text/markdown": FileText,
  "text/plain": FileText,
  "application/pdf": FileText,
  "application/vnd.adobe.pdf": FileText,

  // Shell / terminal scripts
  "application/x-sh": FileTerminal,
  "application/x-bash": FileTerminal,
  "text/x-shellscript": FileTerminal,
  "application/x-powershell": FileTerminal,
  "text/x-powershell": FileTerminal,
  "text/vbscript": FileTerminal,
  "application/x-msdos-program": FileTerminal,

  // Archives
  "application/zip": FileArchive,
  "application/x-tar": FileArchive,
  "application/gzip": FileArchive,
  "application/x-gzip": FileArchive,
  "application/x-bzip2": FileArchive,
  "application/x-7z-compressed": FileArchive,
  "application/vnd.rar": FileArchive,
  "application/x-rar-compressed": FileArchive,
  "application/x-xz": FileArchive,
  "application/x-zstd": FileArchive,
  "application/x-lzip": FileArchive,
  "application/x-compress": FileArchive,

  // 3D / Blender
  "application/x-blender": FileBox,
  "model/obj": FileBox,
  "model/gltf+json": FileBox,
  "model/gltf-binary": FileBox,
  "model/stl": FileBox,
  "application/x-fbx": FileBox,

  // Source code
  "application/json": FileBracesCorner,
  "text/x-c": FileBracesCorner,
  "text/x-c++": FileBracesCorner,
  "text/x-csrc": FileBracesCorner,
  "text/x-chdr": FileBracesCorner,
  "text/x-java": FileBracesCorner,
  "text/x-java-source": FileBracesCorner,
  "text/x-python": FileBracesCorner,
  "text/x-rust": FileBracesCorner,
  "text/x-go": FileBracesCorner,
  "text/x-ruby": FileBracesCorner,
  "text/x-perl": FileBracesCorner,
  "text/x-php": FileBracesCorner,
  "application/x-php": FileBracesCorner,
  "text/x-swift": FileBracesCorner,
  "text/x-kotlin": FileBracesCorner,
  "text/x-scala": FileBracesCorner,
  "text/x-csharp": FileBracesCorner,
  "text/x-lua": FileBracesCorner,
  "application/x-lua": FileBracesCorner,
  "text/javascript": FileBracesCorner,
  "application/javascript": FileBracesCorner,
  "text/typescript": FileBracesCorner,
  "text/css": FileBracesCorner,
  "text/html": FileBracesCorner,
};

/** Returns the best-match Lucide icon for a given MIME type. */
export function getIconForMimeType(mimeType: string | undefined): LucideIcon {
  if (!mimeType) return File;
  if (MIME_TYPE_ICON_MAP[mimeType]) return MIME_TYPE_ICON_MAP[mimeType];
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.startsWith("video/")) return Film;
  if (mimeType.startsWith("audio/")) return FileMusic;
  return File;
}
