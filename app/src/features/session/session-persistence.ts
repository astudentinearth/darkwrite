const SESSION_STATE_KEY = "session-state";

export interface SessionState {
  workspaceId: string | null;
}

export function saveSessionState(state: SessionState) {
  localStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
}

export function loadSessionState(): SessionState | null {
  const storedState = localStorage.getItem(SESSION_STATE_KEY);
  if (storedState) {
    return JSON.parse(storedState) as SessionState;
  }
  return null;
}
