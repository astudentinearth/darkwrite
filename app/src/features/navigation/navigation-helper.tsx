import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentNoteIdFromPath,
  NavigationEventBus,
  notifyNoteChange,
} from "./navigator";
import { useAppStore } from "../store/hooks";
import { useWorkspaceManager } from "../workspaces/hooks/use-workspace-manager";
import { resolveNote } from "../note/store/fetcher";

let targetNoteId: string | null = null;

export default function NavigationHelper() {
  const navigate = useNavigate();
  const store = useAppStore();
  const { switchWorkspace } = useWorkspaceManager();

  const correctCurrentWorkspace = useCallback(async () => {
    const noteId = getCurrentNoteIdFromPath();
    if (!noteId) return;
    targetNoteId = noteId;
    const currentNote = await resolveNote(noteId, store);
    const currentWorkspaceId = store.getState().session.workspaceId;
    // explictly check to prevent race condition
    if (
      currentNote.workspaceId !== currentWorkspaceId &&
      targetNoteId === noteId
    ) {
      switchWorkspace(currentNote.workspaceId, false);
      targetNoteId = null;
    }
  }, [store, switchWorkspace]);

  const correctionListener = useCallback(() => {
    const noteId = getCurrentNoteIdFromPath();
    notifyNoteChange(noteId);
    correctCurrentWorkspace();
  }, [correctCurrentWorkspace]);

  useEffect(() => {
    const unsubcribe = NavigationEventBus.subscribe(
      "onRouteChanged",
      ({ data }) => {
        navigate(data);
      },
    );

    window.addEventListener("popstate", correctionListener);
    return () => {
      unsubcribe();
      window.removeEventListener("popstate", correctionListener);
    };
  }, [navigate, correctionListener]);

  return <></>;
}
