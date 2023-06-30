import { Sidebar } from "./components/sidebar/Sidebar";

export default function MainLayout(){
    return <div className="absolute left-0 right-0 bottom-0 top-0 flex flex-row bg-base p-2">
        <Sidebar></Sidebar>
    </div>
}