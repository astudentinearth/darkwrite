import { DarkwriteAPIClient } from "@/api/api-client";
import { resultQueryFn } from "@/lib/query-result";
import { selectAllNoteIdsByWorkspaceIdUnfiltered } from "@/features/note/store/note-selectors";
import { removeNotes } from "@/features/note/store/note-slice";
import { appSessionSlice } from "@/features/session/session-slice";
import { RootState } from "@/features/store/types";
import { CreateWorkspaceDTO, WorkspaceDTO } from "@darkwrite/common";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectAllWorkspaces } from "./workspace-selectors";
import { UpdateWorkspaceArg, workspaceSlice } from "./workspace-slice";

export const WORKSPACE_TAG_TYPE = "Workspace";

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [WORKSPACE_TAG_TYPE],
  endpoints: (builder) => ({
    getWorkspaces: builder.query<WorkspaceDTO[], void>({
      queryFn: resultQueryFn(
        () => DarkwriteAPIClient.workspace.getAll(),
        (r) => r.workspaces,
      ),
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
      queryFn: resultQueryFn(
        (arg: UpdateWorkspaceArg) =>
          DarkwriteAPIClient.workspace.update(arg.id, arg),
        (r) => r.workspace,
      ),
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
      queryFn: resultQueryFn(
        (arg: CreateWorkspaceDTO) => DarkwriteAPIClient.workspace.create(arg),
        (r) => r.workspace,
      ),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(workspaceSlice.actions.addWorkspace(data));
        } catch (error) {
          console.error("Error in onQueryStarted for createWorkspace:", error);
        }
      },
      invalidatesTags: () => [{ type: WORKSPACE_TAG_TYPE, id: "ALL" }],
    }),

    deleteWorkspace: builder.mutation<void, string>({
      queryFn: resultQueryFn((workspaceId: string) =>
        DarkwriteAPIClient.workspace.delete(workspaceId),
      ),
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
