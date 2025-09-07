import { DarkwriteAPIClient } from "@/api/api-client";
import { useQuery } from "@tanstack/react-query";
const FONTS_QUERY_KEY = ["fonts"];
export default function useFonts() {
  const query = useQuery({
    queryKey: FONTS_QUERY_KEY,
    queryFn: DarkwriteAPIClient.desktop.getFontList,
    initialData: []
  });
  return query;
}
