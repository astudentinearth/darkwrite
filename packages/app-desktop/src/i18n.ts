import en from "@darkwrite/i18n/locales/en/translation.json";
import tr from "@darkwrite/i18n/locales/tr/translation.json";
import { createInstance } from "i18next";

const i18n = createInstance();

export function initI18n(language: string) {
  i18n.init({
    lng: language,
    fallbackLng: "en",
    initImmediate: false,
    resources: {
      en: { translation: en },
      tr: { translation: tr },
    },
  });
}

/** @returns true if the language actually changed */
export function setLanguage(language: string): boolean {
  if (!language || i18n.language === language) return false;
  i18n.changeLanguage(language);
  return true;
}

export function t(...args: Parameters<typeof i18n.t>): string {
  return i18n.t(...args);
}
