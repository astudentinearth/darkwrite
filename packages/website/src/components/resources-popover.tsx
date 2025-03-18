"use client";
import { BookOpen, Bug, Code } from "lucide-react";
import Link from "next/link";

export default function ResourcesPopover() {
  return (
    <div className="group hidden xs:flex">
      <div className="h-10 shrink-0 flex justify-center items-center p-3 select-none hover:bg-white/10 transition-colors rounded-[6px]">
        Resources
        <div className={"absolute hidden xs:group-hover:block xs:group-focus:block xs:group-active:block top-13 transparent"}>
        <div className="h-4"></div>
        <div className="bg-nav border drop-sh p-2 border-[#c1c1c1]/25 rounded-[18px]">
          <Link
            href={"/docs/install"}
            className="flex gap-3 shrink-0 cursor-default justify-start items-center p-3 select-none hover:bg-white/10 transition-colors rounded-[8px]"
          >
            <BookOpen size={20}/>
            User guide
          </Link>
          <Link
            href={"https://github.com/astudentinearth/darkwrite"}
            className="flex gap-3 shrink-0 cursor-default justify-start items-center p-3 select-none hover:bg-white/10 transition-colors rounded-[8px]"
          >
            <Code size={20}/>
            Source code
          </Link>
          <Link
            href={"https://github.com/astudentinearth/darkwrite/issues"}
            className="flex gap-3 shrink-0 cursor-default justify-start items-center p-3 select-none hover:bg-white/10 transition-colors rounded-[8px]"
          >
            <Bug size={20}/>
            Report bugs
          </Link>
        </div>
      </div>
      </div>

    </div>
  );
}
