import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const LocaleNameMap: Record<string, string> = {
  en: "English",
  tr: "Türkçe",
  "zh-CN": "简体中文",
};

export type LangaugeChooserProps = {
  value: string;
  onValueChange: (val: string) => void;
  className?: string;
};

export function LanguageChooser({
  value,
  onValueChange,
  className,
}: LangaugeChooserProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn("w-fit bg-secondary/50 top-highlight", className)}
      >
        {LocaleNameMap[value]}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="tr">Türkçe</SelectItem>
        <SelectItem value="zh-CN">简体中文</SelectItem>
      </SelectContent>
    </Select>
  );
}
