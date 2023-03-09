import { invoke } from "@tauri-apps/api";
import update from 'immutability-helper'
import React, { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import {appDir} from "../../node_modules/@tauri-apps/api/path"
import { DraggableTypes, GenerateID, ITask, JSONToITaskArray } from "../Util";
import { TaskItem } from "./Components/TaskItem";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
let changeTasks:any;
let getTasks:any;
export const TasksContext = React.createContext<ITasksContext>({tasks: [], setTasks: ()=>{}});

interface ITasksContext{
    tasks: ITask[]
    setTasks: Dispatch<SetStateAction<ITask[]>>
}

interface TasksContainerState {
    tasks: ITask[]
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

export async function SaveTasks(){
    let APPDIR=await appDir();
    console.log("[INFO from SaveTasks()] Saving tasks");
    await writeFile(APPDIR+"tasks.json",JSON.stringify({tasks:getTasks()}));
}

function Tasks(){
    const [tasks,setTasks] = useState([] as ITask[]);
    useEffect(()=>{
        const load = async ()=>{
            let _tasks =await LoadTasks();
            setTasks(_tasks);
        }
        load();
    },[]);
    let taskInputRef:any = useRef(null);
    changeTasks=setTasks;
    getTasks=returnTasks;
    function returnTasks(){
        return tasks;
    }
    function AddTask(content:string){
        let t=[...tasks];
        let task={completed: false,content:content,id:GenerateID()} as ITask;
        t.unshift(task);
        setTasks(t);
        SaveTasks();
    }
    function removeTask(id:string){
        let currentTasks=[...tasks];
        for (let t in currentTasks){
           if(currentTasks[t].id===id){
                currentTasks.splice(parseInt(t),1);
           } 
        }
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
    const reorder = useCallback((dragIndex: number, hoverIndex: number)=>{
        console.log("reorder")
        setTasks((prevTasks: ITask[])=>
            update(prevTasks,{
                $splice: [
                    [dragIndex,1],
                    [hoverIndex,0,prevTasks[dragIndex] as ITask]
                ]
            })
        );
        SaveTasks();
    },[])
    const renderTask = useCallback((todo: ITask, index:number)=>{
        return ( <TaskItem index={index} 
        content={todo.content} 
        id={todo.id} 
        completed={todo.completed}
        reorder={reorder}
        type={"todo"}
        key={todo.id}></TaskItem>)
    },[])
    return <div id="TaskPanel" className="w-72 flex flex-col overflow-x-hidden flex-[1_1_auto] overflow-y-auto min-h-0 relative text-default z-10 transition-all" >
       <TasksContext.Provider value={{tasks, setTasks}}>
            <div className="flex h-12 flex-[0_1_auto]">
                <input ref={taskInputRef} tabIndex={0} type="text" onKeyDown={InputKeyDown} id="taskInput" placeholder="A new task" className="border-default inline-block hide-outline w-[240px] bg-secondary/25 h-12 p-2 text-xl"></input>
                <div onClick={()=>{
                    if(taskInputRef.current.value.trim().length!==0){
                        AddTask(taskInputRef.current.value);
                        taskInputRef.current.value="";
                    }
                }} className="bg-accent/75 cursor-pointer transition-all hover:brightness-125 w-12 h-12 flex flex-[1_0_auto] justify-center items-center" >
                    <i className="bi-plus-lg text-2xl text-white"></i>
                </div>
            </div>
            <DndProvider debugMode={true} backend={HTML5Backend}>
                <div id="tasksDiv" className="flex-[1_0_auto]">
                    {tasks.map((task,i)=>renderTask(task,i))}
                </div>
            </DndProvider>
       </TasksContext.Provider>
    </div>  
}


export {Tasks,LoadTasks,getTasks,changeTasks};
