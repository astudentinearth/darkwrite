import { DEFAULT_THEME_LIST, DEFAULT_THEMES } from "@darkwrite/common";
import { IconLanguage } from "@tabler/icons-react";
import type React from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Switch,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { LanguageChooser } from "../settings/components/language-chooser";
import { BackButton } from "./onboarding-button";
import OnboardingPageRoot from "./onboarding-page-root";
import {
  finishOnboarding,
  getOnboardingPage,
  pageProgress,
  setOnboardingTheme,
  useOnboardingState,
} from "./onboarding-state";

const Titlebar = () => (
  <div className="fixed left-0 right-0 h-12 titlebar"></div>
);

function WindowRoot({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className="fixed w-full h-full left-0 right-0 bg-background text-2xl fade-in"
      {...props}
    >
      {children}
    </div>
  );
}

const ContentPane = ({ children }: { children: [ReactNode, ReactNode] }) => (
  <div className="grid grid-cols-[1fr_480px] w-full h-full">{children}</div>
);

const CoverImage = () => (
  <img
    src="onboarding.webp"
    className="object-cover object-bottom w-full h-full titlebar brightness-65"
  />
);

const OnboardingUX = () => {
  const { t, i18n } = useTranslation();
  const name = useOnboardingState((s) => s.workspaceName);
  const setName = useOnboardingState((s) => s.setWorkspaceName);
  const canContinue = name.trim().length > 0;
  const theme = useOnboardingState((s) => s.theme);
  const updateCheck = useOnboardingState((s) => s.enableUpdateCheck);
  return (
    <div className="w-full p-8 flex border-l bg-background drop-shadow-3xl flex-col text-base h-screen overflow-y-auto gutter-stable scroll-view">
      <img src="darkwrite_icon.png" className="size-16 drop-shadow-xl"></img>
      <h1 className="text-3xl font-semibold mt-4">{t("onboarding.welcome")}</h1>
      <hr className="my-4" />
      <div className="flex justify-between items-center">
        <span className="flex gap-1 w-full">
          <IconLanguage className="size-5" />
          {t("onboarding.chooseLanguage")}
        </span>
        <LanguageChooser
          value={i18n.language}
          onValueChange={i18n.changeLanguage}
          className="shrink-0"
        />
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-3">
        <span>{t("onboarding.welcomeDesc")}</span>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("onboarding.nameWorkspaceHint")}
          className="px-4 w-full bg-view-2 top-highlight"
        />
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-3">
        <span>{t("onboarding.themeDesc")}</span>
        <Select value={theme} onValueChange={(val) => setOnboardingTheme(val)}>
          <SelectTrigger className="bg-view-2 w-full">
            {DEFAULT_THEMES[theme].name}
          </SelectTrigger>
          <SelectContent className="z-50">
            {DEFAULT_THEME_LIST.filter((t) => t.mode === "dark").map(
              (theme) => (
                <SelectItem value={theme.id}>{theme.name}</SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>
      <hr className="my-4" />
      <div className="flex gap-3 items-center pl-1">
        <Switch
          id="updatecheckenabled"
          checked={updateCheck}
          onCheckedChange={(value) =>
            useOnboardingState.setState({ enableUpdateCheck: value })
          }
        />
        <Label className="text-lg" htmlFor="updatecheckenabled">
          {t("onboarding.checkForUpdates")}
        </Label>
      </div>
      <hr className="my-4" />
      <div className="flex justify-end w-full">
        <Button
          disabled={!canContinue}
          onClick={finishOnboarding}
          variant="default"
          className="h-fit transition-opacity duration-150"
        >
          {t("onboarding.letsBegin")}
        </Button>
      </div>
    </div>
  );
};

export default function Onboarding() {
  return (
    <WindowRoot>
      <Titlebar />
      <ContentPane>
        <CoverImage />
        <OnboardingUX />
      </ContentPane>
    </WindowRoot>
  );
}
