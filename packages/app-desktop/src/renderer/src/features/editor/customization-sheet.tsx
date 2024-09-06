import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Sheet, SheetContent, SheetTitle } from "@renderer/components/ui/sheet";
import { Switch } from "@renderer/components/ui/switch";
import { RotateCcw } from "lucide-react";

export function CustimzationSheet(props: {open: boolean, onOpenChange: (boolean)=>void}){
    return <Sheet open={props.open} onOpenChange={props.onOpenChange}>
        <SheetContent className="pt-10 flex flex-col gap-4">
            <SheetTitle className="text-2xl">Customize</SheetTitle>
            {/* Style chooser */}
            <div className="rounded-2xl bg-view-1 p-1 ">
                <div className="flex [&>button]:rounded-xl [&>button]:w-full [&>button]:h-fit">
                    <Button variant={"ghost"}>
                        <div className="[&>span]:block">
                            <span className="font-sans text-3xl">Aa</span>
                            <span>Sans</span>
                        </div>
                    </Button>
                    <Button variant={"ghost"}>
                        <div className="[&>span]:block">
                            <span className="font-serif text-3xl">Aa</span>
                            <span>Serif</span>
                        </div>
                    </Button>
                    <Button variant={"ghost"}>
                        <div className="[&>span]:block">
                            <span className="font-mono text-3xl">Aa</span>
                            <span>Mono</span>
                        </div>
                    </Button>
                    <Button variant={"ghost"}>
                        <div className="[&>span]:block">
                            <span className="font-sans text-3xl">A?</span>
                            <span>Custom</span>
                        </div>
                    </Button>
                </div>
                <div className="p-1 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Input className="bg-secondary/25 rounded-xl" id="customFont" placeholder="Custom font name"/>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch id="largeText"/>
                        <Label htmlFor="largeText">Use large text</Label>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl bg-view-1 p-2 flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="flex-shrink-0 font-medium">Background color</span>
                    <div className="w-full"></div>
                    <Input placeholder="Default" className="h-8 w-24"/>
                    <Button className="flex-shrink-0 hover:bg-secondary/50" size={"icon32"} variant={"outline"}><RotateCcw size={18} className="opacity-75"/></Button>
                </div>
                <div className="flex items-center gap-1">
                    <span className="flex-shrink-0 font-medium">Default text color</span>
                    <div className="w-full"></div>
                    <Input placeholder="Default" className="h-8 w-24"/>
                    <Button className="flex-shrink-0 hover:bg-secondary/50" size={"icon32"} variant={"outline"}><RotateCcw size={18} className="opacity-75"/></Button>
                </div>
            </div>
        </SheetContent>
    </Sheet>
}