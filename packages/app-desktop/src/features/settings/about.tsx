import { Button } from "@darkwrite/ui";
import { useClientInfo } from "@/hooks/query";
import { useUpdate } from "@/hooks/query/use-update";
import { Bug, Code, RotateCw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import UpdateDialog from "./update-prompt";
import { useToast } from "@/hooks/use-toast";

export function AboutCard() {
  const data = useClientInfo();
  const updateQuery = useUpdate();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const toaster = useToast();
  const { t } = useTranslation(undefined, { keyPrefix: "settings.about" });
  const checkUpdate = ()=>updateQuery.refetch().then(result=>{
    if(!result.data) return;
    if(!result.data.updateAvailable) toaster.showNoUpdateNotification();
  });
  return (
    <div className="p-4 rounded-2xl bg-view-2 flex flex-col gap-4 border border-border/50">
      <div className="grid grid-cols-[64px_1fr] grid-rows-[auto] gap-4">
        <img src="icon64.png" />
        <div className="flex flex-col">
          <h2 className="font-semibold text-xl flex items-center gap-1">
            Darkwrite <span className="opacity-75">{data?.version}</span>
          </h2>
          {window.isElectron && (
            <>
              <div className="opacity-50">
                electron {data?.electronVersion} | node {data?.nodeVersion} |{" "}
                {data?.os}
              </div>
              <div className="opacity-50">
                packaged: {String(data?.isPackaged)}
              </div>
            </>
          )}
          <div className="flex gap-2">
            <a
              target="_blank"
              href="https://github.com/astudentinearth/darkwrite"
              className="hover:underline flex items-center gap-1"
            >
              <Code size={18} />
              {t("sourceCode")}
            </a>{" "}
            |{" "}
            <a
              target="_blank"
              href="https://github.com/astudentinearth/darkwrite/issues"
              className="hover:underline flex items-center gap-1"
            >
              <Bug size={18} />
              {t("reportBugs")}
            </a>
            {window.isElectron && (
              <>
                {" "}
                |{" "}
                <Button
                  className="h-fit px-0 py-0 text-foreground text-md font-normal"
                  variant={"link"}
                  onClick={checkUpdate}
                  disabled={updateQuery.isFetching}
                >
                  <RotateCw size={18} />
                  {t("checkUpdates")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {window.isElectron && <UpdateDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen} update={updateQuery.data || undefined}/>}
    </div>
  );
}
