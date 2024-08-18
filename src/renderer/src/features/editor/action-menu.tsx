import { Button } from "@renderer/components/ui/button";
import { Expand, Menu, Star } from "lucide-react";
import { FavoriteActionButton } from "./action-favorite";

export function ActionMenu(){
    return <div className="bg-card opacity-50 transition-opacity hover:opacity-100 border-border border fixed right-3 mt-3 rounded-xl flex drop-shadow-xl">
        <Button className={"rounded-xl p-0 size-8"} variant={"ghost"}>
            <Expand size={20}/>
        </Button>
        <FavoriteActionButton/>
        <Button className={"rounded-xl p-0 size-8"} variant={"ghost"}>
            <Menu size={20}/>
        </Button>
    </div>
}