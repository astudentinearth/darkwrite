import { FC, useContext, useRef } from "react"
import { useDrop,useDrag } from "react-dnd"
import { Identifier, XYCoord } from "dnd-core"
import { DraggableTypes } from "../../Util"
import { SaveTasks, TasksContext } from "../Tasks"
import { useSortable } from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"

export interface TaskItemProps{
    id: string
    content: string
    completed: boolean
    index: number
    type: string
}

/*export const TaskItem: FC<TaskItemProps> = ({id,content,completed,index,reorder,type})=>{
    const ref = useRef<HTMLDivElement>(null);
    const {tasks, setTasks} = useContext(TasksContext);
    const [{handlerId},drop] = useDrop<
    TaskItemProps,
    void,
    {handlerId: Identifier | null}>({
        accept: DraggableTypes.TASK,
        collect(monitor) {
            return {handlerId: monitor.getHandlerId(),}
        },
        hover(item: TaskItemProps, monitor) {
            if(!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;
            const hoverRect = ref.current.getBoundingClientRect();
            const hoverMidY = (hoverRect.bottom - hoverRect.top) /2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMidY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMidY) return;
            reorder(dragIndex,hoverIndex);
            item.index=hoverIndex;
        },
    })
    const [{isDragging}, drag] = useDrag({
        type: DraggableTypes.TASK,
        item: ()=>{return {id,index}},
        collect: (monitor: any) =>({
            isDragging: monitor.isDragging()
        }),
    })
    drag(drop(ref));
    return <div ref={ref} data-handler-id={handlerId}
    className="task-item transition-colors">
        <div onClick={()=>{
            let currentTasks = [...tasks];
            for (let t of currentTasks){
                if(t.id!==id) continue;
                t.completed = t.completed ? false : true;
            }
            setTasks(currentTasks);
            SaveTasks();
        }}
        style={completed ? {background: "rgb(var(--accent))"} : {}} className="w-5 h-5 ml-2 flex items-center justify-center rounded-md bg-secondary/75 hover:brigtness-125 cursor-pointer checkbox">
            {completed ? <i className="bi-check-lg text-white"></i> : ""}
        </div>
        <span className="text-default p-2 text-md">{content}</span>
        <div onClick={()=>{
            let currentTasks=[...tasks];
            for (let t in currentTasks){
               if(currentTasks[t].id===id){
                    currentTasks.splice(parseInt(t),1);
               } 
            }
            setTasks(currentTasks);
            SaveTasks();
        }} className="task-delete-button ml-auto mr-4 hover:bg-secondary/20 cursor-pointer rounded-md p-1 w-6 h-6 flex items-center justify-center"><i className="bi-x-lg"></i></div>
    </div>
}*/


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
            let currentTasks = [...tasks];
            for (let t of currentTasks){
                if(t.id!==props.id) continue;
                t.completed = t.completed ? false : true;
            }
            setTasks(currentTasks);
            SaveTasks();
        }}
        style={props.completed ? {background: "rgb(var(--accent))"} : {}} className="w-5 h-5 ml-2 flex items-center justify-center rounded-md bg-secondary/75 hover:brigtness-125 cursor-pointer checkbox checkbox-shadow">
            {props.completed ? <i className="bi-check-lg text-white checkbox"></i> : ""}
        </div>
        <span className="text-default p-2 text-md">{props.content}</span>
        <div onClick={(event)=>{
            event?.stopPropagation();
            let currentTasks=[...tasks];
            for (let t in currentTasks){
               if(currentTasks[t].id===props.id){
                    currentTasks.splice(parseInt(t),1);
               } 
            }
            setTasks(currentTasks);
            SaveTasks();
        }} className="task-delete-button ignore-drag ml-auto mr-4 hover:bg-secondary/20 cursor-pointer rounded-md p-1 w-6 h-6 flex items-center justify-center"><i className="bi-x-lg ignore-drag"></i></div>
    </div>
}