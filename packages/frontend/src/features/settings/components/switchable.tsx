import { useId } from "react";
import { Label, Switch } from "@/components/ui";

export type SwitchableProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
  title: string;
  description?: string;
};

export function SwitchablePreference(props: SwitchableProps) {
  const id = useId();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>{props.title}</Label>
        {props.description && (
          <p className="text-sm text-muted-foreground">{props.description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={props.value}
        onCheckedChange={props.onValueChange}
      />
    </div>
  );
}
