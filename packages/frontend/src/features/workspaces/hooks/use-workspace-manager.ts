import { useNavigate } from "react-router-dom";
import { switchWorkspace } from "@/features/session/session.thunk";
import { useAppDispatch } from "@/features/store/hooks";

export const useWorkspaceManager = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const _switchWorkspace = (id: string, resetRoute = true) => {
    if (resetRoute) nav("/");
    dispatch(switchWorkspace(id));
  };
  return { switchWorkspace: _switchWorkspace };
};
