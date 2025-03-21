import Link from "next/link";
import Image from "next/image";
import ResourcesPopover from "./resources-popover";
import MenuPopover from "./menu";

export async function Nav(props: {releasePage?: string}) {
  return (
    <div className="fixed w-full flex justify-center px-3 top-3 z-50">
      <nav className="bg-nav/80 backdrop-blur-md justify-start xs:justify-center min-w-0 grow xs:w-fit xs:max-w-max p-3 border border-[#c1c1c1]/25 rounded-[18px] flex gap-2">
        <Link href={"/"} className="shrink-0 xs:mr-2">
          <Image
            src={"/darkwrite_icon.png"}
            alt="Logo"
            width={40}
            height={40}
          />
        </Link>
        <ResourcesPopover/>
        <Link
          href={props.releasePage ?? "https://github.com/astudentinearth/darkwrite/releases"}
          className="bg-primary shrink-0 h-10 p-3 hidden xs:flex items-center justify-center rounded-[6px] hover:brightness-125 transition-[filter] ml-2"
        >
          Download
        </Link>
        <div className="grow xs:hidden"></div>
        <MenuPopover/>
      </nav>
    </div>
  );
}
