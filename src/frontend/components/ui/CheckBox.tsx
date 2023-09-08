import {ChangeEvent, useEffect, useState} from "react"
import "./CheckBox.css"

interface CheckBoxProps{
    onChange?:(value?: boolean)=>void;
    checked?:boolean;
    disabled?:boolean;
}

export function CheckBox(props: CheckBoxProps){
    const [checked, setChecked] = useState(props.checked as boolean);
    function handleClick(){
        if(props.disabled) return;
        setChecked(!checked);
        if(props.onChange!=null) props.onChange(!checked);
    }
    useEffect(()=>{
        
    },[checked]);
    return <div onClick={handleClick} className={`checkbox flex justify-center items-center transition-[background,filter] w-6 h-6 rounded-md ${props.disabled ? "bg-widget-disabled" : (checked ? "bg-primary hover:brightness-110 active:brightness-125" : "bg-widget hover:bg-widget-hover active:bg-widget-active")}`}>
        {checked ? <i className={`bi-check text-[20px] ${props.disabled ? "text-text-default" : "text-white"}`}></i> : <></>}
    </div>
}