import { useAppSelector } from "@/features/store/hooks";

export function useCurrentWorkspaceId() {
  return useAppSelector((s) => s.session.workspaceId);
}
