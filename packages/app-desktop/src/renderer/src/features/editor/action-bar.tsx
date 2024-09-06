import { Button } from "@renderer/components/ui/button";
import { Expand } from "lucide-react";
import { FavoriteActionButton } from "./action-favorite";
import { EditorMenu } from "./editor-menu";

export function ActionBar(){
    return <div className="bg-card opacity-50 transition-opacity hover:opacity-100 border-border border fixed right-3 mt-3 rounded-xl flex drop-shadow-xl">
        <Button className={"rounded-xl p-0 size-8"} variant={"ghost"}>
            <Expand size={20}/>
        </Button>
        <FavoriteActionButton/>
        <EditorMenu/>
    </div>
}