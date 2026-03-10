import { useResizableSidebar } from "@/features/layout/hooks/use-resizable-layout";
import { useSidebar } from "@/features/layout/hooks/use-sidebar";
import { cn } from "@/lib/utils";

const [MIN_WIDTH, , MAX_WIDTH] = [180, 240, 300];

export default function SidebarResizeHandle() {
  const { setWidth, isSidebarCollapsed } = useSidebar();
  const { handleMouseDown } = useResizableSidebar({
    min: MIN_WIDTH,
    max: MAX_WIDTH,
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
