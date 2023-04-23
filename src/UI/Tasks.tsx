import { invoke } from "@tauri-apps/api";
import update from 'immutability-helper'
import React, { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { BaseDirectory, exists, readTextFile, writeFile } from "@tauri-apps/api/fs";
import { DraggableTypes, GenerateID, ITask, JSONToITaskArray } from "../Util";
import { TaskItem } from "./Components/TaskItem";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core/dist/types";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
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
    console.log("[INFO from LoadTasks()] Loading tasks");
    if(!await exists("tasks.json",{dir: BaseDirectory.App})){
        console.log("[WARNING] Tasks file not found. Initializing a file with no tasks");
        await writeFile("tasks.json",`{"tasks":[]}`,{dir: BaseDirectory.App});
        return [] as ITask[];
    }
    console.log("[INFO from LoadTasks()] Reading tasks file");
    let tasksFile:string=await readTextFile("tasks.json",{dir: BaseDirectory.App});
    let tasksJSON=JSON.parse(tasksFile);
    return JSONToITaskArray(tasksJSON) ?? [] as ITask[];
}

export async function SaveTasks(){
    console.log("[INFO from SaveTasks()] Saving tasks");
    await writeFile("tasks.json",JSON.stringify({tasks:getTasks()}),{dir: BaseDirectory.App});
}
//@ts-ignore
class TasksPointerSensor extends PointerSensor{
    static activators = [{
            eventName: 'onPointerDown',
            handler: ({nativeEvent: event} : React.PointerEvent<Element>) =>{
                if (!(event.target instanceof Element)) return;
                if(!event.isPrimary || event.button!==0 || isInteractiveElement([...(event.target as Element).classList] as string[])){
                    return false;
                }
                return true;
            },
        },
    ];
}

function isInteractiveElement(elementClassNames: string[]){
    const interactiveElements = ["checkbox","task-delete-button","ignore-drag"];
    console.log(elementClassNames);
    for(let name of elementClassNames){
        if (interactiveElements.includes(name)) return true;
    }
    return false;
}

function Tasks(){
    const [tasks,setTasks] = useState([] as ITask[]);
    //@ts-ignore
    const sensors = useSensors(useSensor(TasksPointerSensor))
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
    const reorder = (event: DragEndEvent)=>{
        const {active,over} = event;
        if(!over) return;
        if (active.id !== over.id){
            setTasks((tasks)=>{
                const oldIndex = tasks.map(function (e){return e.id}).indexOf(active.id.toString());
                const newIndex = tasks.map(function (e){return e.id}).indexOf(over.id.toString());
                return arrayMove(tasks,oldIndex,newIndex);
            })
            SaveTasks();
        }
    }
    const renderTask = useCallback((todo: ITask, index:number)=>{
        return ( <TaskItem index={index} 
        content={todo.content} 
        id={todo.id} 
        completed={todo.completed}
        type={"todo"}
        key={todo.id}></TaskItem>)
    },[])
    return <div id="TaskPanel" className="w-72 flex flex-col overflow-x-hidden flex-[1_1_auto] overflow-y-auto min-h-0 relative text-default z-10 transition-all" >
       <TasksContext.Provider value={{tasks, setTasks}}>
            <div className="flex h-12 flex-[0_1_auto] w-72">
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
            <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={reorder}
            modifiers={[restrictToVerticalAxis]}>
                <SortableContext
                items={tasks}
                strategy={verticalListSortingStrategy}>
                    <div id="tasksDiv" className="flex-[1_0_auto]">
                        {tasks.map((task,i)=>renderTask(task,i))}
                    </div>
                </SortableContext>
            </DndContext>
       </TasksContext.Provider>
    </div>  
}


export {Tasks,LoadTasks,getTasks,changeTasks};
