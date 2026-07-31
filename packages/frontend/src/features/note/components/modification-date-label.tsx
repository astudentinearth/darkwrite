import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/features/store/hooks";
import { selectNoteById } from "../store/note-selectors";

export function ModificationDateLabel(props: { noteId: string }) {
  const { modifiedAt } = useAppSelector(
    (state) => selectNoteById(state, props.noteId) || { modifiedAt: null },
  );

  const { t } = useTranslation("translation", {
    keyPrefix: "sidebar.notes.contextmenu",
  });

  if (!modifiedAt) return null;

  return (
    <div className="text-foreground/50 text-sm p-1.5">
      {t("lastModified")} {new Date(modifiedAt).toLocaleDateString()}
    </div>
  );
}
