import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button
} from "@darkwrite/ui";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";
import { useTitleDropdown } from "@/hooks/use-title-dropdown";
import { getNoteIcon } from "@/lib/utils";

export function NoteDropdown() {
  const navToNote = useNavigateToNote();
  const { parentNodes, title } = useTitleDropdown();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-testid="note-dropdown-trigger"
          variant={"ghost"}
          className="px-2 h-auto gap-0.5 [&>span]:leading-[18px] max-w-64 [&>span]:overflow-hidden overflow-hidden text-start justify-start [&>span]:whitespace-nowrap [&>span]:text-ellipsis"
        >
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 duration-0">
        {parentNodes.map((n) => (
          <DropdownMenuItem
            key={n.id}
            onClick={() => navToNote(n.id)}
            className="[&>span]:leading-[18px] [&>span]:whitespace-nowrap [&>span]:text-ellipsis [&>span]:overflow-hidden"
          >
            <div className="text-lg translate-y-[-5%]">
              {getNoteIcon(n.icon)}
            </div>
            <span className="text-ellipsis">{n.title}</span>
          </DropdownMenuItem>
        ))}
        {parentNodes.length === 0 ? (
          <span className="text-sm text-foreground/50 p-2 inline-block ">
            No pages above
          </span>
        ) : (
          <></>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
