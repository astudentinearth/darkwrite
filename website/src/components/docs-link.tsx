"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function DocumentationLink({
  href,
  children,
  className,
}: {
  href: string;
  children?: ReactNode;
  className?: string;
}) {
  const location = usePathname();
  const isActive = location === href;

  return <Link href={href} className={cn("p-2 rounded-[8px] shrink-0 hover:bg-muted/30 cursor-default",
  isActive && "bg-muted/50", 
  className)}>
    {children}
  </Link>;
}
