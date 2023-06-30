import { useContext } from "react";
import { GenerateID } from "../Util";
import { ActiveNotebookContext } from "../data/ActiveNotebookContext";
import SearchBox from "./components/SearchBox";
import ToolbarButton from "./components/ToolbarButton";
import { ShowNoteEditor } from "./NoteEditor";
import { ShowSettings } from "./Settings";
import { TemplateNoteInfo } from "./TemplateNoteInfo";

function MainToolbar(){
	/**
	 * Returns the main page toolbar
	 */
	const {notebookID} = useContext(ActiveNotebookContext);
	return <div className="text-default transition-all 
	h-14 z-20 
	duration-200 
	text-center items-center" id="mainToolbar">
		<ToolbarButton onClick={()=>{
			const sidebar =document.getElementById("sidebar");
			if(sidebar?.classList.contains("sidebar-open")) {
				sidebar?.classList.remove("sidebar-open");
				sidebar?.classList.add("sidebar-closed");
			}
			else {
				sidebar?.classList.remove("sidebar-closed");
				sidebar?.classList.add("sidebar-open");
            }
		}} style={{float:"left"}} icon="bi-layout-sidebar-inset"></ToolbarButton>
		<ToolbarButton onClick={()=>{ShowNoteEditor({...TemplateNoteInfo, id: GenerateID(), notebookID: notebookID})}} color="accent" style={{float:"left"}} icon="bi-plus-lg"></ToolbarButton>
		<ToolbarButton onClick={()=>{ShowSettings();}} style={{float:"right"}} icon="bi-gear-fill"></ToolbarButton>
		<SearchBox></SearchBox>
	</div>;
}

export default MainToolbar;
