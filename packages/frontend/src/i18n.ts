import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(
    Backend(
      (lang: string, namespace: string) =>
        import(`./locales/${lang}/${namespace}.json`),
    ),
  )
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    detection: {
      caches: ["localStorage"],
    },
  });
export default i18n;
