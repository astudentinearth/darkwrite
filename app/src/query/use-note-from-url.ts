import { useParams } from "react-router-dom";

export const useNoteFromURL = () => {
  const params = useParams();
  const id = params.pageId;
  return id;
};
