import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export default function Section({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode | ReactNode[];
}) {
  return <div className={cn("flex rounded-4xl flex-col lg:flex-row w-full p-7 sm:p-16 gap-8 items-center", className)}>{children}</div>;
}
