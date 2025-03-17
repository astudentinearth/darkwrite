"use client";

import Link from "next/link";
import { DocumentationLink } from "./docs-link";
import Image from "next/image";
import { ArrowLeft, Info, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";

export function DocsSidebar({className}: {className?: string}) {
  return (
    <div className={cn("h-full w-72 flex flex-col p-2 shrink-0", className)}>
      <div className="text-xl shrink-0 font-semibold p-2 pb-4 flex items-center gap-2">
        <Image src={"/darkwrite_icon.png"} alt="logo" width={32} height={32} />
        <span>Docs</span>
      </div>
      <span className="block p-3 bg-primary/30 rounded-xl text-sm mb-2 text-muted-foreground">
        <Info size={16} className="inline" /> This documentation is a
        work-in-progress.
      </span>
      <DocumentationLink href={"/docs/install"}>
        ⬇️ &nbsp;Installation
      </DocumentationLink>
      <DocumentationLink href={"/docs/backup"}>
        📦 &nbsp;Backup and restore
      </DocumentationLink>
      {/* <DocumentationLink href={"/docs/creating-themes"}>
        🎨 &nbsp;Create your own theme
      </DocumentationLink> */}
      {/* <DocumentationLink href={"/docs/customization"}>
        🖌️ &nbsp;Customization
      </DocumentationLink> */}
      <DocumentationLink href={"/docs/workspace-export"}>
        📃 &nbsp;Export your workspace
      </DocumentationLink>
      {/* <DocumentationLink href={"/docs/shortcuts"}>
        ⌨️ &nbsp;Keyboard shortcuts
      </DocumentationLink> */}
      <div className="grow"></div>
      <Link
        className="p-2 rounded-[8px] flex gap-2 items-center shrink-0 hover:bg-muted/30 cursor-default"
        href={"/"}
      >
        <ArrowLeft size={20} />
        Return to home page
      </Link>
    </div>
  );
}

export function DocsSidebarSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="opacity-80" size={20}/>
      </SheetTrigger>
      <SheetContent className="w-fit border-border" side="left">
        <DocsSidebar />
      </SheetContent>
    </Sheet>
  );
}
