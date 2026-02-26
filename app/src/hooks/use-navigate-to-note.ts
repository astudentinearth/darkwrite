import { useNavigate } from "react-router-dom";

export function useNavigateToNote() {
  const navigate = useNavigate();
  return async (id: string) => {
    navigate({ pathname: `/page/${id}` });
  };
}
