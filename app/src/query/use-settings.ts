import { DarkwriteAPIClient } from "@/api/api-client";
import { DarkwriteUserSettings } from "@/common/settings";
import { InitialUserSettings } from "@/init";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import _ from "lodash";

const SETTINGS_QUERY_KEY = ["settings"];

const persistDebounced = _.debounce((settings: DarkwriteUserSettings) =>
  DarkwriteAPIClient.settings.saveUserSettings(settings),
);

/**
 * @deprecated
 */
export function useSettings() {
  const query = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      return await DarkwriteAPIClient.settings.getUserSettings();
    },
    initialData: InitialUserSettings.settings,
  });
  return query;
}

/**
 * @deprecated
 * @returns
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const settings = useSettings().data;
  const mutation = useMutation({
    mutationFn: async (updatedSettings: DarkwriteUserSettings) => {
      await DarkwriteAPIClient.settings.saveUserSettings(updatedSettings);
    },
    onSettled(_data, _error, settings) {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, settings);
    },
  });
  const updateAccentColor = (newAccent: string) => {
    const updated = produce(settings, (draft) => {
      draft.appearance.accentColor = newAccent;
    });
    queryClient.setQueryData(SETTINGS_QUERY_KEY, updated);
    persistDebounced(updated);
  };
  return { ...mutation, updateAccentColor };
}
