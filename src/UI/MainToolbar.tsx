import { readTextFile } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import { GlobalSettings } from "../GlobalSettings";
import { Themes ,SwitchTheme,APPDIR} from "../Theme";
import ToolbarButton from "./Components/ToolbarButton";
import { ShowSettings } from "./Settings";

function ShowTasks(){
	let TaskPanel:any = document.getElementById("TaskPanel");
	let NotesPanel:any = document.getElementById("NotesPanel");
	if(TaskPanel.classList.contains("open")){
		TaskPanel.classList.remove("open");
		TaskPanel.style.setProperty("display","none");
		NotesPanel.style.setProperty("left","0px");
	}
	else{
		TaskPanel.style.setProperty("display","block");
		TaskPanel.classList.add("open");
		NotesPanel.style.setProperty("left","20rem");
	}
}
function MainToolbar(){
	return <div className="main_toolbar inline-block text-default transition-all h-14 m-4 absolute left-0 right-0 bottom-0 top-0 duration-500">
		<ToolbarButton float="float-left" icon="bi-list-task" onClick={ShowTasks}></ToolbarButton>
		<ToolbarButton float="float-left" icon="bi-plus-lg"></ToolbarButton>
		<input type="text" placeholder="Type here to search" className="background-secondary transition-all hide-outline active:scale-90 shadow-default-hover h-14 w-80 p-6 text-xl rounded-2xl m-1"></input>
		<ToolbarButton float="float-right" icon="bi-list" onClick={()=>ShowSettings()}></ToolbarButton>
    </div>;
}

export default MainToolbar;