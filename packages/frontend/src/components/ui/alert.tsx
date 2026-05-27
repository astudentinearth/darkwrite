import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const alertVariants = cva(
  "p-3 rounded-xl border drop-shadow-md flex flex-col gap-3",
  {
    variants: {
      type: {
        info: "bg-secondary/50",
        error: "bg-destructive/50 border-destructive",
      },
    },
    defaultVariants: {
      type: "info",
    },
  },
);

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants>;

export default function Alert({ className, type, children }: AlertProps) {
  return (
    <div className={cn(alertVariants({ type, className }))}>{children}</div>
  );
}
