import { toggleSidebar } from "@/context/local-state";
import { showSearch } from "@/features/search/search-state";
import { useEffect } from "react";

const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

/**
 * Checks if the currently focused element is editable (input, textarea,
 * or contenteditable). Used to prevent shortcut conflicts with text editing.
 */
function isEditableElementFocused(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tagName = activeElement.tagName.toLowerCase();
  if (tagName === "input" || tagName === "textarea") {
    return true;
  }

  if (activeElement.getAttribute("contenteditable") === "true") {
    return true;
  }

  // Check if inside a contenteditable parent (e.g., TipTap editor)
  if (activeElement.closest("[contenteditable='true']")) {
    return true;
  }

  return false;
}

export const useShortcuts = () => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const cmd = (key: string) => {
        return e.key === key && (e.metaKey || e.ctrlKey);
      };
      const alt = (key: string) => {
        return e.key === key && e.altKey;
      };

      if (cmd("n")) {
        e.preventDefault();
      } else if (cmd("k")) {
        showSearch();
      } else if (alt("b")) {
        toggleSidebar();
      } else if (isMac) {
        // macOS: Cmd+Arrow for history navigation
        // (Option+Arrow is reserved for word-by-word text navigation)
        // Skip if focus is on an editable element to preserve line start/end
        if (
          e.metaKey &&
          !e.altKey &&
          !e.ctrlKey &&
          !isEditableElementFocused()
        ) {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            window.history.back();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            window.history.forward();
          }
        }
      } else {
        // Windows/Linux: Alt+Arrow for history navigation
        if (alt("ArrowLeft")) {
          window.history.back();
        } else if (alt("ArrowRight")) {
          window.history.forward();
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // we'll get rid of react query.
  }, []);
};
