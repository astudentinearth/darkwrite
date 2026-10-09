import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui";
import { ErrorTrace } from "./error-trace";
import "@/globals.css";
import "@/i18n";
import React, { use } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ErrorContext {
  error: unknown;
  resetErrorBoundary: (...args: unknown[]) => unknown;
}

const ErrorContext = React.createContext<ErrorContext>({
  error: null,
  resetErrorBoundary: () => {},
});

export enum ErrorAction {
  PageReload = "reload",
  ComponentReset = "reset",
}

export type RootErrorBoundaryProps = {
  children: ReactNode | ReactNode[];
};

export type DwErrorBoundaryProps = {
  children: ReactNode | ReactNode[];
  errorTitle: string;
  errorDescription: string;
  defaultAction: ErrorAction;
  className?: string;
  resetKeys?: string[];
};

const ErrorView = ({
  errorTitle,
  defaultAction,
  errorDescription,
  className,
}: Omit<DwErrorBoundaryProps, "children">) => {
  const { error, resetErrorBoundary } = use(ErrorContext);
  const { t } = useTranslation();
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className="flex flex-col no-window-drag justify-start w-2/3 items-start gap-2">
        <h1 className="text-2xl font-semibold pl-0.5">{errorTitle}</h1>
        <p className="text-muted-foreground text-sm pl-0.5">
          {errorDescription}
        </p>
        <hr />
        <ErrorTrace error={error} />
        <div className="flex w-full">
          <Button
            variant="secondary"
            onClick={() =>
              window.open(
                "https://github.com/astudentinearth/darkwrite/issues",
                "_blank",
              )
            }
          >
            {t("error.action.report")}
          </Button>
          <div className="grow" />
          {defaultAction === ErrorAction.PageReload && (
            <Button onClick={() => window.location.reload()}>
              {t("error.action.reload")}
            </Button>
          )}

          {defaultAction === ErrorAction.ComponentReset && (
            <Button onClick={() => resetErrorBoundary()}>
              {t("error.action.reload")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const wrapBoundary =
  (opts: Omit<DwErrorBoundaryProps, "children">) => (props: FallbackProps) => (
    <ErrorContext.Provider value={props}>
      <ErrorView {...opts} />
    </ErrorContext.Provider>
  );

export const DwErrorBoundary = ({
  children,
  resetKeys,
  ...props
}: DwErrorBoundaryProps) => (
  <ErrorBoundary resetKeys={resetKeys} FallbackComponent={wrapBoundary(props)}>
    {children}
  </ErrorBoundary>
);

export const RootErrorBoundary = ({ children }: RootErrorBoundaryProps) => {
  const { t } = useTranslation();
  return (
    <DwErrorBoundary
      errorTitle={t("error.root.title")}
      errorDescription={t("error.root.description")}
      defaultAction={ErrorAction.PageReload}
      className="bg-background fixed titlebar inset-0 "
    >
      {children}
    </DwErrorBoundary>
  );
};
