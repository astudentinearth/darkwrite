import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "@renderer/components/ui/command";
import { useNotesStore } from "@renderer/context/notes-context";
import { useNavigateToNote } from "@renderer/hooks/use-navigate-to-note";
import { fromUnicode } from "@renderer/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function SearchDialog(props: {open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}){
    const notes = useNotesStore((state)=>state.notes.filter((n)=>!n.isTrashed));
    const {open, setOpen} = props;
    const [search, setSearch] = useState("");
    const nav = useNavigateToNote();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((open) => !open)
          }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
      }, [])

    return <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput value={search} onValueChange={setSearch} placeholder="Search your notes"/>
        <CommandList className="scrollbar p-1 pb-1">
            <CommandEmpty>No results</CommandEmpty>
            {notes.filter((n)=>n.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())).map((n)=>
                <CommandItem onSelect={()=>{nav(n.id); setOpen(false)}} key={n.id} value={`${n.id}$${n.title}`} className="flex gap-2">{fromUnicode(n.icon)}{n.title}</CommandItem>)}
        </CommandList>
    </CommandDialog>
}