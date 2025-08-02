import { KeyPrefix } from "i18next";
import { useTranslation } from "react-i18next";

export const useT = (keyPrefix: KeyPrefix<"translation"> = undefined) => {
  const { t } = useTranslation(undefined, { keyPrefix });
  return t;
};
