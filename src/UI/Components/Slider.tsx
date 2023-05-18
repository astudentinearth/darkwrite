import { CSSProperties, ChangeEvent, useEffect, useRef } from "react"

export interface SliderProps{
    onChange?: (event:ChangeEvent)=>unknown
    defaultValue?: number,
    min?: number,
    max?: number,
    style?: CSSProperties
}

export function Slider(props: SliderProps){
    const ref = useRef<HTMLInputElement>(null);
    useEffect(()=>{
        if(ref.current==null) return;
        const val = ((parseFloat(ref.current.value)-parseFloat(ref.current.min))/(parseFloat(ref.current.max)-parseFloat(ref.current.min)))*100
        ref.current.style.setProperty("background", `linear-gradient(to right, rgb(var(--accent)) 0%, rgb(var(--accent)) ${val}%, rgb(var(--widget)) ${val}% ,rgb(var(--widget)) 100%)`);
    },[]);
    return <input min={props.min ?? 0} style={props.style} max={props.max ?? 100} ref={ref} type="range" onChange={props.onChange} onInput={()=>{
        if(ref.current==null) return;
        const val = ((parseFloat(ref.current.value)-parseFloat(ref.current.min))/(parseFloat(ref.current.max)-parseFloat(ref.current.min)))*100
        ref.current.style.setProperty("background", `linear-gradient(to right, rgb(var(--accent)) 0%, rgb(var(--accent)) ${val}%, rgb(var(--widget)) ${val}% ,rgb(var(--widget)) 100%)`);
    }} defaultValue={props.defaultValue} className="slider"></input>
}
