import { useEffect, useRef, useState } from "react";

const [MIN_WIDTH, DEFAULT_WIDTH, MAX_WIDTH] = [180, 240, 400]

export default function Layout(){
    // component state
    const [width, setWidth] = useState(DEFAULT_WIDTH);
    const initialX = useRef(0);
    const isResizing = useRef(false);
    
    // clamp the width between min and max
    const calculateWidth = (previous:number, change: number) => (previous + change > MAX_WIDTH || previous + change < MIN_WIDTH) ? (previous + change > MAX_WIDTH ? MAX_WIDTH : MIN_WIDTH) : previous + change;
    
    // add event listeners
    useEffect(()=>{
        window.addEventListener("mousemove", 
            (e: MouseEvent)=>{
                if(isResizing.current) {
                    if(e.clientX > MAX_WIDTH) return // only allow resizing between min and max range
                    if(e.clientX < MIN_WIDTH) return
                    const change = e.clientX - initialX.current; // calculate change in position
                    setWidth((w)=>{return calculateWidth(w, change)})
                    initialX.current = e.clientX; // update initial position for next event
                }})
        window.addEventListener("mouseup", ()=>isResizing.current=false)
    }, []);

    // enter resize mode if handle triggers mouse down
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>)=>{
        initialX.current = e.clientX;
        isResizing.current = true;
    }

    return <div className="flex [&>div]:flex-shrink-0 w-full h-full bg-view-1">
        <div className='bg-background h-full flex flex-col' style={{width: `${width}px`}}>
            <div className='titlebar w-full h-9 bg-background'></div>
            <h1>Sidebar</h1>
          </div>
        <div onMouseDown={handleMouseDown} className="w-[1px] bg-border h-full flex cursor-ew-resize resize-handle relative"></div>
        <div className='h-full flex flex-col flex-grow'>
            <div className='titlebar w-full h-9 bg-background'></div>
            Editor
        </div>
    </div>
}