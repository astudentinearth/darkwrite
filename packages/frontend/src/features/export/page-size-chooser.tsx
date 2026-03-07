import { PageMargins, PageSize } from "@/common/pdf";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEditorSettings } from "../settings/hooks/use-settings";
import { useSettingsActions } from "../settings/store/settings-actions";

interface PageSizeChooserProps {
  className?: string;
}

export function PageSizeChooser({ className }: PageSizeChooserProps) {
  const pdfExportPageSize = useEditorSettings().preferredPageSize;
  const { setPreferredPageSize } = useSettingsActions();
  return (
    <Select
      value={pdfExportPageSize}
      onValueChange={(value: string) => setPreferredPageSize(value as PageSize)}
    >
      <SelectTrigger className={cn(className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(PageMargins).map((size) => (
          <SelectItem key={size} value={size}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
