import { DocsSidebar, DocsSidebarSheet } from "@/components/docs-sidebar";
import { Docs } from "@/docs";
import { notFound } from "next/navigation";
import "./docs.css";

const paths = Object.keys(Docs) as Array<keyof typeof Docs>;

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  if (!(paths as string[]).includes(slug)) return notFound();

  return (
    <div className="absolute w-full h-full flex overflow-x-hidden">
      <DocsSidebar className="hidden md:flex" />
      <div className="grow flex flex-col bg-muted/30 md:m-2 md:rounded-xl md:border md:border-border drop-shadow-lg">
        <div className="bg-background z-50 p-2 rounded-xl m-2 border border-border flex items-center gap-2 md:hidden">
          <DocsSidebarSheet />
          <span className="opacity-80">Docs</span>
        </div>
        <div className="markdown-container px-8 h-full overflow-auto w-full flex justify-center">
          <div className="max-w-240">
          {Docs[slug as keyof typeof Docs]}
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return paths.map((slug) => ({ slug }));
}
