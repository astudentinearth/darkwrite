import { useCenteredLayout } from "@/hooks/layout/use-centered-layout";

export default function ConstrainedWidth(props: {fill?: boolean} & React.ComponentProps<"div">) {
  const width = useCenteredLayout(props.fill ? 0 : 960);
  return <div {...props} style={{width: `${width}px`}}>{props.children}</div>
}