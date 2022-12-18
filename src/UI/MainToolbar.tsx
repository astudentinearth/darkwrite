import React from "react";
import { GenerateID } from "../Util";
import SearchBox from "./Components/SearchBox";
import ToolbarButton from "./Components/ToolbarButton";
import { ShowSettings } from "./Settings";
import {showEditor} from "./NotesPanel"

function MainToolbar(props:any){
	/**
	 * Returns the main page toolbar
	 */
	return <div className="text-default transition-all 
	h-14 p-1 fixed z-20
	drop-shadow-md left-0 right-0 bottom-0 top-0 duration-200 
	text-center items-center">
		<ToolbarButton onClick={()=>{
			const notesPanel = document.getElementById("NotesPanel");
                        const noteEditor = document.getElementById("noteEditDialog");
			const sidebar =document.getElementById("sidebar");
			if(sidebar?.classList.contains("open")) {
				sidebar?.classList.remove("open");
				notesPanel?.style.setProperty("left","8px");
                                noteEditor?.style.setProperty("left","8px");
			}
			else {
				sidebar?.classList.add("open");
				notesPanel?.style.setProperty("left","20rem");
			        noteEditor?.style.setProperty("left","20rem");
                        };
			
			
		}} style={{float:"left"}} icon="bi-layout-sidebar"></ToolbarButton>
		<ToolbarButton onClick={()=>{showEditor(GenerateID())}} color="accent" style={{float:"left"}} icon="bi-plus-lg"></ToolbarButton>
		<ToolbarButton onClick={()=>{ShowSettings();}} style={{float:"right"}} icon="bi-gear"></ToolbarButton>
		<SearchBox></SearchBox>
	</div>;
}

export default MainToolbar;
