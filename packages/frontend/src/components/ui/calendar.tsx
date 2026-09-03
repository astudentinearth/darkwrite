import type { DateRange } from "@darkwrite/common";
import {
  DayPicker,
  type DayPickerLocale,
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
import { enUS } from "@daypicker/react/locale/en-US";
import { tr } from "@daypicker/react/locale/tr";
import { zhCN } from "@daypicker/react/locale/zh-CN";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
} from "@tabler/icons-react";

export type DatePickerCalendarProps = {
  mode: DayPickerProps["mode"];
  onChange: (range: DateRange) => void;
  value: DateRange | undefined;
};

const lngToLocaleMap: Record<string, DayPickerLocale> = {
  tr: tr,
  en: enUS,
  "zh-CN": zhCN,
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const _default = getDefaultClassNames();

export function DatePickerCalendar(props: DatePickerProps) {
  const { i18n } = useTranslation();
  return (
    <DayPicker
      required
      mode="range"
      selected={props.value}
      captionLayout="dropdown"
      navLayout="around"
      endMonth={new Date(new Date().getFullYear() + 5, 12)}
      onSelect={props.onChange}
      locale={lngToLocaleMap[i18n.resolvedLanguage ?? "en"] ?? enUS}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "right")
            return (
              <IconChevronRight
                className={cn("size-4", className)}
                {...props}
              />
            );
          if (orientation === "left")
            return (
              <IconChevronLeft className={cn("size-4", className)} {...props} />
            );
          if (orientation === "up")
            return (
              <IconChevronUp className={cn("size-4", className)} {...props} />
            );
          return (
            <IconChevronDown className={cn("size-4", className)} {...props} />
          );
        },
      }}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleDateString(i18n.resolvedLanguage, { month: "short" }),
      }}
      classNames={{
        dropdown_root: cn(
          "px-1.5 py-1 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 ring-primary/50",
          _default.dropdown_root,
        ),
        dropdown: cn("bg-view-1", _default.dropdown),
        button_previous: cn(
          "hover:bg-secondary/50! rounded-lg cursor-default! size-8! focus-visible:outline-none focus-visible:ring-2 ring-primary/50",
          _default.button_previous,
        ),
        button_next: cn(
          "hover:bg-secondary/50! rounded-lg cursor-default! size-8! focus-visible:outline-none focus-visible:ring-2 ring-primary/50",
          _default.button_next,
        ),
        day_button: cn(
          "rounded-lg! cursor-default! focus-visible:outline-none focus-visible:ring-2 ring-primary/50",
          _default.day_button,
        ),
      }}
    />
  );
}

export type DatePickerProps = DatePickerCalendarProps & {
  className?: string;
};

const formatDate = (date: Date, locale?: string) =>
  date.toLocaleDateString(locale, { day: "numeric", month: "short" });

const formatRange = (range: DateRange, locale?: string) => {
  if (!range.from) return null;
  if (range.from?.valueOf() === range.to?.valueOf())
    return formatDate(range.from, locale);
  return `${formatDate(range.from, locale)}${range.to ? " → " : ""}${range.to ? formatDate(range.to, locale) : ""}`;
};

export function DatePicker({ className, ...props }: DatePickerProps) {
  const { t, i18n } = useTranslation();
  const content =
    (props.value ? formatRange(props.value, i18n.resolvedLanguage) : null) ??
    t("ui.datepicker.hint");

  const [open, setOpen] = useState(false);

  const inDays = (days: number) => () => {
    const date = new Date(Date.now() + days * ONE_DAY_MS);
    props.onChange({ from: date, to: date });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(className, open && "bg-secondary/50")}
        >
          {content}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2 gap-2 flex flex-col">
        <DatePickerCalendar {...props} />
        <hr />
        <div className="flex gap-1 [&>button]:text-xs">
          <Button
            variant="secondary"
            onClick={inDays(0)}
            className="h-fit px-2 py-1.5 grow"
          >
            {t("ui.datepicker.today")}
          </Button>
          <Button
            variant="secondary"
            onClick={inDays(1)}
            className="h-fit px-2 py-1.5 grow"
          >
            {t("ui.datepicker.tomorrow")}
          </Button>
          <Button
            variant="secondary"
            onClick={inDays(7)}
            className="h-fit px-2 py-1.5 grow"
          >
            {t("ui.datepicker.nextWeek")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
