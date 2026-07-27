import { generateId } from "@/id";

export enum PropertyFieldType {
  TEXT = 0,
  SELECT = 1,
  MULTI_SELECT = 2,
  CHECKBOX = 3,
  DATE = 4,
}

export interface SelectOption {
  key: string;
  color: string;
  text: string;
}

export interface PropertyField {
  key: string;
  type: PropertyFieldType;
  name: string;
  options?: SelectOption[];
}

// biome-ignore lint/complexity/noStaticOnlyClass: this will be refactored later
export class FieldBuilder {
  private static generatePropertyFieldKey() {
    return generateId();
  }

  public static createSelectOption(text: string, color?: string) {
    const optionKey = FieldBuilder.generatePropertyFieldKey();

    return {
      key: optionKey,
      color: color ?? "#ffffff",
      text,
    } satisfies SelectOption;
  }

  public static createPropertyField<T extends PropertyFieldType>(
    name: string,
    type: T,
    options: T extends PropertyFieldType.SELECT
      ? SelectOption[]
      : T extends PropertyFieldType.MULTI_SELECT
        ? SelectOption[]
        : never,
  ) {
    const fieldKey = FieldBuilder.generatePropertyFieldKey();
    return {
      key: fieldKey,
      name,
      type,
      options,
    } satisfies PropertyField;
  }
}
