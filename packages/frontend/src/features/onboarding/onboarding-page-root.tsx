import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OnboardingPageRootProps {
  children: ReactNode | ReactNode[];
  className?: string;
  progress?: number;
}

export default function OnboardingPageRoot({
  children,
  className,
  progress,
}: OnboardingPageRootProps) {
  return (
    <div className="fixed w-full h-full left-0 right-0 bg-background text-2xl slide-up-and-fade-in">
      <div className="fixed left-0 right-0 h-12 titlebar"></div>
      <div
        className={cn(
          "w-200 h-150 bg-view-1 overflow-hidden border rounded-xl drop-shadow-2xl flex duration-200 justify-center items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          className,
        )}
      >
        {children}
        <progress
          value={progress}
          className="absolute bottom-0 h-1 w-full bg-transparent"
        />
      </div>
    </div>
  );
}
