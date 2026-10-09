import { type ReactNode, use } from "react";
import { useTranslation } from "react-i18next";
import {
  DwErrorBoundary,
  ErrorAction,
} from "@/features/error/root-error-boundary";
import { EditorContext } from "../store/editor-context";

export const EditorErrorBoundary = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const { t } = useTranslation();
  const { noteId } = use(EditorContext);
  return (
    <DwErrorBoundary
      errorTitle={t("editor.error.title")}
      errorDescription={t("editor.error.description")}
      defaultAction={ErrorAction.ComponentReset}
      className="w-full h-full"
      resetKeys={[noteId]}
    >
      {children}
    </DwErrorBoundary>
  );
};
