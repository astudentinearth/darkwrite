import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resolveNote } from "../note/store/fetcher";
import { appSessionSlice } from "../session/session-slice";
import { useAppStore } from "../store/hooks";
import { AppStore } from "../store/redux";
import {
  getCurrentNoteIdFromPath,
  NavigationEventBus,
  notifyNoteChange,
} from "./navigator";

let targetNoteId: string | null = null;

async function correctWorkspace(store: AppStore) {
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
    store.dispatch(
      appSessionSlice.actions.switchWorkspace(currentNote.workspaceId),
    );
    targetNoteId = null;
  }
}

export default function NavigationHelper() {
  const navigate = useNavigate();
  const store = useAppStore();

  useEffect(() => {
    const unsubcribe = NavigationEventBus.subscribe(
      "onRouteChanged",
      ({ data }) => {
        navigate(data);
      },
    );

    return () => {
      unsubcribe();
    };
  }, [navigate, store]);

  useEffect(() => {
    const correctionListener = () => {
      const noteId = getCurrentNoteIdFromPath();
      notifyNoteChange(noteId);
      correctWorkspace(store);
    };
    window.addEventListener("popstate", correctionListener);
    return () => {
      window.removeEventListener("popstate", correctionListener);
    };
  }, [store]);

  return <></>;
}
