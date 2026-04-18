import { Button } from "@/components/ui";
import { SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConstrainedWidth from "../editor/constrained-width";
import { useNoteActions } from "../note/store/note-actions";
import { useCurrentWorkspaceId } from "../workspaces/hooks/use-workspace";
import RecentNotes from "./recents";

export default function HomePage() {
  const { t } = useTranslation();
  const workspaceId = useCurrentWorkspaceId();
  const { createNote } = useNoteActions();
  return (
    <div className="flex items-center flex-col px-24 editor-fade-in min-h-full relative p-12">
      <ConstrainedWidth className="flex flex-col gap-6">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-2xl pl-2 font-semibold tracking-tight">
            {t("home.welcome")}
          </h1>
          <Button
            onClick={() => {
              if (!workspaceId) return;
              createNote({ workspaceId, navigateAfter: true });
            }}
            variant="secondary"
            // y offset is for optical balance with the welcome text
            className="bg-view-2 h-fit translate-y-0.5 active:pushdown-98%"
          >
            <SquarePen size={16} />
            {t("sidebar.button.newPage")}
          </Button>
        </div>
        <RecentNotes />
      </ConstrainedWidth>
    </div>
  );
}
