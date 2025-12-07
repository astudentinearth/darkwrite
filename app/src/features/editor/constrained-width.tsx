import { useEditorStore } from "@/context/editor-store";
import { useCenteredLayout } from "@/hooks/layout/use-centered-layout";
import React, { useEffect } from "react";

export default function ConstrainedWidth(
  props: { fill?: boolean } & React.ComponentProps<"div">,
) {
  const width = useCenteredLayout(props.fill ? 0 : 960);
  useEffect(() => {
    useEditorStore.setState({ width });
  }, [width]);
  return (
    <div
      {...props}
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
