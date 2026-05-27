import type React from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SidebarItem({
  className,
  children,
  ...props
}: {
  children: ReactNode | ReactNode[];
} & React.ComponentProps<"button">) {
  return (
    <Button
      {...props}
      variant={"ghost"}
      onClick={props.onClick}
      className={cn(
        "justify-start px-2 py-1.5 hover:bg-secondary/50 h-fit text-foreground hover:text-foreground hover:opacity-100 opacity-75 duration-75 transition-opacity active:pushdown-98% active:opacity-90",
        className,
      )}
    >
      {children}
    </Button>
  );
}
