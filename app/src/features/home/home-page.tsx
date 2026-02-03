import { useTranslation } from "react-i18next";
import ConstrainedWidth from "../editor/constrained-width";
import RecentNotes from "./recents";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center flex-col px-24 editor-fade-in min-h-full relative p-12">
      <ConstrainedWidth className="flex flex-col gap-6">
        <h1 className="text-2xl pl-2 font-semibold tracking-tight">
          {t("home.welcome")}
        </h1>
        <RecentNotes />
      </ConstrainedWidth>
    </div>
  );
}
