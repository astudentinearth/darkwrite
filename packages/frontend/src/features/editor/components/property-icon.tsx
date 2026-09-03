import { PropertyType } from "@darkwrite/common";
import {
  IconAlignJustified,
  IconCalendar,
  IconCheckbox,
  type TablerIcon,
} from "@tabler/icons-react";

export const PropertyIconMap: Record<PropertyType, TablerIcon> = {
  [PropertyType.Text]: IconAlignJustified,
  [PropertyType.Date]: IconCalendar,
  [PropertyType.Checkbox]: IconCheckbox,
};

export function PropertyIcon({
  type,
  ...props
}: React.ComponentProps<TablerIcon> & { type: PropertyType }) {
  const Icon = PropertyIconMap[type];
  return <Icon {...props} />;
}
