import { cn } from "@/lib/utils";
import * as React from "react";
import { ReactNode } from "react";

interface OnboardingPageRootProps {
  children: ReactNode | ReactNode[];
  className?: string;
}

export default function OnboardingPageRoot({
  children,
  className,
}: OnboardingPageRootProps) {
  return (
    <div className="fixed w-full h-full left-0 right-0 bg-background text-2xl slide-up-and-fade-in">
      <div className="fixed left-0 right-0 h-12 titlebar"></div>
      <div
        className={cn(
          "w-200 h-150 bg-view-1 border rounded-[36px] drop-shadow-2xl flex duration-200 justify-center items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
