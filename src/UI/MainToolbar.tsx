import React, { useRef } from "react";
import SearchBox from "./Components/SearchBox";
import ToolbarButton from "./Components/ToolbarButton";
import { ShowSettings } from "./Settings";


function MainToolbar(props:any){
	/**
	 * Returns the main page toolbar
	 */
	return <div className="text-default transition-all 
	h-14 p-1 absolute
	drop-shadow-xl left-0 right-0 bottom-0 top-0 duration-200 
	text-center items-center">
		<ToolbarButton onClick={()=>{
			const sidebar =document.getElementById("sidebar");
			if(sidebar?.classList.contains("open")) sidebar?.classList.remove("open");
			else sidebar?.classList.add("open");
		}} style={{float:"left"}} icon="bi-layout-sidebar"></ToolbarButton>
		<ToolbarButton color="accent" style={{float:"left"}} icon="bi-plus-lg"></ToolbarButton>
		<ToolbarButton onClick={()=>{ShowSettings();}} style={{float:"right"}} icon="bi-gear"></ToolbarButton>
		<SearchBox></SearchBox>
	</div>;
}

export default MainToolbar;