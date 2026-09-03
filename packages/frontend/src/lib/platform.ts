import { OS } from "@darkwrite/common";
import { DarkwriteAPIClient } from "@/api/api-client";

let os: OS = OS.WINDOWS;

const SCROLLBAR_WIDTH_VAR = "--dw-scrollbar-width";

export function measureScrollbarWidth() {
  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = [
    "position:absolute",
    "top:-9999px",
    "left:-9999px",
    "width:100px",
    "height:100px",
    "overflow-y:scroll",
    "scrollbar-width:thin",
    "pointer-events:none",
  ].join(";");
  document.body.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return width;
}

export function initalizePlatform() {
  return DarkwriteAPIClient.desktop.getClientInfo().map((info) => {
    os = info.os;
    document.documentElement.style.setProperty(
      SCROLLBAR_WIDTH_VAR,
      `${measureScrollbarWidth()}px`,
    );
  });
}

export function getOperatingSystem() {
  return os;
}
