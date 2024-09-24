import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Switch } from "@renderer/components/ui/switch";
import { useEditorState } from "@renderer/context/editor-state";
import { cn } from "@renderer/lib/utils";

export default function FontStyleView(){
    const style = useEditorState((state)=>state.customizations);
    const setStyle = useEditorState((state)=>state.setCustomzations);
    const customFont = useEditorState((state)=>state.customizations.customFont);
    const setCustomFont = (fontName: string) => setStyle({...style, customFont: fontName});

    return <div className="rounded-2xl bg-view-1 p-1 ">
        <div className="flex [&>button]:rounded-xl [&>button]:w-full [&>button]:h-fit">
            <Button variant={"ghost"} onClick={()=>setStyle({...style, font: "sans"})} className={cn((style.font==="sans" || style.font==null) && "bg-primary hover:bg-primary/80")}>
                <div className="[&>span]:block">
                    <span className="font-sans text-3xl">Aa</span>
                    <span>Sans</span>
                </div>
            </Button>
            <Button variant={"ghost"} onClick={()=>setStyle({...style, font: "serif"})} className={cn((style.font==="serif") && "bg-primary hover:bg-primary/80")}>
                <div className="[&>span]:block">
                    <span className="font-serif text-3xl">Aa</span>
                    <span>Serif</span>
                </div>
            </Button>
            <Button variant={"ghost"} onClick={()=>setStyle({...style, font: "mono"})} className={cn((style.font==="mono") && "bg-primary hover:bg-primary/80")}>
                <div className="[&>span]:block">
                    <span className="font-mono text-3xl">Aa</span>
                    <span>Mono</span>
                </div>
            </Button>
            <Button variant={"ghost"} onClick={()=>setStyle({...style, font: "custom"})} className={cn((style.font==="custom") && "bg-primary hover:bg-primary/80")}>
                <div className="[&>span]:block">
                    <span className="font-sans text-3xl">A?</span>
                    <span>Custom</span>
                </div>
            </Button>
        </div>
        <div className="flex flex-col gap-4">
            <div className={cn("flex items-center gap-2 pt-2", style.font!=="custom" && "hidden")}>
                <Input value={customFont} onChange={(e)=>{setCustomFont(e.target.value)}} className="bg-secondary/25 rounded-xl" id="customFont" placeholder="Custom font name"/>
            </div>
        </div>
    </div>
}