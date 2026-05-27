import type { NativeContextMenuData } from "@darkwrite/common";
import { type RefObject, useEffect, useRef, useState } from "react";
import { ContextMenuEventBus } from "./menu-event-bus";
import { DarkwriteAPIClient } from "@/api/api-client";
import type { ResultAsync } from "neverthrow";

// requestAnimationFrame is required to ensure Radix context menu does not swallow the edit commands Electron sends to the webview. We wait until everything is done, then restore focus back to whatever was focused before the context menu popped.

// These methods are valid for an Electron context only. A regular browser already has all of these without the quirks we have here.

function waitFocusRestoration(
  previousFocus: RefObject<Element | null>,
  fn: (...args: unknown[]) => void | ResultAsync<unknown, unknown>,
) {
  return () => {
    requestAnimationFrame(() => {
      (previousFocus.current as HTMLElement)?.focus();
      fn();
    });
  };
}

export function useNativeContextMenu() {
  const [open, setOpen] = useState(false);
  const [menuData, setMenuData] = useState<NativeContextMenuData | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const previousFocus = useRef<Element | null>(null);

  useEffect(() => {
    const unsubscribe = ContextMenuEventBus.subscribe("onShow", ({ data }) => {
      setMenuData(data);
      if (triggerRef.current) {
        if (open) {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape" }),
          );
        }
        previousFocus.current = document.activeElement;
        triggerRef.current.dispatchEvent(
          new MouseEvent("contextmenu", {
            bubbles: true,
            clientX: data.x,
            clientY: data.y,
          }),
        );
      }
    });
    return () => unsubscribe();
  }, [open]);

  return {
    open,
    menuData,
    onOpenChange: (isOpen: boolean) => {
      setOpen(isOpen);
    },
    triggerRef,
    previousFocus,
  };
}

export function useEditActions(previousFocus: RefObject<Element | null>) {
  const restore = (fn: () => void | ResultAsync<unknown, unknown>) => {
    return waitFocusRestoration(previousFocus, fn);
  };
  return {
    cut: restore(DarkwriteAPIClient.desktop.contextMenu.cut),
    copy: restore(DarkwriteAPIClient.desktop.contextMenu.copy),
    paste: restore(DarkwriteAPIClient.desktop.contextMenu.paste),
    pasteWithoutFormatting: restore(
      DarkwriteAPIClient.desktop.contextMenu.pasteWithoutFormatting,
    ),
    selectAll: restore(DarkwriteAPIClient.desktop.contextMenu.selectAll),
    delete: restore(DarkwriteAPIClient.desktop.contextMenu.delete),
  };
}

export function useSpellingActions(previousFocus: RefObject<Element | null>) {
  const changeSpelling = (suggestion: string) => {
    return waitFocusRestoration(previousFocus, () =>
      DarkwriteAPIClient.desktop.contextMenu.changeSpelling(suggestion),
    )();
  };

  return {
    changeSpelling,
  };
}
