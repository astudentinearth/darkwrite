import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "size-5 border rounded-sm data-[state=checked]:bg-primary data-[state=checked]:hover-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-none hover:hover-default cursor-pointer",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator asChild>
        <IconCheck size={18} className="translate-x-px" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
