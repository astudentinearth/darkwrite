import en from "@darkwrite/i18n/locales/en/translation.json";
import tr from "@darkwrite/i18n/locales/tr/translation.json";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      tr: { translation: tr },
    },
    detection: {
      caches: ["localStorage"],
    },
  });
export default i18n;
