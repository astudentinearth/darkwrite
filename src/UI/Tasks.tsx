import { invoke } from "@tauri-apps/api";
import React, { useState } from "react";
import { useEffect } from "react";
import TaskItem from "./TaskItem"
import { readTextFile, writeFile,BaseDirectory } from "@tauri-apps/api/fs";
import {appDir, homeDir} from "../../node_modules/@tauri-apps/api/path"
import { GlobalSettings } from "../GlobalSettings";
let changeTasks:any;
let getTasks:any;
function TaskInputChanged(){
    // Manage the "press enter" tip
    // If there is something in the box, show the tooltip
    let TaskInput:any = document.getElementById("taskInput");
    let TaskInputTip:any = document.getElementById("taskInputTip");
    if(String(TaskInput.value)==""){
        TaskInputTip.style.setProperty("display","none");
    }
    else{
        TaskInputTip.style.setProperty("display","inline");
        
    }
} 

async function LoadTasks(){
    let APPDIR=await appDir();
    console.log("Loading tasks...");
    if(!await invoke("path_exists",{targetPath:APPDIR+"tasks.json"})){
        console.log("Tasks file not found. Creating it.");
        await writeFile(APPDIR+"tasks.json",`{"tasks":[]}`);
        return [] as string[];
    }
    console.log("Reading file...");
    let tasksFile:string=await readTextFile(APPDIR+"tasks.json");
    let tasksJSON=JSON.parse(tasksFile);
    console.log(tasksJSON.tasks);
    return tasksJSON.tasks as string[];
}

async function SaveTasks(){
    let APPDIR=await appDir();
    console.log("Saving tasks...");
    await writeFile(APPDIR+"tasks.json",JSON.stringify({tasks:getTasks()}));
}

/*
tasks json format
{
    "tasks":["","",""...]
}
*/ 
function Tasks(){
    const [tasks,setTasks] = useState([] as string[]); // an array of strings that represent tasks
    useEffect(()=>{
        LoadTasks().then((ret)=>{
            setTasks(ret);
        });
    },[]);
    changeTasks=setTasks;
    getTasks=returnTasks;
    function returnTasks(){
        return tasks;
    }
    
    function AddTask(task:string){
        let t=[...tasks];
        t.push(task)
        setTasks(t);
        SaveTasks();
    }
    function removeTask(text:string){
        let currentTasks=[...tasks];
        currentTasks.splice(currentTasks.indexOf(text),1);
        setTasks(currentTasks);
        console.log(tasks);
        SaveTasks();
    }
    function InputKeyDown(event:any){
        let taskInput:any=document.getElementById("taskInput");
        if(event.keyCode===13 && taskInput.value.trim().length!=0){
            AddTask(taskInput.value);
            taskInput.value="";
        }
    }
    return <div id="TaskPanel" className="div_tasks fixed w-72 overflow-y-auto border-default shadow-xl background-default shadow-default text-default 3md:block rounded-2xl 3md:bottom-0 3md:left-0 bottom-0 top-20  z-10 m-5 open transition-all" >
        <input onChange={TaskInputChanged} tabIndex={0} type="text" onKeyDown={InputKeyDown} id="taskInput" placeholder="A new task" className="m-4 border-default hide-outline background-default active:scale-90 shadow-default-hover h-10 p-2 text-xl rounded-lg"></input>
        <span id="taskInputTip" className="text-default opacity-50 mx-4 hidden">Press enter to add this task.</span>
        <div id="tasksDiv">
            {tasks.map((task)=><div onClick={()=>removeTask(task)} className="m-4 flex items-center cursor-pointer shadow-default-hover rounded-xl">
                        <span className="text-default p-2 text-sm">{task}</span>
                        </div>)}
        </div>
    </div>  
}


export {Tasks,LoadTasks,getTasks,changeTasks};