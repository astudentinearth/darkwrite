import { ReactNode } from "react";
import { toast as sonner } from "sonner";
import { ErrorToast, SuccessToast, Toast } from "./components/base-toast";

function success(content: ReactNode | ReactNode[]) {
  return sonner.custom((id) => (
    <Toast id={id}>
      <SuccessToast>{content}</SuccessToast>
    </Toast>
  ));
}

function error(content: ReactNode | ReactNode[]) {
  return sonner.custom((id) => (
    <Toast id={id}>
      <ErrorToast>{content}</ErrorToast>
    </Toast>
  ));
}

function custom(toast: ReactNode) {
  return sonner.custom((id) => <Toast id={id}>{toast}</Toast>);
}

const notify = {
  success,
  error,
  custom,
};

export default notify;
