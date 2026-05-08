import UpdateToast from "./update-toast";
import notify from "./notify";

export default function showUpdateToast(version: string, href: string) {
  notify.custom(<UpdateToast version={version} href={href} />);
}
