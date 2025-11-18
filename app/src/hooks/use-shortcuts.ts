import { useCreateNoteMutation } from "@/query/use-create-note";
import { useEffect } from "react";

export const useShortcuts = () => {
  const createNew = useCreateNoteMutation(true);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        createNew.create({});
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // we'll get rid of react query.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
