import { DocsSidebar } from "@/components/docs-sidebar";
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
  if(!(paths as string[]).includes(slug)) return notFound();

  return (
    <div className="absolute w-full h-full flex overflow-x-hidden">
      <DocsSidebar />
      <div className="grow flex bg-muted/70 justify-center">
        <div className="markdown-container px-8 h-full overflow-auto w-full max-w-240">
          {Docs[slug as keyof typeof Docs]}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return paths.map((slug)=>({slug}));
}
