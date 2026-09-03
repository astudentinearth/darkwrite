import { useResizableSidebar } from "@/features/layout/hooks/use-resizable-layout";
import { useSidebar } from "@/features/layout/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { useSidebarWidthRange } from "./hooks/use-sidebar-width-range";

export default function SidebarResizeHandle() {
  const { setWidth, isSidebarCollapsed } = useSidebar();
  const { min, max } = useSidebarWidthRange();
  const { handleMouseDown } = useResizableSidebar({
    min,
    max,
    callback: setWidth,
  });
  return (
    <div
      data-testid="sidebar-resize-handle"
      onMouseDown={handleMouseDown}
      className={cn(
        "w-px h-full flex cursor-ew-resize resize-handle relative",
        isSidebarCollapsed && "hidden",
      )}
    ></div>
  );
}
