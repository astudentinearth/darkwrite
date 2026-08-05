import { IconBook } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { HeaderbarButton } from "@/components/headerbar-button";
import { TextTooltip } from "@/components/ui/tooltip";
import { useAppSelector } from "@/features/store/hooks";
import { cn } from "@/lib/utils";
import { useEditorActions } from "./store/editor-actions";
import { selectEditorEditable } from "./store/editor-selectors";

export default function ReaderModeToggle() {
  const editable = useAppSelector(selectEditorEditable);
  const { setEditable } = useEditorActions();
  const { t } = useTranslation();
  return (
    <TextTooltip
      text={
        editable
          ? t("editor.readerMode.enable")
          : t("editor.readerMode.disable")
      }
    >
      <HeaderbarButton onClick={() => setEditable(!editable)}>
        <IconBook size={20} className={cn(!editable && "text-primary")} />
      </HeaderbarButton>
    </TextTooltip>
  );
}
