import _ from "lodash";

const SESSION_STATE_KEY = "session-state";

export interface SessionState {
  workspaceId: string | null;
  favoritesViewOpen: boolean;
  allNotesViewOpen: boolean;
}

export const DEFAULT_SESSION_STATE: SessionState = {
  workspaceId: null,
  favoritesViewOpen: true,
  allNotesViewOpen: false,
};

export function saveSessionState(state: SessionState) {
  localStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
}

export function loadSessionState(): SessionState | null {
  const storedState = localStorage.getItem(SESSION_STATE_KEY);
  if (storedState) {
    const stored = JSON.parse(storedState) as SessionState;
    return _.merge({}, DEFAULT_SESSION_STATE, stored);
  }
  return null;
}
