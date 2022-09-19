import React, { useEffect } from "react";

function Menu(){
    return <div tabIndex={0} id="CornerMenu" className="w-64 outline-none hidden rounded-2xl p-2 background-default text-default shadow-default top-20 absolute right-0 m-4 left-auto bottom-auto z-10">
        <div tabIndex={0}  className="cursor-pointer menu_item p-2 hover:bg-opacity-30 rounded-lg background-default">Settings</div>
        <div tabIndex={0} className="cursor-pointer menu_item p-2 hover:bg-opacity-30 rounded-lg background-default">About Darkwrite</div>
    </div>
}


export default Menu;