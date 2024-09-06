import { Button } from "@renderer/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@renderer/components/ui/sheet";

export function CustimzationSheet(props: {open: boolean, onOpenChange: (boolean)=>void}){
    return <Sheet open={props.open} onOpenChange={props.onOpenChange}>
        <SheetContent className="pt-10 flex flex-col gap-2">
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
                <div className="p-1">
                    
                </div>
            </div>
        </SheetContent>
    </Sheet>
}