import { MouseEvent, useState } from "react";

export default function useMouseOver(stopPropagation = false) {
  const [mouseOver, setMouseOver] = useState(false);
  const onMouseEnter = (event: MouseEvent<HTMLElement>) => {
    if (stopPropagation) event.stopPropagation();
    setMouseOver(true);
  };
  const onMouseLeave = (event: MouseEvent<HTMLElement>) => {
    if (stopPropagation) event.stopPropagation();
    setMouseOver(false);
  };
  const hoverProps = { onMouseEnter, onMouseLeave };
  return { hoverProps, mouseOver };
}
