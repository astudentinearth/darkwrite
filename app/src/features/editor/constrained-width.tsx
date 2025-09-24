import { useCenteredLayout } from "@/hooks/layout/use-centered-layout";
import React from "react";

export default function ConstrainedWidth(props: { fill?: boolean } & React.ComponentProps<"div">) {
  const width = useCenteredLayout(props.fill ? 0 : 960);
  return <div {...props} style={{ width: `${width}px`, maxWidth: `${width-200}px`, "--editor-max-width": `${width-200}px` } as React.CSSProperties}>{props.children}</div>
}
