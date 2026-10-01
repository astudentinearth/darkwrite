import _ from "lodash";

const SESSION_STATE_KEY = "session-state";

/** Less critical state that are not worth persisting in a settings file. Instead,
 * these are saved into localStorage. */
export interface SessionState {
  /** A hint to continue from the last open workspace.
   * @default null */
  workspaceId: string | null;

  /** Whether favorites were collapsed or expanded in the sidebar.
   * @default true*/
  favoritesViewOpen: boolean;

  /** Whether the all notes section was collapsed or expanded in the sidebar.
   * @default true */
  allNotesViewOpen: boolean;

  /** Whether custom properties are collapsed or expanded.
   * @default true */
  propertiesOpen: boolean;
}

export const DEFAULT_SESSION_STATE: SessionState = {
  workspaceId: null,
  favoritesViewOpen: true,
  allNotesViewOpen: false,
  propertiesOpen: true,
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
