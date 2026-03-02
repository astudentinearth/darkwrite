import { setWorkspaceId } from "@/context/local-state";
import { useNavigate } from "react-router-dom";

export const useWorkspaceManager = () => {
  const nav = useNavigate();
  const switchWorkspace = (id: string, resetRoute = true) => {
    if (resetRoute) nav("/");
    setWorkspaceId(id);
  };
  return { switchWorkspace };
};
