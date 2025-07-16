"use client";
import { BookOpen, Bug, Code, Menu } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function MenuPopover() {
  return (
    <Popover>
      <PopoverTrigger className="mr-2 xs:hidden">
        <Menu size={24} />
      </PopoverTrigger>
      <PopoverContent className="bg-nav/80 xs:hidden border-[#c1c1c1]/25 backdrop-blur-lg flex flex-col p-2 gap-3 mr-3 mt-4 rounded-2xl">
        <div className="flex gap-2 flex-col p-2">
          <h1 className="text-xs text-muted-foreground">RESOURCES</h1>
          <Link href={"/docs/install"} className="flex items-center gap-2">
            <BookOpen size={20} />
            User guide
          </Link>
          <Link
            href={"https://github.com/astudentinearth/darkwrite"}
            className="flex gap-2 items-center"
          >
            <Code size={20} />
            Source code
          </Link>
          <Link
            href={"https://github.com/astudentinearth/darkwrite/issues"}
            className="flex gap-2 items-center"
          >
            <Bug size={20} />
            Report bugs
          </Link>
        </div>
        <Link
          href={"https://github.com/astudentinearth/darkwrite/releases"}
          className="bg-primary shrink-0 h-10 p-3 flex items-center justify-center rounded-[6px] hover:brightness-125 transition-[filter]"
        >
          Get started
        </Link>
      </PopoverContent>
    </Popover>
  );
}
