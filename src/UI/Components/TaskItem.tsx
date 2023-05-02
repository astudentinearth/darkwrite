import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useContext } from "react"
import { TasksContext } from "../Tasks"

export interface TaskItemProps{
    id: string
    content: string
    completed: boolean
    index: number
    type: string
}

export function TaskItem(props:TaskItemProps){
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: props.id});
    const {tasks, setTasks} = useContext(TasksContext);
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }
    return <div ref={setNodeRef} style={style} {...attributes} {...listeners}
    className="task-item transition-colors">
        <div onClick={()=>{
            const currentTasks = [...tasks];
            for (const t of currentTasks){
                if(t.id!==props.id) continue;
                t.completed = t.completed ? false : true;
            }
            setTasks(currentTasks);
        }}
        style={props.completed ? {background: "rgb(var(--accent))"} : {}} className="w-5 h-5 ml-2 flex items-center justify-center rounded-md bg-secondary/75 hover:brigtness-125 cursor-pointer checkbox checkbox-shadow">
            {props.completed ? <i className="bi-check-lg text-white checkbox"></i> : ""}
        </div>
        <span className="text-default p-2 text-md">{props.content}</span>
        <div onClick={(event)=>{
            event?.stopPropagation();
            const currentTasks=[...tasks];
            for (const t of currentTasks){
               if(t.id===props.id){
                    currentTasks.splice(currentTasks.indexOf(t),1);
               } 
            }
            setTasks(currentTasks);
        }} className="task-delete-button ignore-drag ml-auto mr-4 hover:bg-secondary/20 cursor-pointer rounded-md p-1 w-6 h-6 flex items-center justify-center"><i className="bi-x-lg ignore-drag"></i></div>
    </div>
}