import { cn } from "@/lib/utils";
import * as React from "react";

interface SettingsCardProps extends React.ComponentProps<"div"> {}

export default function SettingsCard({
  className,
  children,
}: SettingsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-160 bg-view-2 p-4 gap-4 rounded-lg drop-shadpow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
