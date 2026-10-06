import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden top-highlight text-xs rounded-md border glass px-1.5 py-1 text-foreground shadow-md origin-[--radix-tooltip-content-transform-origin]",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export type TextTooltipProps = {
  text: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  className?: string;
  offset?: number;
};

export function TextTooltip({
  text,
  children,
  side,
  delayDuration,
  className,
  offset,
}: TextTooltipProps) {
  return (
    <Tooltip delayDuration={delayDuration ?? 400}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipPortal container={document.body}>
        <TooltipContent
          sideOffset={offset}
          side={side ?? "bottom"}
          className={cn("text-xs", className)}
        >
          {text}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
};
