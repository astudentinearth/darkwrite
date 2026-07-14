import { IconBook, IconEdit } from "@tabler/icons-react";
import { Button } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { cn } from "@/lib/utils";
import { EditorMode, editorSlice } from "../store/editor-slice";

export function ReaderModeToggle() {
  const value = useAppSelector((s) => s.editor.mode);
  const dispatch = useAppDispatch();
  const onValueChange = (val: EditorMode) =>
    dispatch(editorSlice.actions.setMode(val));

  return (
    <div className="bg-view-1 flex p-0.5 w-fit h-fit rounded-md top-highlight">
      <Button
        variant="ghost"
        onClick={() => onValueChange(EditorMode.Edit)}
        className={cn(
          "p-1.5 h-fit rounded-[6px]",
          value === EditorMode.Edit && "bg-view-2 top-highlight",
        )}
      >
        <IconEdit size={18} />
      </Button>
      <Button
        variant="ghost"
        onClick={() => onValueChange(EditorMode.ReadOnly)}
        className={cn(
          "p-1.5 h-fit rounded-[6px]",
          value === EditorMode.ReadOnly && "bg-view-2 top-highlight",
        )}
      >
        <IconBook size={18} />
      </Button>
    </div>
  );
}
