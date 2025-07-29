import { useLocalStore } from "@/context/local-state";

export const useWorkspaceManager = () => {
  const setWorkspaceId = useLocalStore(s => s.setWorkspaceId);
  const switchWorkspace = (id: string) => {
    setWorkspaceId(id);
  };
  return { switchWorkspace };
};
