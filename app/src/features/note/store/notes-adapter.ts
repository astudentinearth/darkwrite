import { NoteDTO } from "@/common/dto";
import { createEntityAdapter } from "@reduxjs/toolkit";

export const notesAdapter = createEntityAdapter<NoteDTO>({});
