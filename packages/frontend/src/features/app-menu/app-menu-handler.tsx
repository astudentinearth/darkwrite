import { useEffect } from "react";
import { useNoteActions } from "../note/store/note-actions";
import { useCurrentWorkspaceId } from "../workspaces/hooks/use-workspace";
import { AppMenuBus, AppMenuBusEvent } from "./app-menu-bus";

/** Sets up listeners for app menu events and dispatches corresponding actions. This is an effect-only component and does not add DOM nodes. */
export function AppMenuHandler() {
  const { createNote } = useNoteActions();
  const workspaceId = useCurrentWorkspaceId();

  useEffect(() => {
    const subscriptions = [
      AppMenuBus.subscribe(AppMenuBusEvent.CREATE_NOTE, () => {
        if (!workspaceId) return;
        createNote({ workspaceId, navigateAfter: true, parentId: null });
      }),
    ];
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, [createNote, workspaceId]);

  return null;
}
