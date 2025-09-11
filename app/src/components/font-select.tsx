import useFonts from "@/query/use-fonts";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FontSelect(props: {
  value?: string;
  onValueChange?: (val: string) => void;
  className?: string;
}) {
  const fonts = useFonts().data;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const items = useMemo(
    () =>
      fonts
        .filter((f) => f.family.toLowerCase().includes(query.toLowerCase()))
        .map((f) => (
          <Button
            variant={"ghost"}
            key={`item-${f.family}`}
            onClick={() => {
              props.onValueChange?.call(undefined, f.family);
              setOpen(false);
            }}
            className="py-2 h-fit px-3 rounded-lg hover:bg-secondary flex items-center justify-start w-full"
          >
            {f.family.replace(/"/g, "")}
          </Button>
        )),
    [fonts, props.onValueChange, query],
  );
  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={cn("w-fit h-fit", props.className)}>
          {props.value?.replaceAll('"', "") ?? "Choose font"} <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="overflow-hidden p-1 w-80 flex flex-col gap-2"
      >
        <Input
          placeholder="Search fonts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="scroll-view overflow-y-auto h-72 grow select-none"> {items}</div>
      </PopoverContent>
    </Popover>
  );
}
