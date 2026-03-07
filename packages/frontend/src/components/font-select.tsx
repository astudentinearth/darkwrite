import useFonts from "@/features/themes/hooks/use-fonts";
import { useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOperatingSystem } from "@/lib/platform";
import { OS } from "@/common/os";
import { useTranslation } from "react-i18next";

export default function FontSelect(props: {
  value?: string;
  onValueChange?: (val: string) => void;
  className?: string;
}) {
  const fonts = useFonts();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null!);
  const { t } = useTranslation("translation", { keyPrefix: "ui.font" });
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

  const saveOnTextInput = (value: string) => {
    props.onValueChange?.call(undefined, value);
  };

  return getOperatingSystem() == OS.MACOS ? (
    <Input
      defaultValue={props.value}
      placeholder={t("typeFontName")}
      ref={inputRef}
      className={cn(
        "w-fit h-fit py-medium pl-large border-border/50 top-highlight",
        props.className,
      )}
      onKeyDown={(e) => {
        if (e.key === "Enter") saveOnTextInput(inputRef.current.value);
      }}
      onBlur={(e) => saveOnTextInput(e.target.value)}
    />
  ) : (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-fit h-fit", props.className)}
        >
          {props.value?.replaceAll('"', "") ?? t("placeholder")}{" "}
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="overflow-hidden p-1 w-80 flex flex-col gap-2"
      >
        <Input
          placeholder={t("search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="scroll-view overflow-y-auto h-72 grow select-none">
          {" "}
          {items}
        </div>
      </PopoverContent>
    </Popover>
  );
}
