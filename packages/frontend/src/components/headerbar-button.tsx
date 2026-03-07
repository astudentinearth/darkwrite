import { cn } from "@/lib/utils";
import React from "react";

export type HeaderbarButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const HeaderbarButton = React.forwardRef<
  HTMLButtonElement,
  HeaderbarButtonProps
>((props, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "inline-flex items-center cursor-default justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "shrink-0 p-0",
        "hover:bg-secondary hover:text-secondary-foreground active:bg-secondary/80",
        "opacity-80 hover:opacity-100 transition-[background,opacity] duration-100",
        "h-8 w-8",

        props.className,
      )}
    >
      {props.children}
    </button>
  );
});
