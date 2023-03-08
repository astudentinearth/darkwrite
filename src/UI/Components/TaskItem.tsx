import { FC, useRef } from "react"
import { useDrop,useDrag } from "react-dnd"
import { Identifier, XYCoord } from "dnd-core"
import { DraggableTypes } from "../../Util"

export interface TaskItemProps{
    id: string
    content: string
    completed: boolean
    index: number
    reorder: (dragIndex: number, hoverIndex: number) => void
    type: string
}

export const TaskItem: FC<TaskItemProps> = ({id,content,completed,index,reorder,type})=>{
    const ref = useRef<HTMLDivElement>(null);
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
        <div 
        style={completed ? {background: "rgb(var(--accent))"} : {}} className="w-5 h-5 ml-2 flex items-center justify-center rounded-md bg-secondary/75 hover:brigtness-125 cursor-pointer checkbox">
            {completed ? <i className="bi-check-lg text-white"></i> : ""}
        </div>
        <span className="text-default p-2 text-md">{content}</span>
        <div onClick={()=>{/*removeTask(item.id)*/}} className="task-delete-button ml-auto mr-4 hover:bg-secondary/20 cursor-pointer rounded-md p-1 w-6 h-6 flex items-center justify-center"><i className="bi-x-lg"></i></div>
    </div>
}
