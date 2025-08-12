import { NoteDTO } from "./dto";

export function resolveUpperTree(id:string, notes: Record<string, NoteDTO>){
  const list: NoteDTO[] = [];
  for(let currentId = notes[id].parentId;;) {
    if(currentId == null) return list;
    const parent = notes[currentId];
    list.push(parent);
    currentId = parent.parentId;
  }
}