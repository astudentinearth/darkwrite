import "i18next";
import ns from "@darkwrite/i18n/locales/en/translation.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof ns;
    };
  }
}
