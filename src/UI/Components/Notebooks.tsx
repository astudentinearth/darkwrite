import { useEffect, useState } from "react";
import { GenerateID, GetNotebooks, INotebook } from "../../Util";
import { setNotebookFilter } from "../NotesPanel";
export let createNotebook:(name:string)=>string;
export let getLoadedNotebooks:()=>INotebook[];
export function Notebooks(){
    const [notebook,setNotebook] = useState("0");
    const [notebooks,setNotebooks] = useState([] as INotebook[])
    function CreateNotebook(name:string){
        const currentNotebooks = [...notebooks];
        const id = GenerateID();
        const newNotebook = {id:id,name:name} as INotebook;
        currentNotebooks.push(newNotebook);
        setNotebooks(currentNotebooks)
        return id;
    }
    getLoadedNotebooks=()=>{
        return notebooks;
    }
    createNotebook=CreateNotebook;
    function NotebookItem(props:INotebookItemProps){
        return <div onClick={()=>{setNotebook(props.notebookInfo.id);setNotebookFilter(props.notebookInfo.id)}} className="flex p-2 items-center hover:bg-secondary/50 cursor-pointer" style={{background: props.selected ? "rgb(var(--accent))" : ""}}>
            {props.notebookInfo.name} 
        </div>
    }
    useEffect(()=>{
        const load = async()=>{
            setNotebooks(await GetNotebooks());
        };
        load();
    },[]);
    return <div>
            {notebooks.map(n=><NotebookItem key={n.id} notebookInfo={n} selected={notebook===n.id}></NotebookItem>)}
        </div>    
}



interface INotebookItemProps{
    notebookInfo:INotebook,
    selected?:boolean
}
