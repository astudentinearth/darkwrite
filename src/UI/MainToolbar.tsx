import { GenerateID } from "../Util";
import SearchBox from "./Components/SearchBox";
import ToolbarButton from "./Components/ToolbarButton";
import { showEditor } from "./NotesPanel";
import { ShowSettings } from "./Settings";

function MainToolbar(){
	/**
	 * Returns the main page toolbar
	 */
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
		<ToolbarButton onClick={()=>{showEditor(GenerateID())}} color="accent" style={{float:"left"}} icon="bi-plus-lg"></ToolbarButton>
		<ToolbarButton onClick={()=>{ShowSettings();}} style={{float:"right"}} icon="bi-gear"></ToolbarButton>
		<SearchBox></SearchBox>
	</div>;
}

export default MainToolbar;
