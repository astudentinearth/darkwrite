import { CSSProperties, ChangeEventHandler, KeyboardEventHandler } from "react";

export interface TextBoxProps{
    onChange?: ChangeEventHandler,
    onBlur?: ()=>void,
    defaultValue?: string,
    onKeyDown?: KeyboardEventHandler,
    disabled?: boolean,
    style?: CSSProperties
}

export function TextBox(props: TextBoxProps){
    return <input 
    className="p-1 h-8 rounded-lg bg-widget text-text-default default-outline outline-none
    enabled:hover:bg-widget-hover enabled:active:bg-widget-active enabled:active:active-outline
    enabled:focus:bg-widget-active enabled:focus:active-outline transition-colors
    disabled:widget-disabled disabled:text-text-disabled disabled:select-none"
    {...props}></input>
}