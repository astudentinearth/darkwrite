import { useEffect } from "react";
import { useAppDispatch } from "@/features/store/hooks";
import { createNote } from "../note/store/note.thunk";
import { AppMenuBus, AppMenuBusEvent } from "./app-menu-bus";

/** Sets up listeners for app menu events and dispatches corresponding actions. This is an effect-only component and does not add DOM nodes. */
export function AppMenuHandler() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const subscriptions = [
      AppMenuBus.subscribe(AppMenuBusEvent.CREATE_NOTE, () => {
        dispatch(createNote({ navigateAfter: true, parentId: null }));
      }),
    ];
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, [dispatch]);

  return null;
}
