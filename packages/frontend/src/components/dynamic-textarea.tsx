import { useEditorStore } from "@/context/editor-store";
import { useLocalStore } from "@/context/local-state";
import { cn } from "@/lib/utils";
import { type TextareaHTMLAttributes, useLayoutEffect, useRef } from "react";

export interface DynamicTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange" | "onPaste"
> {
  /** The callback to run when value changes. Height will get adjusted **after** this method is called. */
  onValueChange?: (value: string) => void;
  /** Placeholder of the textarea */
  placeholder?: string;
  /** Whether to allow line breaks in the textarea */
  preventNewline?: boolean;
  defaultValue?: string;
  newLineCallback?: () => void;
  autoFocus?: boolean;
}

/**
 * A textarea component which automatically resizes vertically to fit its content.
 */
export default function DynamicTextarea(props: DynamicTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const sidebarWidth = useLocalStore((s) => s.sidebarWidth);
  const sidebarState = useLocalStore((s) => s.isSidebarCollapsed);
  const width = useEditorStore((s) => s.width);
  const { preventNewline, className, autoFocus, ...attributes } = props;
  useLayoutEffect(() => {
    adjustHeight();
    requestAnimationFrame(() => {
      if (autoFocus && ref.current) {
        ref.current.focus();
        ref.current.setSelectionRange(
          ref.current.value.length,
          ref.current.value.length,
        );
      }
    });
    const resize = () => {
      adjustHeight();
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [autoFocus]);

  useLayoutEffect(() => {
    adjustHeight();
  }, [sidebarWidth, sidebarState, props.defaultValue, width]);

  const adjustHeight = () => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight + 2}px`;
  };

  const handleChange = () => {
    if (!ref.current) return;
    if (preventNewline) {
      ref.current.value = ref.current.value.replace(/(\r\n|\n|\r)/gm, "");
    }
    props.onValueChange?.call(null, ref.current.value);
    adjustHeight();
  };

  return (
    <textarea
      ref={ref}
      rows={1}
      cols={1}
      {...attributes}
      className={cn("", className)}
      onChange={handleChange}
    ></textarea>
  );
}
