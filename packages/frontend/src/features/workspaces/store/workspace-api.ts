import { DarkwriteAPIClient } from "@/api/api-client";
import { selectAllNoteIdsByWorkspaceIdUnfiltered } from "@/features/note/store/note-selectors";
import { removeNotes } from "@/features/note/store/note-slice";
import { appSessionSlice } from "@/features/session/session-slice";
import { RootState } from "@/features/store/types";
import { CreateWorkspaceDTO, WorkspaceDTO } from "@darkwrite/common";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectAllWorkspaces } from "./workspace-selectors";
import { UpdateWorkspaceArg, workspaceSlice } from "./workspace-slice";

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

export async function _deleteWorkspaceMutationFn(workspaceId: string) {
  try {
    await DarkwriteAPIClient.workspace.delete(workspaceId);
    return { data: undefined };
  } catch (error) {
    console.error("Error deleting workspace:", error);
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

    deleteWorkspace: builder.mutation<void, string>({
      queryFn: _deleteWorkspaceMutationFn,
      async onQueryStarted(
        workspaceId,
        { queryFulfilled, dispatch, getState },
      ) {
        try {
          let state = getState() as RootState;
          await queryFulfilled;
          dispatch(workspaceSlice.actions.removeWorkspace(workspaceId));
          const associatedNoteIds = selectAllNoteIdsByWorkspaceIdUnfiltered(
            state,
            workspaceId,
          );
          dispatch(removeNotes(associatedNoteIds));
          state = getState() as RootState; // re-query state after dispatching workspace removal
          const anyOtherWorkspace = selectAllWorkspaces(state).find(
            (w) => w.id !== workspaceId,
          );
          if (!anyOtherWorkspace) {
            // It's harder to recover from this state. Let the init routine clean things up
            window.location.reload();
            return;
          }
          dispatch(
            appSessionSlice.actions.switchWorkspace(anyOtherWorkspace.id),
          );
        } catch (error) {
          console.error("Error in onQueryStarted for deleteWorkspace:", error);
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
