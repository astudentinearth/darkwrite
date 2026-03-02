import { useEditorStore } from "@/context/editor-store";
import { useCenteredLayout } from "@/features/layout/hooks/use-centered-layout";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

export default function ConstrainedWidth(
  props: { fill?: boolean } & React.ComponentProps<"div">,
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
        {
          width: `${width}px`,
          maxWidth: `${width - 200}px`,
          "--editor-max-width": `${width - 200}px`,
        } as React.CSSProperties
      }
    >
      {props.children}
    </div>
  );
}
