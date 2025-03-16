import Link from "next/link";
import Image from "next/image";

export async function Nav() {
  return (
    <div className="fixed w-full flex justify-center top-3 z-50">
      <nav className="bg-nav/80 backdrop-blur-md justify-center min-w-0 w-fit max-w-max p-3 border border-[#c1c1c1]/25 rounded-[18px] flex gap-3">
        <Link href={"/"} className="shrink-0">
          <Image
            src={"/darkwrite_icon.png"}
            alt="Logo"
            width={40}
            height={40}
          />
        </Link>
        <Link
          href={"/docs/install"}
          className="h-10 flex shrink-0 justify-center items-center p-3 select-none hover:bg-white/10 transition-colors rounded-[6px]"
        >
          User guide
        </Link>
        <Link
          href={"https://github.com/astudentinearth/darkwrite/releases"}
          className="bg-primary shrink-0 h-10 p-3 flex items-center justify-center rounded-[6px] hover:brightness-125 transition-[filter]"
        >
          Download
        </Link>
      </nav>
    </div>
  );
}
