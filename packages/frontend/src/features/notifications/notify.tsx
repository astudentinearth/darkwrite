import { ReactNode } from "react";
import { toast as sonner } from "sonner";
import { SuccessToast, Toast } from "./components/base-toast";

function success(content: ReactNode | ReactNode[]) {
  return sonner.custom((id) => (
    <Toast id={id}>
      <SuccessToast>{content}</SuccessToast>
    </Toast>
  ));
}

const notify = {
  success,
};

export default notify;
