import { DarkwriteAPIClient } from "@/api/api-client";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightFromSquare,
  Code2,
  Lock,
  RotateCcw,
  Scale,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import showUpdateToast from "../notifications/update";

export default function About() {
  const { data } = useQuery({
    queryKey: ["client-info"],
    queryFn: DarkwriteAPIClient.desktop.getClientInfo,
  });
  const { t } = useTranslation();
  const checkUpdate = () => {
    showUpdateToast("1.0.0", "https://google.com");
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center pt-3 gap-1 [&_a]:text-primary-text [&_a]:hover:underline">
      <img src="darkwrite_icon.svg" className="size-24 drop-shadow-2xl" />
      <h1 className="text-3xl font-semibold flex items-end gap-2 mt-4">
        Darkwrite
        <span className="text-2xl text-foreground/70">{data?.version}</span>
      </h1>
      <span className="text-xs text-foreground/70">
        {data?.os} | Electron {data?.electronVersion} | Node {data?.nodeVersion}{" "}
        | {data?.isPackaged ? "Packaged" : "Unpackaged"}
      </span>
      <div className="flex gap-2 flex-col text-center items-center mt-4 [&>a]:flex [&>a]:gap-2 [&>a]:items-center">
        <a className="cursor-pointer" onClick={checkUpdate}>
          <RotateCcw size={18} />
          {t("settings.about.checkUpdates")}
        </a>
        <a target="_blank" href="https://github.com/astudentinearth/darkwrite">
          <Code2 size={18} />
          {t("settings.about.sourceCode")}
        </a>
        <a target="_blank" href="https://darkwrite.app">
          <ArrowUpRightFromSquare size={18} />
          {t("settings.about.website")}
        </a>
        <a target="_blank" href="https://darkwrite.app/privacy">
          <Lock size={18} />
          {t("settings.about.privacy")}
        </a>
        <a
          target="_blank"
          href="https://github.com/astudentinearth/darkwrite/blob/dev/LICENSE"
        >
          <Scale size={18} />
          {t("settings.about.license")}
        </a>
      </div>
    </div>
  );
}
