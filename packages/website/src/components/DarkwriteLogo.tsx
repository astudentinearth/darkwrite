import type React from "react";
import { cn } from "../lib/utils";

export const DarkwriteLogo = ({
  className,
  ...props
}: React.ComponentProps<"img">) => (
  <img
    src="/darkwrite_icon.svg"
    className={cn("size-16", className)}
    {...props}
  />
);
