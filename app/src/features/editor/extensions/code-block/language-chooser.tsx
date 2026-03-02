import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui";
import { useMemo } from "react";

export interface LanguageChooserProps {
  onValueChange: (value: string) => void;
  value: string;
  languages: string[];
}

export default function LanguageChooser(props: LanguageChooserProps) {
  const { languages, value, onValueChange } = props;

  const items = useMemo(
    () =>
      languages.map((lang) => (
        <SelectItem key={lang} value={lang}>
          {lang}
        </SelectItem>
      )),
    [languages],
  );

  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-fit border-none opacity-60 group-hover:opacity-100 shrink-0 hover:bg-secondary h-fit transition-[background,opacity] text-xs aria-expanded:bg-secondary/80">
        {value}
      </SelectTrigger>
      <SelectContent
        side="right"
        className="max-h-[70vh] top-highlight"
        hideArrows
      >
        {items}
      </SelectContent>
    </Select>
  );
}
