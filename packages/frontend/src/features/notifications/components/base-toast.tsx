import { cn } from "@/lib/utils";
import { CheckCircle, X, XCircle } from "lucide-react";
import React, { type ReactNode, use } from "react";
import { toast as sonner } from "sonner";

export type ToastProps = {
  children: ReactNode | ReactNode[];
  id: string | number;
};

type ToastContextType = {
  id: string | number;
};

const ToastContext = React.createContext<ToastContextType>({ id: "" });

export function Toast({ children, id }: ToastProps) {
  return (
    <ToastContext.Provider value={{ id }}>{children}</ToastContext.Provider>
  );
}

export type ToastContainerProps = React.ComponentProps<"div">;

export default function ToastContainer({
  children,
  className,
}: ToastContainerProps) {
  return (
    <div
      className={cn(
        "rounded-full border-border/50 border bg-background dark:bg-view-2 px-3 py-2 top-highlight drop-shadow-xl drop-shadow-black/8 flex max-w-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ToastClose() {
  const { id } = use(ToastContext);

  return (
    <button
      onClick={() => sonner.dismiss(id)}
      className="text-muted-foreground hover:text-foreground bg-transparent"
    >
      <X size={16} />
    </button>
  );
}

export type SuccessToastProps = {
  children: ReactNode | ReactNode[];
  className?: string;
};

export function SuccessToast({ children, className }: SuccessToastProps) {
  return (
    <ToastContainer className={cn("items-center", className)}>
      <CheckCircle size={16} />
      <div className="w-2"></div>
      <div className="-translate-y-px flex">{children}</div>
      <div className="w-4"></div>
      <ToastClose />
    </ToastContainer>
  );
}

export function ErrorToast({ children, className }: SuccessToastProps) {
  return (
    <ToastContainer className={cn("items-center", className)}>
      <XCircle className="text-destructive" size={16} />
      <div className="w-2"></div>
      <div className="-translate-y-px flex text-destructive">{children}</div>
      <div className="w-4"></div>
      <ToastClose />
    </ToastContainer>
  );
}
