import { DarkwriteAPIClient } from "@/api/api-client";
import { useMutation } from "@tanstack/react-query";

export default function useCreateWorkspace() {
  return useMutation({
    mutationFn: DarkwriteAPIClient.workspace.create,
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.refetchQueries({ queryKey: ["workspace"] });
    },
  });
}
