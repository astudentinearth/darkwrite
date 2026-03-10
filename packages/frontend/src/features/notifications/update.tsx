import { toast } from "sonner";
import UpdateToast from "./update-toast";

export default function showUpdateToast(version: string, href: string) {
  toast(<UpdateToast version={version} href={href} />, {
    id: "updater-notification",
    className: "z-999",
  });
}
