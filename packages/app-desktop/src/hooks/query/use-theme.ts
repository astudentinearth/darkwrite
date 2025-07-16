import { ThemesModel } from "@/lib/api/theme";
import { DEFAULT_THEMES } from "@darkwrite/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTheme = () => {
  const api = new ThemesModel();
  const query = useQuery({
    queryKey: ["themes-query"],
    queryFn: api.getUserThemes,
    refetchOnWindowFocus: false,
  });
  const themes = DEFAULT_THEMES.concat(query.data ?? []);
  return { themes, query };
};

export const useImportThemeMutation = () => {
  const qc = useQueryClient();
  const api = new ThemesModel();
  return useMutation({
    mutationKey: ["import-theme-mutation"],
    mutationFn: api.importTheme,
    onSuccess: () => {
      qc.refetchQueries({ queryKey: ["themes-query"] });
    },
  });
};
