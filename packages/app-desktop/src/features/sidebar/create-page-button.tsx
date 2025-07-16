import { Button } from "@darkwrite/ui";
import { useCreateNoteMutation } from "@/hooks/query/use-create-note-mutation";
import { cn } from "@/lib/utils";
import { SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CreatePageButton() {
  const createMutation = useCreateNoteMutation(true);
  const create = () => createMutation.mutate(undefined);
  const { t } = useTranslation();
  //FIXME: Extract this button component
  return (
    <Button
      onClick={create}
      variant={"ghost"}
      className={cn(
        "rounded-[8px] gap-0 hover:bg-secondary/50 text-foreground/60 hover:text-foreground active:bg-secondary/25 transition-colors grid grid-cols-[24px_1fr] select-none p-1 pl-2 h-8 overflow-hidden",
      )}
    >
      <SquarePen size={16}></SquarePen>
      <span className="justify-self-start">{t("sidebar.button.newPage")}</span>
    </Button>
  );
}
