import { useContext } from "react";
import { GenerateID, NoteInfo } from "../Util";
import { ActiveNotebookContext } from "./ActiveNotebookContext";
import SearchBox from "./Components/SearchBox";
import ToolbarButton from "./Components/ToolbarButton";
import { ShowNoteEditor } from "./NoteEditor";
import { ShowSettings } from "./Settings";

const TemplateNoteInfo: NoteInfo= {
	id: "0",
	notebookID: "0",
	formatting: {
		background: "#393939",
		foreground: "#ffffff",
		font: "Roboto"
	},
	pinned: false,
	title: "New Note",
	content: ""
}

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
		}} style={{float:"left"}} icon="bi-layout-sidebar"></ToolbarButton>
		<ToolbarButton onClick={()=>{ShowNoteEditor({...TemplateNoteInfo, id: GenerateID(), notebookID: notebookID})}} color="accent" style={{float:"left"}} icon="bi-plus-lg"></ToolbarButton>
		<ToolbarButton onClick={()=>{ShowSettings();}} style={{float:"right"}} icon="bi-gear"></ToolbarButton>
		<SearchBox></SearchBox>
	</div>;
}

export default MainToolbar;
