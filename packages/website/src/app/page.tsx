import { Nav } from "@/components/nav";
import Section from "@/components/section";
import { ArrowRight, Code2, Heart, Lock, WifiOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background">
      <div className="absolute w-3/4 sm:w-1/2 h-72 rounded-full opacity-30 bg-primary left-1/2 -translate-y-1/2 -translate-x-1/2 blur-[120px]">
        
      </div>
      {/* <Image
        src="glow.svg"
        className="absolute -translate-y-1/4 z-10 pointer-events-none"
        fill
        alt="glow"
      ></Image> */}
      <Nav />
      <main className="flex flex-col justify-center gap-8 md:gap-16 row-start-2 items-center">
        <div className="w-full flex flex-col items-center mt-40">
          <h1 className="text-center text-5xl sm:text-7xl font-bold mx-4">
            A notebook
            <br />
            that is
            <span className="bg-clip-text bg-linear-to-r text-transparent from-[#338BFF] to-[#79A3DB]">
              {" "}
              truly yours.
            </span>
          </h1>
          <span className="mt-6 mx-4 text-center text-lg sm:text-xl">
            <span>
              Take notes the way you want, without all the distractions.{" "}
            </span>
            <br className="hidden sm:inline" />
            <span>
              <span className="text-theme-2">Feature packed, </span>
              <span className="text-theme-4">customizable, </span>
              and <span className="text-theme-3">open source.</span>
            </span>
          </span>
          <Link
            href={"https://github.com/astudentinearth/darkwrite/releases"}
            className="bg-primary h-10 p-7 mt-8 flex items-center w-fit gap-2 justify-center rounded-xl hover:brightness-125 transition-[filter]"
          >
            Download for free <ArrowRight size={18} />
          </Link>
          <span className="mt-2 opacity-70">
            Available on Windows, Linux and macOS
          </span>
          <Image
            className="object-contain static"
            width={1920}
            height={643}
            alt="landing"
            src="/landing_image.png"
          />
        </div>

        <div className="section-container">
          <Section className="flex-col-reverse">
            <div>
              <h1 className="section-heading">
                Type it out with <span className="text-theme-3">ease.</span>
              </h1>
              <br />
              <span className="section-body">
                Write down anything with an editor full of features. Make your
                notes fancy with <span className="text-theme-2">lists, </span>
                <span className="text-theme-4">text formatting, </span>
                and <span className="text-theme-3">images.</span>
              </span>
            </div>
            <Image
              className="rounded-[8px] max-w-[1000px] lg:w-[50%] w-full border border-[#434343] drop-shadow-lg shrink-0 aspect-auto"
              src="/img2.png"
              alt="editor"
              width={1000}
              height={992}
            />
          </Section>
        </div>

        <div className="section-container">
          <Section className="section">
            <Image
              className="w-full mt-5 max-w-[900px]"
              src={"/themes.png"}
              alt="themes"
              width={900}
              height={777}
            ></Image>
            <div>
              <h1 className="section-heading">
                <span className="text-theme-4">Co</span>
                <span className="text-theme-3">lor</span>
                <span className="text-theme-2">ful,</span>
                <span className="text-theme-1"> really.</span>
              </h1>
              <br />
              <span className="section-body">
                Pick the theme and font you love the most. Everything is up to
                you. Make it truly yours.
              </span>
            </div>
          </Section>
        </div>

        <div className="section-container">
          <div className="drop-shadow-lg flex rounded-4xl flex-col w-full gap-8 pt-8">
            <h1 className="section-heading text-center">
              Open and <span className="text-theme-2">private.</span>
            </h1>
            <div className="w-full grid md:grid-cols-3 [&_h2]:text-2xl [&_h2]:font-bold gap-4 [&>div>h2]:mb-4 [&>div]:border [&>div]:bg-alternate [&>div]:p-8 [&>div]:rounded-4xl [&>div]:drop-shadow-md  [&>div]:transition-colors">
              <div className="glow-hover z-10">
                <WifiOff className="mb-2" />
                <h2> No server.</h2>
                <span className="text-lg">
                  Everything is offline. Never worry about losing access. Export
                  your workspace as HTML at any point.
                </span>
              </div>
              <div className="glow-hover z-10">
                <Lock className="mb-2" />
                <h2>No data collected.</h2>
                <span className="text-lg">
                  Only you will know what&apos;s written in those pages. We
                  don&apos;t track what you do and we don&apos;t sell your data.
                </span>
              </div>
              <div className="glow-hover z-10">
                <Heart className="mb-2" />
                <h2>Open source.</h2>
                <span className="text-lg">
                  You get to know what you run on your device.
                </span>
                <br />
                <Link
                  className="text-theme-1 flex items-center hover:underline gap-2 mt-2"
                  href={"https://github.com/astudentinearth/darkwrite"}
                >
                  <Code2 className="inline" size={18} />
                  View the source code
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="section-container">
          <div className="section bg-theme-1/10 border border-theme-1/50 py-24! flex-col!">
            <h1 className="section-heading text-center">
              Get started with your personal notebook for free.
            </h1>
            <div className="flex gap-2 md:gap-8 flex-col md:flex-row">
              <Link
                href={"https://github.com/astudentinearth/darkwrite/releases"}
                className="bg-primary h-10 p-7 flex items-center sm:w-fit gap-2 justify-center rounded-xl hover:brightness-125 transition-[filter]"
              >
                Download for free <ArrowRight size={18} />
              </Link>
              <Link
                href={"https://github.com/astudentinearth/darkwrite"}
                className="border border-theme-1 h-10 p-7 flex items-center sm:w-fit gap-2 justify-center rounded-xl hover:brightness-125 hover:bg-primary/50 transition-[filter,background]"
              >
                Get the source code
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="h-32 bg-primary/5 border-t p-8 mt-36 flex flex-col lg:grid lg:grid-cols-3 lg:place-items-center lg:items-center lg:justify-center gap-4">
        <Image
          src={"/darkwrite_icon.png"}
          alt="Logo"
          className="justify-self-start"
          width={48}
          height={48}
        />
        <div className="[&>a]:opacity-80 [&>a]:hover:opacity-100 [&>a]:transition-opacity">
          <Link href={"https://github.com/astudentinearth/darkwrite/releases"}>
            Download
          </Link>{" "}
          <span className="opacity-60">• </span>
          <Link href={"https://github.com/astudentinearth/darkwrite"}>
            Source code
          </Link>{" "}
          <span className="opacity-60">• </span>
          <Link href={"https://github.com/astudentinearth/darkwrite/issues"}>
            Report bugs
          </Link>
        </div>
      </footer>
    </div>
  );
}
