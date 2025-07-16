import { ClientAPI } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";

export const useClientInfo = () => {
  const query = useQuery({
    queryKey: ["app-info"],
    queryFn: ClientAPI.getClientInfo,
  });
  return query.data;
};
