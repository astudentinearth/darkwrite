import { useContext } from "react";
import { NotebooksContext } from "../../NotebooksContext";
import { NotebookInfo } from "../../Util";
import { ActiveNotebookContext } from "../ActiveNotebookContext";
export function Notebooks(){
    const {notebookID, setNotebookID} = useContext(ActiveNotebookContext);
    const {notebooks} = useContext(NotebooksContext);
    function NotebookItem(props:NotebookItemProps){
        return <div onClick={()=>{setNotebookID(props.notebookInfo.id)}} className="flex p-2 items-center hover:bg-secondary/50 cursor-pointer" style={{background: props.selected ? "rgb(var(--accent))" : ""}}>
            {props.notebookInfo.name} 
        </div>
    }
    return <div>
            {notebooks.map(n=><NotebookItem key={n.id} notebookInfo={n} selected={notebookID===n.id}></NotebookItem>)}
        </div>    
}



interface NotebookItemProps{
    notebookInfo:NotebookInfo,
    selected?:boolean
}
