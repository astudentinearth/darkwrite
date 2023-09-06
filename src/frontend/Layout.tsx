import { useState } from "react";
import { Sidebar } from "../features/sidebar";

export default function MainLayout(){
    const [dock, setDock] = useState(false);
    return <div className={`absolute left-0 transition-[padding] duration-100 right-0 bottom-0 top-0 flex flex-row bg-base ${dock ? "p-0" : "p-2"}`}>
        <Sidebar docked={dock}></Sidebar>
    </div>
}