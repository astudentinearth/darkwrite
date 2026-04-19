import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui";
import {
  useEditActions,
  useNativeContextMenu,
  useSpellingActions,
} from "./use-native-context-menu";
import { ContextMenuEditActions } from "@darkwrite/common";
import { useTranslation } from "react-i18next";
import { SpellCheck } from "lucide-react";

export function NativeContextMenuProvider() {
  return window.isElectron ? <NativeContextMenu /> : null;
}

type SpellingOptionsProps = {
  suggestions: string[];
  callback: (suggestion: string) => void;
};

function SpellingOptions({ suggestions, callback }: SpellingOptionsProps) {
  const { t } = useTranslation("translation", { keyPrefix: "ui.contextmenu" });

  return (
    <>
      <span className="text-sm flex items-center gap-2">
        <SpellCheck size={16} />
        {t("fixSpelling")}
      </span>
      {suggestions.map((suggestion) => (
        <ContextMenuItem key={suggestion} onSelect={() => callback(suggestion)}>
          {suggestion}
        </ContextMenuItem>
      ))}
    </>
  );
}

type EditActionsProps = {
  flags: ContextMenuEditActions;
  actions: ReturnType<typeof useEditActions>;
};

function EditActions({ flags, actions }: EditActionsProps) {
  const {
    cut,
    copy,
    paste,
    pasteWithoutFormatting,
    selectAll,
    delete: _delete,
  } = actions;
  const { t } = useTranslation("translation", { keyPrefix: "ui.contextmenu" });
  return (
    <>
      <ContextMenuItem onSelect={cut} disabled={!flags.cut}>
        {t("cut")}
      </ContextMenuItem>
      <ContextMenuItem onSelect={copy} disabled={!flags.copy}>
        {t("copy")}
      </ContextMenuItem>
      <ContextMenuItem onSelect={paste} disabled={!flags.paste}>
        {t("paste")}
      </ContextMenuItem>
      <ContextMenuItem
        onSelect={pasteWithoutFormatting}
        disabled={!flags.pasteWithoutFormatting}
      >
        {t("pasteWithoutFormatting")}
      </ContextMenuItem>
      <ContextMenuItem onSelect={_delete} disabled={!flags.delete}>
        {t("delete")}
      </ContextMenuItem>
      <ContextMenuItem onSelect={selectAll} disabled={!flags.selectAll}>
        {t("selectAll")}
      </ContextMenuItem>
    </>
  );
}

export function NativeContextMenu() {
  const { menuData, onOpenChange, triggerRef, previousFocus } =
    useNativeContextMenu();
  const editActions = useEditActions(previousFocus);
  const { changeSpelling } = useSpellingActions(previousFocus);
  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger
        className="fixed w-0 h-0 pointer-events-none"
        ref={triggerRef}
      />
      <ContextMenuContent className="empty:hidden">
        {menuData?.spellingSuggestions?.length ? (
          <>
            <SpellingOptions
              suggestions={menuData.spellingSuggestions}
              callback={changeSpelling}
            />
            <ContextMenuSeparator />
          </>
        ) : null}
        {menuData?.editable && (
          <EditActions actions={editActions} flags={menuData.editActions} />
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
