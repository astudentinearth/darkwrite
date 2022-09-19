import { readTextFile } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import { GlobalSettings } from "../GlobalSettings";
import { Themes ,SwitchTheme,APPDIR} from "../Theme";

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
		<div onClick={ShowTasks} className="h-14 transition-all border-default active:scale-90 w-14 float-left m-1 rounded-2xl flex cursor-pointer shadow-default-hover background-default align-middle justify-center items-center"><i className="bi-list-task text-default text-3xl"></i></div>
		<div className="h-14 active:scale-90 transition-all w-14 border-default float-left m-1 rounded-2xl flex cursor-pointer shadow-default-hover background-default align-middle justify-center items-center"><i className="bi-plus-lg text-default text-3xl"></i></div>
		<input type="text" placeholder="Type here to search" border-default className="background-default transition-all hide-outline active:scale-90 shadow-default-hover h-14 w-80 p-6 text-xl rounded-2xl m-1"></input>
		<div onClick={ShowSettings} className="h-14 active:scale-90 w-14 transition-all border-default float-right m-1 rounded-2xl flex cursor-pointer shadow-default-hover background-default align-middle justify-center items-center"><i className="bi-list text-default text-3xl"></i></div>
 
		<div onClick={SwitchTheme} className="h-14 transition-all active:scale-90 w-14 border-default float-right m-1 rounded-2xl cursor-pointer shadow-default-hover  hidden background-default align-middle justify-center items-center"><i className="bi-moon text-default text-3xl"></i></div>
		   </div>;
}
function ShowSettings(){
	let settings:any = document.getElementById("settingsUI");
	let lightSchemeChooser:any=document.getElementById("lightColorScheme");
	let darkSchemeChooser:any=document.getElementById("darkColorScheme");
	while (lightSchemeChooser.firstChild){ 
		lightSchemeChooser.removeChild(lightSchemeChooser.lastChild);
	}
	while (darkSchemeChooser.firstChild){
		darkSchemeChooser.removeChild(darkSchemeChooser.lastChild);
	}
	
	invoke("listdir",{dir:APPDIR+"color-schemes/"}).then((ret:any)=>{
		console.log(ret);
		let lightThemeIndex:Number=0;
		let darkThemeIndex:Number=0;
		ret.forEach((element:any) => {
			console.log(element);
			readTextFile(APPDIR+"color-schemes/"+element).then((read:string)=>{
				let scheme_json:any=JSON.parse(read);
				let _opt = document.createElement("option");
				
				_opt.label=scheme_json.name;
				_opt.value=element;

				let __opt = document.createElement("option");
			   
				__opt.label=scheme_json.name;
				__opt.value=element;
				lightSchemeChooser.appendChild(__opt);
				darkSchemeChooser.appendChild(_opt);
				if(GlobalSettings.LightSchemeFile==element){
					lightSchemeChooser.selectedIndex=lightSchemeChooser.options.length-1;
				}
				if(GlobalSettings.DarkSchemeFile==element){
					darkSchemeChooser.selectedIndex=darkSchemeChooser.options.length-1;
				}//
			});
		});
		let fontinput:any=document.getElementById("fontBox");
		fontinput.value=GlobalSettings.Font;
		settings.style.setProperty("display","block");
	});

   

}
export default MainToolbar;