import { getErrorMessage as _getMessage } from "react-error-boundary";
import { cn } from "@/lib/utils";

export const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? `${error.name}\n${error.message}\n---\nStack trace: \n${error.stack}`
    : _getMessage(error);

export const ErrorTrace = ({
  error,
  className,
  ...props
}: { error: unknown } & React.ComponentProps<"textarea">) => (
  <textarea
    value={getErrorMessage(error)}
    className={cn(
      "bg-secondary rounded-md top-highlight p-2 w-full h-64 darkwrite-mono text-sm ring-default",
      className,
    )}
    {...props}
    readOnly
  />
);
