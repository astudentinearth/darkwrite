import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateNoteMutation } from "@/query/use-create-note";
import { SquarePen } from "lucide-react";

export function CreatePageButton(props: { className?: string }) {
  const { create } = useCreateNoteMutation();
  const handleClick = () => create({});
  return (
    <Button
      onClick={handleClick}
      className={cn(
        "p-1.5 w-8 h-8 bg-view-2 rounded-[8px] text-white/80 hover:text-white shrink-0",
        props.className,
      )}
    >
      <SquarePen size={18} />
    </Button>
  );
}
