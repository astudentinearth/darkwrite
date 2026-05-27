import notify from "./notify";
import UpdateToast from "./update-toast";

export default function showUpdateToast(version: string, href: string) {
  notify.custom(<UpdateToast version={version} href={href} />);
}
