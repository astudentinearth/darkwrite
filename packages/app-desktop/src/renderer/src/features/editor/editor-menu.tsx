import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@renderer/components/ui/dropdown-menu";
import { CustimzationSheet } from "./customization-sheet";
import { Button } from "@renderer/components/ui/button";
import { Brush, Copy, Download, Menu, Upload } from "lucide-react";
import { useState } from "react";

export function EditorMenu(){
    const [customizationsOpen, setCustomizationsOpen] = useState(false);
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className={"rounded-xl p-0 size-8"} variant={"ghost"}>
                <Menu size={20}/>
            </Button>
        </DropdownMenuTrigger>
        <CustimzationSheet open={customizationsOpen} onOpenChange={setCustomizationsOpen}/>
        { /* TODO: Unify dropdown menu item style */}
        <DropdownMenuContent className="mr-3 mt-1 rounded-xl bg-card">
            <DropdownMenuItem className="gap-2 rounded-lg" onSelect={()=>setCustomizationsOpen(true)}><Brush size={18}/>Customize</DropdownMenuItem>
            <DropdownMenuItem disabled className="gap-2 rounded-lg"><Download size={18}/>Export</DropdownMenuItem>
            <DropdownMenuItem disabled className="gap-2 rounded-lg"><Upload size={18}/>Import</DropdownMenuItem>
            <DropdownMenuItem disabled className="gap-2 rounded-lg"><Copy size={18}/>Duplicate</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}