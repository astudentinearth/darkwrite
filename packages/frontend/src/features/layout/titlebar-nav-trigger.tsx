import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TitlebarNavTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <Button
      variant={"ghost"}
      {...props}
      className={cn(
        "h-fit justify-start px-2 py-2 hover:bg-secondary/50",
        className,
      )}
    >
      {children}
    </Button>
  );
}
