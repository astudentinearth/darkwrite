import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageMargins, PageSize } from "@/common/pdf";
import { useLocalStore } from "@/context/local-state";
import { cn } from "@/lib/utils";

interface PageSizeChooserProps {
  className?: string;
}

export function PageSizeChooser({ className }: PageSizeChooserProps) {
  const { pdfExportPageSize, setPdfExportPageSize } = useLocalStore();

  return (
    <Select
      value={pdfExportPageSize}
      onValueChange={(value: string) => setPdfExportPageSize(value as PageSize)}
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
