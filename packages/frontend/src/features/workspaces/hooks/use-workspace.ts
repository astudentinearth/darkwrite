import { panic } from "@darkwrite/common";
import { useAppSelector } from "@/features/store/hooks";
import {
  selectAllWorkspaces,
  selectCurrentWorkspace,
  selectLocalWorkspaces,
  selectWorkspaceById,
} from "../store/workspace-selectors";

export function useCurrentWorkspaceId() {
  const id = useAppSelector((s) => s.session.workspaceId);
  if (!id) panic("useCurrentWorkspaceId was called in an invalid context.");
  return id;
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
