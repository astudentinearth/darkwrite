import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { BubbleButton } from "./bubble-button";
import { useEditor } from "novel";
import { ChevronDown, Heading1, Heading2, Heading3, Heading4 } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Dispatch, ReactNode, SetStateAction } from "react";

export function HeadingSelector(props: {open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
    const {editor} = useEditor();
    const h1Active = editor?.isActive("heading", {level: 1}); 
    const h2Active = editor?.isActive("heading", {level: 2}); 
    const h3Active = editor?.isActive("heading", {level: 3}); 
    const h4Active = editor?.isActive("heading", {level: 4});
    let icon = <Heading1/>;
    if (h1Active) icon = <Heading1/>;
    else if (h2Active) icon = <Heading2/>;
    else if (h3Active) icon = <Heading3/>;
    else if (h4Active) icon = <Heading4/>;

    const item = (icon: ReactNode, text: string, callback: ()=>void) => {
            return <Button variant={"ghost"} className="px-1 py-0" onClick={()=>{props.setOpen(false); callback();}}>
                <div className="flex gap-2 items-center">
                    <div className="p-1 border-border border rounded-md">
                        {icon}
                    </div>
                    <span>{text}</span>
                </div>
            </Button>
    }

    return <Popover open={props.open} onOpenChange={props.setOpen} modal>
        <PopoverTrigger asChild>
            <Button variant="ghost" size={"bubble"} className="rounded-none w-fit gap-1 px-2">
                {icon}
                <ChevronDown size={16}/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 flex flex-col w-fit rounded-lg">
            {item(<Heading1/>, "Heading 1", ()=>{editor?.chain().toggleHeading({level: 1}).run()})}
            {item(<Heading2/>, "Heading 2", ()=>{editor?.chain().toggleHeading({level: 2}).run()})}
            {item(<Heading3/>, "Heading 3", ()=>{editor?.chain().toggleHeading({level: 3}).run()})}
            {item(<Heading4/>, "Heading 4", ()=>{editor?.chain().toggleHeading({level: 4}).run()})}
        </PopoverContent>
    </Popover>
}