import type { DateRange } from "@darkwrite/common";
import {
  DayPicker,
  type DayPickerProps,
  getDefaultClassNames,
} from "@daypicker/react";
import "@daypicker/react/style.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import "./calendar.css";

export type DatePickerCalendarProps = {
  mode: DayPickerProps["mode"];
  onChange: (range: DateRange) => void;
  value: DateRange | undefined;
};

const _default = getDefaultClassNames();

export function DatePickerCalendar(props: DatePickerProps) {
  return (
    <DayPicker
      required
      mode="range"
      selected={props.value}
      captionLayout="dropdown"
      navLayout="around"
      endMonth={new Date(new Date().getFullYear() + 5, 12)}
      onSelect={props.onChange}
      classNames={{
        dropdown_root: cn(
          "px-1.5 py-1 rounded-md text-sm",
          _default.dropdown_root,
        ),
        dropdown: cn("bg-view-1", _default.dropdown),
      }}
    />
  );
}

export type DatePickerProps = DatePickerCalendarProps & {
  className?: string;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, { day: "numeric", month: "short" });

const formatRange = (range: DateRange) => {
  if (!range.from) return null;
  if (range.from?.valueOf() === range.to?.valueOf())
    return formatDate(range.from);
  return `${formatDate(range.from)}${range.to ? " → " : ""}${range.to ? formatDate(range.to) : ""}`;
};

export function DatePicker({ className, ...props }: DatePickerProps) {
  const { t } = useTranslation();
  const content =
    (props.value ? formatRange(props.value) : null) ?? t("ui.pickDate");

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="ghost"
          className={cn(className, open && "bg-secondary/50")}
        >
          {content}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-1">
        <DatePickerCalendar {...props} />
      </PopoverContent>
    </Popover>
  );
}
