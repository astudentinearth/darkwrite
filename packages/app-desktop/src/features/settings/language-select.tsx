import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@darkwrite/ui";
import { Language, LanguageNameMap } from "@/types/lang";

export default function LanguageSelect({
  lang,
  onValueChange,
}: {
  lang: Language;
  onValueChange?: (val: Language) => void;
}) {
  return (
    <Select value={lang} onValueChange={onValueChange}>
      <SelectTrigger className="bg-secondary">{LanguageNameMap[lang]}</SelectTrigger>
      <SelectContent>
        <SelectItem value="tr">Türkçe</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
}
