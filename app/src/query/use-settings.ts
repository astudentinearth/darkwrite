import { DarkwriteAPIClient } from "@/api/api-client"
import { DarkwriteUserSettings } from "@/common/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const SETTINGS_QUERY_KEY = ["settings"]

export function useSettings() {
  const query = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      return await DarkwriteAPIClient.settings.getUserSettings();
    }
  });
  return query;
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (updatedSettings: DarkwriteUserSettings)=>{
      await DarkwriteAPIClient.settings.saveUserSettings(updatedSettings);
    },
    onSettled(_data, _error, settings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, settings)
    },
  });
  return mutation;
}
