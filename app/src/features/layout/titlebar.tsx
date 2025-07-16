import { RefObject } from "react";

export type TitlebarProps = React.HTMLAttributes<HTMLDivElement> & {
  refObject: RefObject<HTMLDivElement | null>;
  expandCallback: () => void;
  isSidebarCollapsed: boolean;
};

export function Titlebar(props: TitlebarProps) {
  return (
    <div
      ref={props.refObject}
      className="titlebar h-12 bg-background shrink-0 flex [&>div]:shrink-0 p-2 justify-start gap-1"
    >
      Darkwrite
    </div>
  );
}
