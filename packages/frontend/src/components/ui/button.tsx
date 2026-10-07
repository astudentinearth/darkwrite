import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center duration-100 cursor-default justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-disabled [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:hover-primary active:bg-primary/85",
        destructive:
          "hover:bg-destructive/20 bg-destructive/10 disabled:bg-destructive/10 text-destructive border border-none disabled:opacity-disabled",
        outline:
          "border border-border bg-secondary hover:hover-default active:active-default hover:text-foreground",
        secondary:
          "bg-secondary top-highlight border-none text-foreground hover:hover-default",
        ghost:
          "hover:hover-default hover:text-foreground active:active-default",
        link: "text-primary underline-offset-4 hover:underline active:text-primary/85",
      },
      size: {
        default: "px-3 py-2 gap-2",
        sm: "px-1.5 py-1 text-sm gap-1.5",
        lg: "rounded-md px-8 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
