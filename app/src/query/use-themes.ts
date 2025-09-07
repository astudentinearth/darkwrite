import { DarkwriteAPIClient } from "@/api/api-client"
import { useQuery } from "@tanstack/react-query"

export const THEMES_QUERY_KEY = ["theme"]

export function useThemes() {
  const query = useQuery({
    queryKey: THEMES_QUERY_KEY,
    queryFn: async ()=> {
      const {themes} = await DarkwriteAPIClient.theme.getThemes(); 
      return themes;
    }
  });
  return query;
}
