import type React from "react";
import { useEffect } from "react";
import { useEditorStore } from "@/context/editor-store";
import { useCenteredLayout } from "@/features/layout/hooks/use-centered-layout";
import { cn } from "@/lib/utils";

const PADDING_PX = 64;

export default function ConstrainedWidth(
  props: {
    fill?: boolean;
    noConstrain?: boolean;
  } & React.ComponentProps<"div">,
) {
  const { className, fill, ...rest } = props;
  const width = useCenteredLayout(fill ? 0 : 960);
  useEffect(() => {
    useEditorStore.setState({ width });
  }, [width]);
  return (
    <div
      {...rest}
      className={cn("", className)}
      style={
        props.noConstrain
          ? {}
          : ({
              width: `${width}px`,
              maxWidth: `${width - 2 * PADDING_PX}px`,
              "--editor-max-width": `${width - 2 * PADDING_PX}px`,
            } as React.CSSProperties)
      }
    >
      {props.children}
    </div>
  );
}
