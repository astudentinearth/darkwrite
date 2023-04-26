import React, { Dispatch, SetStateAction, useState } from "react";
import { NoteHeader, NoteInfo } from "../../Util";
import useComponentVisible from "../../useComponentVisible";

let updateCurrentNote: Dispatch<SetStateAction<NoteHeader | NoteInfo>>;

interface NoteContextMenuProperties{
  targetNote: NoteHeader | NoteInfo, 
  posX: number, posY: number, 
}

let ncmv:{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: any;
    isComponentVisible: boolean;
    setIsComponentVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export function NoteContextMenu(){
    const noteContextMenuVisibility = useComponentVisible(false);
    const [, setCurrentNote] = useState<NoteInfo | NoteHeader>({} as NoteInfo);
    updateCurrentNote = setCurrentNote;
    ncmv = noteContextMenuVisibility;
    return <div style={{visibility: noteContextMenuVisibility.isComponentVisible ? "visible" : "collapse", boxShadow:"0 4px 36px 0px rgba(0,0,0,0.4)"}} ref={noteContextMenuVisibility.ref} className="p-1 w-64 rounded-xl bg-primary left-16 z-30 absolute">
                <ul>
                    <li className='p-2 select-none cursor-pointer transition-colors hover:bg-hover rounded-lg'><i className='bi-journals'></i>&nbsp;Move to notebook</li>
                    <li className='p-2 select-none cursor-pointer transition-colors hover:bg-hover rounded-lg'><i className='bi-box-arrow-up-right'></i>&nbsp;Export as Markdown</li>
                    <li className='p-2 select-none cursor-pointer transition-colors hover:bg-hover rounded-lg'><i className='bi-box-arrow-up-right'></i>&nbsp;Export as text file</li>
                    <li className='p-2 select-none cursor-pointer text-red-400 transition-colors hover:bg-hover rounded-lg'><i className='bi-trash-fill'></i>&nbsp;Delete</li>
                </ul>
            </div>
}

export function ShowNoteContextMenu(properties: NoteContextMenuProperties){
    ncmv.ref.current.style.setProperty("left", `${properties.posX}px`);
    ncmv.ref.current.style.setProperty("top", `${properties.posY}px`);
    updateCurrentNote(properties.targetNote);
    ncmv.setIsComponentVisible(true);
}