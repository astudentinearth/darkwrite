import { Button } from "@/components/ui";
import useRecents from "./use-recents";
import { getNoteIcon } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";

export default function RecentNotes() {
  const { recents } = useRecents();
  const { t } = useTranslation();
  const nav = useNavigateToNote();
  return (
    <div className="flex flex-col bg-view-2 rounded-xl p-1">
      <h2 className="text-foreground/80 text-2xl p-3">{t("home.recents")}</h2>
      {recents.map(note =>
        <Button className="justify-start gap-2"
          key={note.id}
          onClick={() => nav(note.id)}
          variant={"ghost"}>
          <span>{getNoteIcon(note.icon)}</span>
          <span>{note.title}</span>
        </Button>)}
    </div>
  )
}

