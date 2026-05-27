import { useNavigate } from "react-router-dom";
import { appSessionSlice } from "@/features/session/session-slice";
import { useAppDispatch } from "@/features/store/hooks";

export const useWorkspaceManager = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const switchWorkspace = (id: string, resetRoute = true) => {
    if (resetRoute) nav("/");
    dispatch(appSessionSlice.actions.switchWorkspace(id));
  };
  return { switchWorkspace };
};
