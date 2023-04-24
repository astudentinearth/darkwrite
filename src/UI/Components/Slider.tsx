import { CSSProperties, ChangeEvent, useRef } from "react"

export interface SliderProps{
    onChange?: (event:ChangeEvent)=>any
    defaultValue?: number,
    min?: number,
    max?: number,
    style?: CSSProperties
}

export function Slider(props: SliderProps){
    let ref = useRef<HTMLInputElement>(null);
    return <input min={props.min ?? 0} style={props.style} max={props.max ?? 100} ref={ref} type="range" onChange={props.onChange} onInput={()=>{
        if(ref.current==null) return;
        let val = ((parseFloat(ref.current.value)-parseFloat(ref.current.min))/(parseFloat(ref.current.max)-parseFloat(ref.current.min)))*100
        ref.current.style.setProperty("background", `linear-gradient(to right, rgb(var(--accent)) 0%, rgb(var(--accent)) ${val}%, rgb(var(--background-secondary)) ${val}% ,rgb(var(--background-secondary)) 100%)`);
    }} defaultValue={props.defaultValue} className="slider"></input>
}
