import { Button } from "@darkwrite/ui";
import { cn } from "@/lib/utils";
import { House, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export function NavigationWidget() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <div className="rounded-[12px] flex flex-col gap-0.5">
      <Button
        onClick={() => navigate("/")}
        variant={"ghost"}
        className={cn(
          "rounded-[8px] gap-0 hover:bg-secondary/50 text-foreground/75 hover:text-foreground active:bg-secondary/25 transition-colors grid grid-cols-[24px_1fr] select-none p-1 pl-2 h-8 overflow-hidden",
          location.pathname === "/"
            ? "text-foreground bg-secondary/80"
            : "text-foreground/60",
        )}
      >
        <House size={16}></House>
        <span className="justify-self-start">{t("sidebar.button.home")}</span>
      </Button>
      <Button
        onClick={() => navigate("/settings")}
        variant={"ghost"}
        className={cn(
          "rounded-[8px] hover:bg-secondary/50 gap-0 text-foreground/75 hover:text-foreground active:bg-secondary/25 transition-colors grid grid-cols-[24px_1fr] select-none p-1 pl-2 h-8 overflow-hidden",
          location.pathname === "/settings"
            ? "text-foreground bg-secondary/80"
            : "text-foreground/60",
        )}
      >
        <Settings size={16}></Settings>
        <span className="justify-self-start">
          {t("sidebar.button.settings")}
        </span>
      </Button>
    </div>
  );
}
