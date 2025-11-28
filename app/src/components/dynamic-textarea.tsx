import { useLocalStore } from "@/context/local-state";
import { TextareaHTMLAttributes, useEffect, useRef } from "react";

export interface DynamicTextareaProps
  extends Omit<
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
}

/**
 * A textarea component which automatically resizes vertically to fit its content.
 */
export default function DynamicTextarea(props: DynamicTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const sidebarWidth = useLocalStore((s) => s.sidebarWidth);
  const sidebarState = useLocalStore((s) => s.isSidebarCollapsed);

  useEffect(() => {
    adjustHeight();
    const resize = () => {
      adjustHeight();
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [sidebarWidth, sidebarState]);

  const adjustHeight = () => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight + 2}px`;
  };

  const handleChange = () => {
    if (!ref.current) return;
    if (preventNewline) {
      ref.current.value = ref.current.value.replace(/(\r\n|\n|\r)/gm, " ");
    }
    props.onValueChange?.call(null, ref.current.value);
    adjustHeight();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { preventNewline, onValueChange, newLineCallback, ...attributes } =
    props;

  return (
    <textarea
      ref={ref}
      rows={1}
      cols={1}
      {...attributes}
      onChange={handleChange}
    ></textarea>
  );
}
