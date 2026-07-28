import type React from "react";
import { useTranslation } from "react-i18next";

export type NoteTitleProps = Omit<React.ComponentProps<"span">, "children"> & {
  children: string | null | undefined;
};

export const NoteTitle = ({ children, ...props }: NoteTitleProps) => {
  const { t } = useTranslation();
  return <span {...props}>{children || t("defaults.pageTitle")}</span>;
};
