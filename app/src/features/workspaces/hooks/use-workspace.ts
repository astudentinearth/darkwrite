import { useAppSelector } from "@/features/store/hooks";
import {
  selectAllWorkspaces,
  selectCurrentWorkspace,
  selectLocalWorkspaces,
  selectWorkspaceById,
} from "../store/workspace-selectors";

export function useCurrentWorkspaceId() {
  return useAppSelector((s) => s.session.workspaceId);
}

export function useCurrentWorkspace() {
  return useAppSelector(selectCurrentWorkspace);
}

export function useWorkspaceById(id: string) {
  return useAppSelector((s) => selectWorkspaceById(s, id));
}

export function useWorkspaces() {
  return useAppSelector(selectAllWorkspaces);
}

export function useLocalWorkspaces() {
  return useAppSelector(selectLocalWorkspaces);
}
