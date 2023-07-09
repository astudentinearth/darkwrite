import { CSSProperties, ReactNode } from "react"

/**
 * Properties for Button element
 */
export interface ButtonProps{
    style?: CSSProperties,
    onClick?: ()=>void,
    children?: ReactNode | string,
    CTA?: boolean,
    disabled?: boolean
}

const CTAClassNames = "bg-primary hover:brightness-[120%] active:brightness-110 text-white"
const DefaultClassNames = "bg-widget hover:bg-widget-hover active:bg-widget-active text-text-default default-outline"
const DisabledClassNames = "bg-widget-disabled default-outline text-text-disabled"

/**
 * 
 * @param props Properties for button. onClick, CTA, disabled, style
 * @returns <button>
 */
export function Button(props:ButtonProps){
    return <button disabled={props.disabled}
    className={`w-40 h-8 
    rounded-lg ${props.disabled ? DisabledClassNames :(props.CTA ? CTAClassNames : DefaultClassNames)}
    transition-all cursor-default text-text-default`}
    style={props.style} onClick={props.onClick}>
        {props.children}
    </button>
}