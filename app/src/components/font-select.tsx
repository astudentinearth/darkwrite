import useFonts from "@/query/use-fonts";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function FontSelect(props: {
  value?: string;
  onValueChange?: (val: string) => void;
  className?: string;
}) {
  const fonts = useFonts().data;
  const items = useMemo(
    () =>
      fonts.map((f) => <SelectItem value={f.family}>{f.family}</SelectItem>),
    [fonts],
  );
  return (
    <Select value={props.value} onValueChange={props.onValueChange}>
      <SelectTrigger className={cn(props.className)}>
        {props.value}
      </SelectTrigger>
      <SelectContent>{items}</SelectContent>
    </Select>
  );
}
