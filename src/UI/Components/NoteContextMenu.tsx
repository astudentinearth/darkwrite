import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { NoteHeader, NoteInfo, NotebookInfo } from "../../Util";
import useComponentVisible from "../../useComponentVisible";
import { GetNotebookHeaders } from "../../backend/Notebook";
import { GetLocalizedResource, LocaleContext } from "../../localization/LocaleContext";

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
    const [currentNote, setCurrentNote] = useState<NoteInfo | NoteHeader>({} as NoteInfo);
    const [notebooks, setNotebooks] = useState<NotebookInfo[]>([]);
    const {locale} = useContext(LocaleContext);
    updateCurrentNote = setCurrentNote;
    ncmv = noteContextMenuVisibility;
    useEffect(()=>{
        async function loadNotebooks(){
            const nbs = await GetNotebookHeaders();
            setNotebooks(nbs);
        }
        if(ncmv.isComponentVisible==true) loadNotebooks();
    },[currentNote])
    return <div style={{visibility: noteContextMenuVisibility.isComponentVisible ? "visible" : "collapse", boxShadow:"0 4px 36px 0px rgba(0,0,0,0.4)"}} ref={noteContextMenuVisibility.ref} className="p-1 w-64 rounded-xl bg-primary/90 backdrop-blur-md left-16 z-30 absolute">
                <ul>
                    <li id="moveToNotebookItem" className='p-2 select-none cursor-pointer flex transition-colors hover:bg-hover rounded-lg'><i className='bi-journals'></i>
                        <span className="flex-grow">&nbsp;{GetLocalizedResource("moveToNotebookContextMenuItem",locale)}</span>
                        <i className="bi-chevron-right"></i>
                        <ul className="absolute p-1 w-64 left-[15.5rem] top-0 rounded-xl bg-primary/90 backdrop-blur-md" style={{boxShadow:"0 4px 36px 0px rgba(0,0,0,0.4)"}}>
                            <li className='p-2 select-none cursor-pointer transition-colors hover:bg-hover rounded-lg'><i className='bi-plus-lg'></i>&nbsp;{GetLocalizedResource("newNotebookContextMenuItem",locale)}</li>
                            {notebooks.map((n)=>
                            <li key={n.id} className='p-2 select-none cursor-pointer transition-colors hover:bg-hover rounded-lg'><i className='bi-journal'></i>&nbsp;{n.name}</li>
                            )}
                        </ul>
                    </li>
                    <li className='p-2 select-none cursor-pointer transition-colors hover:bg-hover rounded-lg'><i className='bi-markdown-fill'></i>&nbsp;{GetLocalizedResource("exportAsMDContextMenuItem",locale)}</li>
                    <li className='p-2 select-none cursor-pointer transition-colors hover:bg-hover rounded-lg'><i className='bi-file-earmark-text-fill'></i>&nbsp;{GetLocalizedResource("exportAsTXTContextMenuItem",locale)}</li>
                    <li className='p-2 select-none cursor-pointer text-red-400 transition-colors hover:bg-hover rounded-lg'><i className='bi-trash-fill'></i>&nbsp;{GetLocalizedResource("deleteContextMenuItem",locale)}</li>
                </ul>
            </div>
}

export function ShowNoteContextMenu(properties: NoteContextMenuProperties){
    ncmv.ref.current.style.setProperty("left", `${properties.posX}px`);
    ncmv.ref.current.style.setProperty("top", `${properties.posY}px`);
    updateCurrentNote(properties.targetNote);
    ncmv.setIsComponentVisible(true);
}