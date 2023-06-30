import { ReactNode, Ref } from "react";

interface DialogProps{
    children: ReactNode,
    reference: Ref<HTMLDivElement>
}

export function Dialog(props: DialogProps){
    return <div ref={props.reference} className="absolute backdrop-blur-md hidden items-center justify-center left-0 right-0 top-0 bottom-0 bg-black/50 z-[200]">
        <div className="bg-primary p-2 rounded-2xl box-shadow-4-8-20 flex">
            {props.children}
        </div>
    </div>
}