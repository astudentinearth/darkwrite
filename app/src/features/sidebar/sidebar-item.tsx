import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { ReactNode, MouseEvent } from "react";

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
        "justify-start p-2 h-fit opacity-90 hover:opacity-100 duration-0! transition-none",
        className,
      )}
    >
      {children}
    </Button>
  );
}
