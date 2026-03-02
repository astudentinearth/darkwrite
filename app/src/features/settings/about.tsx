import { DarkwriteAPIClient } from "@/api/api-client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightFromSquare,
  Code2,
  Lock,
  RotateCw,
  Scale,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUpdate } from "../update/use-update";

function AboutButton(props: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={props.href}
      target="_blank"
      className="flex gap-2 items-center top-highlight rounded-lg h-fit px-large text-foreground py-medium bg-view-2 hover:bg-view-2/80 w-full"
    >
      {props.children}
    </a>
  );
}

export default function About() {
  const { data } = useQuery({
    queryKey: ["client-info"],
    queryFn: DarkwriteAPIClient.desktop.getClientInfo,
  });
  const { data: updateData, refetch, isFetching } = useUpdate();
  const { t } = useTranslation();
  const checkUpdate = () => {
    refetch(undefined, true);
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center pt-3 gap-1">
      <img src="darkwrite_icon.svg" className="size-24 drop-shadow-2xl" />
      <h1 className="text-3xl font-semibold flex items-end gap-2 mt-4">
        Darkwrite
        <span className="text-2xl text-foreground/70">{data?.version}</span>
      </h1>
      <span className="text-xs text-foreground/70">
        {data?.os} | Electron {data?.electronVersion} | Node {data?.nodeVersion}{" "}
        | {data?.isPackaged ? "Packaged" : "Unpackaged"}
      </span>
      <div className="gap-2 text-center grid w-120 grid-cols-[1fr_1fr] items-center mt-4">
        {updateData ? (
          <div className="bg-view-2 top-highlight col-span-2 rounded-lg px-large py-medium flex justify-between items-center">
            {!updateData.updateAvailable ? (
              t("toast.update.upToDate")
            ) : (
              <>
                <span className="flex">
                  {t("toast.update.description", {
                    version: updateData.latest,
                  })}
                </span>
                <a
                  href={updateData.release_page}
                  className="text-primary-text hover:underline"
                >
                  {t("toast.update.releasePageButton")}
                </a>
              </>
            )}
          </div>
        ) : (
          <a
            className="cursor-pointer col-span-2 px-large py-medium bg-view-2 top-highlight rounded-lg hover:underline flex items-center gap-2 justify-center"
            onClick={checkUpdate}
          >
            <RotateCw className={cn(isFetching && "animate-spin")} size={18} />
            {t("settings.about.checkUpdates")}
          </a>
        )}
        <AboutButton href="https://github.com/astudentinearth/darkwrite">
          <Code2 size={18} />
          {t("settings.about.sourceCode")}
        </AboutButton>
        <AboutButton href="https://darkwrite.app">
          <ArrowUpRightFromSquare size={18} />
          {t("settings.about.website")}
        </AboutButton>
        <AboutButton href="https://darkwrite.app/privacy">
          <Lock size={18} />
          {t("settings.about.privacy")}
        </AboutButton>
        <AboutButton href="https://github.com/astudentinearth/darkwrite/blob/dev/LICENSE">
          <Scale size={18} />
          {t("settings.about.license")}
        </AboutButton>
      </div>
    </div>
  );
}
