import { generateId } from "@/id";

export enum PropertyType {
  Text = "text",
  Select = "select",
  MultiSelect = "multi_select",
  Checkbox = "checkbox",
  Date = "date",
}

export interface SelectOption {
  key: string;
  color: string;
  text: string;
}

export interface SelectPropertyConfig {
  options: SelectOption[];
}

export interface BasePropertyField {
  id: string;
  name: string;
  type: PropertyType;
}

export type PropertyField =
  | BasePropertyField
  | {
      type: PropertyType.MultiSelect | PropertyType.Select;
      config: SelectPropertyConfig;
    };

export const createSelectOption = (opts: {
  text: string;
  color?: string;
}): SelectOption => ({
  key: generateId(),
  color: opts.color ?? "#ffffff",
  text: opts.text,
});
