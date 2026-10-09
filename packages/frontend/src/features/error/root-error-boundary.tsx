import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui";
import { ErrorTrace } from "./error-trace";
import "@/globals.css";
import "@/i18n";
import type { DwError } from "@darkwrite/common";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { DarkwriteAPIClient } from "@/api/api-client";
import { cn } from "@/lib/utils";

// Redux/stateful logic should not get imported in this file.
// If the error screen also fails, who handles that?

export enum ErrorAction {
  PageReload = "reload",
  /** Attempts to call a reset function to potentially reach a healthy state. */
  ComponentReset = "reset",
  AppRelaunch = "app-restart",
}

const ErrorScreenStyle = {
  Fullscreen: "bg-background fixed titlebar inset-0",
  Default: "bg-transparent",
};

export type RootErrorBoundaryProps = {
  children: ReactNode | ReactNode[];
};

export type DwErrorViewProps = {
  errorTitle: string;
  errorDescription: string;
  defaultAction: ErrorAction;
  className?: string;
  error: Error | DwError | unknown;
  resetFn?: (...args: unknown[]) => unknown;
};

export type DwErrorBoundaryProps = Omit<
  DwErrorViewProps,
  "resetFn" | "error"
> & {
  children: ReactNode | ReactNode[];
  /** A change in these keys automatically resets the error boundary.
   * Use this to prevent an error in Note A from staying through Note B. */
  resetKeys?: string[];
};

const DwErrorView = ({
  errorTitle,
  defaultAction,
  errorDescription,
  className,
  error,
  resetFn,
}: DwErrorViewProps) => {
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
            <Button onClick={() => resetFn?.()}>
              {t("error.action.reload")}
            </Button>
          )}

          {defaultAction === ErrorAction.AppRelaunch && (
            <Button onClick={() => DarkwriteAPIClient.desktop.relaunch()}>
              {t("error.action.relaunch")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/** Wrapper to keep error screen independent from react-error-boundary logic. */
const wrapBoundary =
  (opts: Omit<DwErrorBoundaryProps, "children">) => (props: FallbackProps) => (
    <DwErrorView
      {...opts}
      resetFn={props.resetErrorBoundary}
      error={props.error}
    />
  );

/** Generic error boundary component that captures thrown render-time errors and automatically
 * displays a message, accompanied by traces if available. */
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
      className={ErrorScreenStyle.Fullscreen}
    >
      {children}
    </DwErrorBoundary>
  );
};

export const InitializationFailureScreen = ({ error }: { error: unknown }) => (
  <DwErrorView
    defaultAction={ErrorAction.AppRelaunch}
    error={error}
    errorTitle={t("error.init.title")}
    errorDescription={t("error.init.description")}
    className={ErrorScreenStyle.Fullscreen}
  ></DwErrorView>
);
