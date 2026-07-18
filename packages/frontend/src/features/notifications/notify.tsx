import type { ReactNode } from "react";
import { toast as sonner } from "sonner";
import {
  ErrorToast,
  InfoToast,
  SuccessToast,
  Toast,
} from "./components/base-toast";

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

function info(content: ReactNode | ReactNode[]) {
  return sonner.custom((id) => (
    <Toast id={id}>
      <InfoToast>{content}</InfoToast>
    </Toast>
  ));
}

function custom(toast: ReactNode) {
  return sonner.custom((id) => <Toast id={id}>{toast}</Toast>);
}

const notify = {
  success,
  error,
  info,
  custom,
};

export default notify;
