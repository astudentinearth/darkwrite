import { NoteDTO } from "@darkwrite/common";
import { createEntityAdapter } from "@reduxjs/toolkit";

export const notesAdapter = createEntityAdapter<NoteDTO>({});
