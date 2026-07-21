import { type ReactNode, useRef, useState } from "react";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";

export type TextTableCellProps = {
  children?: ReactNode;
  defaultValue: string;
  onValueChange: (val: string) => void;
  className?: string;
  placeholder?: string;
};

export function TextTableCell(props: TextTableCellProps) {
  const [isEditing, setEditing] = useState(false);
  const [value, setValue] = useState(props.defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const saveAndExit = () => {
    if (value !== props.defaultValue) props.onValueChange(value);
    setEditing(false);
  };

  const edit = () => {
    if (!isEditing) {
      setValue(props.defaultValue);
      setEditing(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  return (
    <td
      tabIndex={0}
      onClick={edit}
      onKeyDown={(e) => e.key === "Enter" && edit()}
      className={cn(
        "border border-transparent h-10 px-2 focus-within:outline-0 focus:border-primary/50",
        props.className,
        isEditing && "p-0",
      )}
    >
      <Input
        ref={inputRef}
        placeholder={props.placeholder}
        onBlur={() => {
          saveAndExit();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter" || e.key === "Escape") saveAndExit();
        }}
        className={cn(
          "w-full col-span-full justify-self-start",
          !isEditing && "hidden",
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {!isEditing && props.children}
    </td>
  );
}
