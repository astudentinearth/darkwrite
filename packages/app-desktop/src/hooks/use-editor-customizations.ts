import { useEditorState } from "@/context/editor-state";
import { RefObject, useEffect } from "react";

export const useEditorCustomizations = (
  container: RefObject<HTMLDivElement | null>,
) => {
  const _customizations = useEditorState((s) => s.customizations);
  useEffect(() => {
    if (!container.current) return;
    container.current.style.setProperty(
      "--dw-custom-font-name",
      _customizations.customFont ?? "",
    );
    container.current.style.setProperty(
      "--dw-editor-background",
      _customizations.backgroundColor || "transparent",
    );
    container.current.style.setProperty(
      "--dw-editor-foreground",
      _customizations.textColor || "var(--foreground)",
    );
  }, [_customizations, container]);
};
