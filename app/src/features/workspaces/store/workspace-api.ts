import { DarkwriteAPIClient } from "@/api/api-client";
import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { UpdateWorkspaceArg, workspaceSlice } from "./workspace-slice";
import { CreateWorkspaceDTO } from "@/common/dto/request/workspace.request";

export async function _getWorkspacesQueryFn() {
  try {
    const response = await DarkwriteAPIClient.workspace.getAll();
    return { data: response.workspaces };
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return { error: error as Error };
  }
}

export async function _updateWorkspaceMutationFn(arg: UpdateWorkspaceArg) {
  try {
    const response = await DarkwriteAPIClient.workspace.update(arg.id, arg);
    return { data: response.workspace };
  } catch (error) {
    console.error("Error updating workspace:", error);
    return { error: error as Error };
  }
}

export async function _createWorkspaceMutationFn(arg: CreateWorkspaceDTO) {
  try {
    const response = await DarkwriteAPIClient.workspace.create(arg);
    return { data: response.workspace };
  } catch (error) {
    console.error("Error creating workspace:", error);
    return { error: error as Error };
  }
}

export const WORKSPACE_TAG_TYPE = "Workspace";

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [WORKSPACE_TAG_TYPE],
  endpoints: (builder) => ({
    getWorkspaces: builder.query<WorkspaceDTO[], void>({
      queryFn: _getWorkspacesQueryFn,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(workspaceSlice.actions.setWorkspaces(data));
        } catch (error) {
          console.error("Error in onQueryStarted for getWorkspaces:", error);
        }
      },
      providesTags: () => [{ type: WORKSPACE_TAG_TYPE, id: "ALL" }],
    }),

    updateWorkspace: builder.mutation<WorkspaceDTO, UpdateWorkspaceArg>({
      queryFn: _updateWorkspaceMutationFn,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(workspaceSlice.actions.updateWorkspace(data));
        } catch (error) {
          console.error("Error in onQueryStarted for updateWorkspace:", error);
        }
      },
      invalidatesTags: () => [{ type: WORKSPACE_TAG_TYPE, id: "ALL" }],
    }),

    createWorkspace: builder.mutation<WorkspaceDTO, CreateWorkspaceDTO>({
      queryFn: _createWorkspaceMutationFn,
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(workspaceSlice.actions.addWorkspace(data));
        } catch (error) {
          console.error("Error in onQueryStarted for updateWorkspace:", error);
        }
      },
      invalidatesTags: () => [{ type: WORKSPACE_TAG_TYPE, id: "ALL" }],
    }),
  }),
});

export const {
  useGetWorkspacesQuery,
  useUpdateWorkspaceMutation,
  useCreateWorkspaceMutation,
} = workspaceApi;
