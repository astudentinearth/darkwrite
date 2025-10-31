import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as React from "react";

interface OnboardingButtonProps extends React.ComponentProps<"button"> {}

export default function OnboardingButton({
  className,
  children,
  ...props
}: OnboardingButtonProps) {
  return (
    <Button
      variant={"secondary"}
      className={cn(
        "bg-view-2 border rounded-2xl drop-shadow-sm h-fit px-6 py-4 grid grid-cols-[1fr_24px] text-start text-xl",
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
      variant={"secondary"}
      className={cn(
        "bg-view-2 border rounded-2xl drop-shadow-sm size-14",
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
        "bg-primary border border-primary rounded-2xl drop-shadow-sm size-14",
        className,
      )}
      {...props}
    >
      <ArrowRight />
    </Button>
  );
}
