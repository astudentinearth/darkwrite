import { OS } from "@darkwrite/common";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useFonts from "@/features/themes/hooks/use-fonts";
import { getOperatingSystem } from "@/lib/platform";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function FontSelect(props: {
  value?: string;
  onValueChange?: (val: string) => void;
  className?: string;
  systemDefault?: string;
}) {
  const fonts = useFonts();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  // biome-ignore lint/style/noNonNullAssertion: guaranteed ref
  const inputRef = useRef<HTMLInputElement>(null!);
  const { t } = useTranslation("translation", { keyPrefix: "ui.font" });
  const { t: _t } = useTranslation("translation");

  const FontItem = ({ family }: { family: string }) => (
    <Button
      variant={"ghost"}
      onClick={() => {
        props.onValueChange?.call(undefined, family);
        setOpen(false);
      }}
      className="py-1 h-fit px-2 rounded-md transition-none hover:bg-secondary flex items-center justify-start w-full"
    >
      {family === props.systemDefault
        ? _t("settings.fonts.systemDefault")
        : family.replace(/"/g, "")}
    </Button>
  );

  const items = fonts
    .filter((f) => f.family.toLowerCase().includes(query.toLowerCase()))
    .map((f) => <FontItem family={f.family} key={`item-${f.family}`} />);

  const saveOnTextInput = (value: string) => {
    props.onValueChange?.call(undefined, value);
  };

  return getOperatingSystem() === OS.MACOS ? (
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
          variant={"ghost"}
          className={cn(
            "w-fit max-w-1/2 h-fit outline-none outline-primary/50 py-medium pl-large pr-medium bg-secondary! dark:bg-secondary/50! border-border/50 top-highlight",
            open && "outline outline-solid outline-primary/50",
            props.className,
          )}
        >
          <span className="w-full flex text-ellipsis whitespace-nowrap overflow-hidden">
            {props.value === props.systemDefault
              ? _t("settings.fonts.systemDefault")
              : (props.value?.replaceAll('"', "") ?? t("placeholder"))}{" "}
          </span>
          <ChevronDown className="opacity-50" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="overflow-hidden rounded-lg p-1 w-80 flex flex-col gap-2"
      >
        <Input
          placeholder={t("search")}
          className="bg-secondary/50 top-highlight"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="scroll-view overflow-y-auto h-72 grow select-none">
          {props.systemDefault && <FontItem family={props.systemDefault} />}
          {items}
        </div>
      </PopoverContent>
    </Popover>
  );
}
