import { NoteDTO } from "@/common/dto"
import { useT } from "@/hooks/useT";
import { ReactNode } from "react";
import NoteDropZone from "./note-drop-zone";
import NoteItem from "./note-item";
import { LexoRank } from "lexorank";

export default function NoteList(props: {leadingOrderHint: string, finalOrderHint: string, notes: NoteDTO[]}) {
  const { notes } = props;
  const t = useT();
  const renderNotes = () => {
    if(notes.length===0) return <span>{t("notes.noPages")}</span>
    const nodes: ReactNode[] = [];

    nodes.push(<NoteDropZone key={"drop-leading"} orderHint={props.leadingOrderHint}/>);

    for(let i = 0; i < notes.length; i++) {
      const noteItem = <NoteItem key={notes[i].id} note={notes[i]}/>
      nodes.push(noteItem);

      if(i === notes.length - 1) {
        nodes.push(<NoteDropZone key={`dropzone-${props.finalOrderHint}`} orderHint={props.finalOrderHint}/>);
        break;
      }
      
      const thisOrderHint = LexoRank.parse(notes[i].orderHint);
      const nextOrderHint = LexoRank.parse(notes[i+1].orderHint);
      const dropHint = thisOrderHint.between(nextOrderHint).toString();
      nodes.push(<NoteDropZone key={`dropzone-${dropHint}`} orderHint={dropHint}/>);
    }

    return nodes;
  }

  return <div>
    {renderNotes()}
  </div>
}