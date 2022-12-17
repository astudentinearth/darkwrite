import { useState } from "react";
import { GetNotebooks, INotebook } from "../../Util"
import { getNotebook, setNotebookFilter } from "../NotesPanel";

export function Notebooks(){
    const [notebook,setNotebook] = useState("0");
    function NotebookItem(props:INotebookItemProps){
        return <div onClick={()=>{setNotebook(props.notebookInfo.id);setNotebookFilter(props.notebookInfo.id)}} className="flex p-2 items-center hover:bg-secondary/50 cursor-pointer" style={{fontWeight: props.selected ? "bold" : "normal"}}>
            {props.notebookInfo.name} 
        </div>
    }
    const renderNotebookList=()=>{
        let nb = GetNotebooks();
        return <>
            {nb.map((n)=>{return <NotebookItem key={n.id} notebookInfo={n} selected={notebook==n.id}></NotebookItem>})}
            </>
    }
    return <div>
            {renderNotebookList()}
        </div>    
}



interface INotebookItemProps{
    notebookInfo:INotebook,
    selected?:boolean
}
