import { cn } from "@/lib/utils";

export const FlexibleSpacer = (props: {
  className?: string;
  axis?: "horizontal" | "vertical";
}) => <div className={cn("grow", props.className)}></div>;
