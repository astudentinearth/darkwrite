import * as PortalPrimitive from "@radix-ui/react-portal";
import React from "react";

export type PortalProps = React.ComponentProps<typeof PortalPrimitive.Root>;

export const Portal = ({ children, ...rest }: PortalProps) => (
  <PortalPrimitive.Root {...rest}>{children}</PortalPrimitive.Root>
);
