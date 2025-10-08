import { NoteDTO } from "./dto";

export function resolveUpperTree(id:string, notes: Record<string, NoteDTO>){
  const list: NoteDTO[] = [];
  console.log("a");
  for(let currentId = notes[id].parentId;;) {
    if(currentId == null) return list;
  console.log("b");
    const parent = notes[currentId];
  console.log("c");
    if(!parent) break;
    list.push(parent);
  console.log("d");
    currentId = parent.parentId;
  }
}
