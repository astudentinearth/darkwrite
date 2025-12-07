import { useEditorStore } from "@/context/editor-store";
import { useLocalStore } from "@/context/local-state";
import { cn } from "@/lib/utils";
import {
  TextareaHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

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
  const width = useEditorStore((s) => s.width);
  useLayoutEffect(() => {
    adjustHeight();
    const resize = () => {
      adjustHeight();
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

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
      ref.current.value = ref.current.value.replace(/(\r\n|\n|\r)/gm, " ");
    }
    props.onValueChange?.call(null, ref.current.value);
    adjustHeight();
  };

  const {
    preventNewline,
    onValueChange,
    newLineCallback,
    className,
    ...attributes
  } = props;

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
