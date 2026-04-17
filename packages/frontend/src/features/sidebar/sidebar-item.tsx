import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

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
        "justify-start p-2 hover:bg-secondary/50 h-fit text-foreground hover:text-foreground hover:opacity-100 opacity-75 duration-75 transition-opacity",
        className,
      )}
    >
      {children}
    </Button>
  );
}
