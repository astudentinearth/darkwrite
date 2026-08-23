import { ExternalLinks, GIT_REPO_URL, InternalLinks } from "../lib/resources";
import { DarkwriteLogo } from "./DarkwriteLogo";

export default function Footer() {
  return (
    <footer className="grid [&_a]:hover:underline grid-cols-2 md:grid-cols-4 bg-view-1 top-highlight-reflection w-full gap-5 p-6 md:p-10">
      <a
        href="/"
        className="col-span-2 md:col-span-1 flex items-center md:items-start gap-3"
      >
        <DarkwriteLogo className="size-12" />
        <span className="font-medium text-xl md:hidden">Darkwrite</span>
      </a>
      <div className="flex flex-col gap-5">
        <a href="/">Home</a>
        <a href={InternalLinks.Roadmap}>Roadmap</a>
        <a href={InternalLinks.Downloads}>Downloads</a>
        <a href={InternalLinks.Docs}>Docs</a>
      </div>
      <div className="flex flex-col gap-5">
        <a href={GIT_REPO_URL}>Source code</a>
        <a href={ExternalLinks.BugTracker}>Report bugs</a>
        <a href={ExternalLinks.Changelog}>Changelog</a>
      </div>
      <div className="flex flex-col gap-5">
        <a href={InternalLinks.Privacy}>Privacy</a>
        <a href={ExternalLinks.AGPL}>License</a>
        <a href="/licenses.md">Acknowledgements</a>
        <span>
          built with ☕ by&nbsp;
          <a href="https://yeniceri.dev">burak</a>
        </span>
      </div>
    </footer>
  );
}
