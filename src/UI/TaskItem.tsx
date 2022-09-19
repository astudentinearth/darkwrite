import React from "react";
import { getTasks,changeTasks } from "./Tasks";
function TaskItem(props:any){
    return <div onClick={props.onClick} className="m-4 flex items-center cursor-pointer shadow-default-hover rounded-xl">

        <span className="text-default p-2 text-sm">{props.text}</span>
        
    </div>
}

/*function removeTask(text:any){
    let tasksDiv:any = document.getElementById("tasksDiv");
    let childrenArray = Array.from(tasksDiv.children);
    let i:number=0;
    childrenArray.forEach((element:any)=>{
        let span:any = element.querySelector("span");
        if(span.innerText==taskText){
            return;
        }
        i++;
    }); 
    let currentTasks=getTasks();
    console.log(currentTasks);
    currentTasks.splice(currentTasks.indexOf(text),1);
    changeTasks(currentTasks);
}
*/
export default TaskItem;