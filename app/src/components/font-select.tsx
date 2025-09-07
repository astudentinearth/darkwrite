import useFonts from "@/query/use-fonts";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { cn } from "@/lib/utils";
import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

export default function FontSelect(props: {
  value?: string;
  onValueChange?: (val: string) => void;
  className?: string;
}) {
  const fonts = useFonts().data;
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: fonts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
  });
  const items = useMemo(
    () =>
      fonts.map((f) => <SelectItem value={f.family}>{f.family}</SelectItem>),
    [fonts],
  );
  return (
    <div ref={parentRef} className="h-96 overflow-auto scroll-view m-4">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <div key={item.key} className="absolute top-0 left-0 w-full" style={{height: `${item.size}px`, transform: `translateY(${item.start}px)`}}>{fonts[item.index].family}</div>
        ))}
      </div>
    </div>
  );
}
