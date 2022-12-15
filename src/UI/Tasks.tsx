import { invoke } from "@tauri-apps/api";
import React, { useState } from "react";
import { useEffect } from "react";
import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import {appDir} from "../../node_modules/@tauri-apps/api/path"
import { GenerateID, ITask, JSONToITaskArray } from "../Util";
import {DragDropContext, Draggable, Droppable} from '@hello-pangea/dnd';
let changeTasks:any;
let getTasks:any;
function TaskInputChanged(){

} 

async function LoadTasks(){
    let APPDIR=await appDir();
    console.log("[INFO from LoadTasks()] Loading tasks");
    if(!await invoke("path_exists",{targetPath:APPDIR+"tasks.json"})){
        console.log("[WARNING] Tasks file not found. Initializing a file with no tasks");
        await writeFile(APPDIR+"tasks.json",`{"tasks":[]}`);
        return [] as ITask[];
    }
    console.log("[INFO from LoadTasks()] Reading tasks file");
    let tasksFile:string=await readTextFile(APPDIR+"tasks.json");
    let tasksJSON=JSON.parse(tasksFile);
    return JSONToITaskArray(tasksJSON) ?? [] as ITask[];
}

async function SaveTasks(){
    let APPDIR=await appDir();
    console.log("[INFO from SaveTasks()] Saving tasks");
    await writeFile(APPDIR+"tasks.json",JSON.stringify({tasks:getTasks()}));
}

/*/
tasks json format
{
    "tasks":["","",""...]
}
*/ 
function Tasks(){
    const [tasks,setTasks] = useState([] as ITask[]); // an array of strings that represent tasks
    useEffect(()=>{
        const load = async ()=>{
            let _tasks =await LoadTasks();
            setTasks(_tasks);
        }
        load();
    },[]);
    changeTasks=setTasks;
    getTasks=returnTasks;
    function returnTasks(){
        return tasks;
    }
    function AddTask(content:string){
        let t=[...tasks];
        let task={completed: false,content:content,id:GenerateID()} as ITask;
        t.push(task);
        setTasks(t);
        SaveTasks();
    }
    function removeTask(id:string){
        let currentTasks=[...tasks];

        setTasks(currentTasks);
        console.log(tasks);
        SaveTasks();
    }
    function InputKeyDown(event:any){
        let taskInput:any=document.getElementById("taskInput");
        if(event.keyCode===13 && taskInput.value.trim().length!==0){
            AddTask(taskInput.value);
            taskInput.value="";
        }
    }
    return <div id="TaskPanel" className="w-72  overflow-y-scroll  min-h-0 text-default z-10 flex-[1_1_auto] flex-col transition-all" >
        <div className="flex taskinputdiv">
            <input onChange={TaskInputChanged} tabIndex={0} type="text" onKeyDown={InputKeyDown} id="taskInput" placeholder="A new task" className="border-default inline-block hide-outline w-[240px] bg-secondary/25 h-12 p-2 text-xl"></input>
            <div className="bg-accent/75 cursor-pointer transition-all hover:brightness-125 w-12 h-12 flex justify-center items-center" >
                <i className="bi-plus-lg text-2xl"></i>
            </div>
        </div>
        <div id="tasksDiv" className="grow min-h-0">
            <DragDropContext onDragEnd={(result:any)=>{
                    if(!result.destination) return;
                    const items = Array.from(tasks);
                    const [reordered] = items.splice(result.source.index, 1);
                    items.splice(result.destination.index,0,reordered);
                    setTasks(items);
                    SaveTasks();
                }}>
                    <Droppable droppableId="tasksDrop">
                        {(provided)=>{
                            return <div ref={provided.innerRef} {...provided.droppableProps}>
                                {tasks.map((item,index)=>{
                                    return <Draggable draggableId={item.id.toString()} key={item.id.toString()} index={index}>
                                        {(_provided)=>{
                                            return <div ref={_provided.innerRef} 
                                            {..._provided.draggableProps} 
                                            {..._provided.dragHandleProps}
                                            className="task-item">
                                                <div onClick={()=>{
                                                let t = [...tasks];
                                                for (let i of t){
                                                    if(i.id===item.id){
                                                        i.completed=i.completed ? false : true;
                                                    }
                                                }
                                                setTasks(t);
                                                SaveTasks();}} 
                                                style={item.completed ? {background: "rgb(var(--accent))"} : {}} className="w-5 h-5 ml-2 flex items-center justify-center rounded-md bg-secondary/50 hover:brigtness-125 cursor-pointer">
                                                    {item.completed ? <i className="bi-check-lg text-white"></i> : ""}
                                                </div>
                                                <span className="text-default p-2 text-md">{item.content}</span></div>
                                        }}
                                        </Draggable>
                                })}
                                {provided.placeholder}
                            </div>
                        }}
                    </Droppable>
                </DragDropContext>
	    </div>
    </div>  
}


export {Tasks,LoadTasks,getTasks,changeTasks};
