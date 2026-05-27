import { ArrowLeft, ArrowRight } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface OnboardingButtonProps extends React.ComponentProps<"button"> {
  variant?: "secondary" | "default";
}

export default function OnboardingButton({
  className,
  children,
  variant,
  ...props
}: OnboardingButtonProps) {
  return (
    <Button
      variant={variant ?? "secondary"}
      className={cn(
        "bg-view-2 hover:bg-view-2/80 border rounded-xl drop-shadow-sm h-fit px-6 py-4 grid grid-cols-[1fr_24px] text-start text-xl",
        className,
      )}
      {...props}
    >
      <div>{children}</div>
      <ArrowRight />
    </Button>
  );
}

export function BackButton({ className, ...props }: OnboardingButtonProps) {
  return (
    <Button
      variant={"ghost"}
      className={cn(
        "hover:bg-view-2/80 rounded-md drop-shadow-sm size-14",
        className,
      )}
      {...props}
    >
      <ArrowLeft />
    </Button>
  );
}

export function ForwardButton({ className, ...props }: OnboardingButtonProps) {
  return (
    <Button
      className={cn(
        "bg-primary border border-primary rounded-xl drop-shadow-sm size-14",
        className,
      )}
      {...props}
    >
      <ArrowRight />
    </Button>
  );
}
