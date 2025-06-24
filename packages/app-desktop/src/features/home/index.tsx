import { Note } from "@darkwrite/common/models";
import { Button } from "@darkwrite/ui";
import { useCreateNoteMutation } from "@renderer/hooks/query/use-create-note-mutation";
import { useCenteredLayout } from "@renderer/hooks/layout/use-centered-layout";
import { useNavigateToNote } from "@renderer/hooks/use-navigate-to-note";
import { useRecentNotes } from "@renderer/hooks/use-recents";
import { cn, getNoteIcon } from "@renderer/lib/utils";
import { SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HomePage() {
  // navigation
  const nav = useNavigateToNote();
  const { mutate: create } = useCreateNoteMutation(true);
  const width = useCenteredLayout(600);
  const recents = useRecentNotes(5);
  const { t, i18n } = useTranslation();
  if (recents == null) {
    return <div>Error loading notes</div>;
  }
  return (
    <div className="flex flex-col items-center p-4 pt-16">
      <div
        style={{ width: `${width - 32}px` }}
        className={cn("gap-2 flex-col flex")}
      >
        <h1 className="font-bold text-2xl">{t("home.welcome")}</h1>
        <h2 className="font-semibold text-foreground/60">
          {t("home.recents")}
        </h2>
        <div
          className={cn(
            "flex flex-col rounded-xl w-full overflow-hidden bg-view-1 gap-2",
            recents.length === 0 && "items-center justify-center p-4 gap-2",
          )}
        >
          {recents.length === 0 ? (
            <>
              <span className="text-foreground/60">{t("home.noPages")}</span>
              <Button
                onClick={() => {
                  create(undefined);
                }}
                variant={"default"}
                data-testid="home-button-new-page"
                className="gap-2 rounded-xl"
              >
                <SquarePen /> {t("home.createPage")}
              </Button>
            </>
          ) : (
            recents.map((note: Note) => (
              <Button
                key={note.id}
                onClick={() => {
                  nav(note.id);
                }}
                variant={"secondary"}
                className={cn(
                  "rounded-xl w-full grid grid-cols-[1fr_auto] overflow-hidden justify-start place-items-start min-w-0 bg-card/80 h-12",
                )}
              >
                <span className="whitespace-nowrap min-w-0 text-ellipsis overflow-hidden block w-full text-start pr-2">
                  {getNoteIcon(note.icon, "inline")}
                  {note.title}
                </span>
                <span className="text-foreground/50">
                  {note.modifiedAt.toLocaleString(
                    i18n.resolvedLanguage != null
                      ? [i18n.resolvedLanguage]
                      : undefined,
                    {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
