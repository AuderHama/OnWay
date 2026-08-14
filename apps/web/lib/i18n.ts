import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locals/en.json";
import ckb from "../locals/ckb.json";

const RTL_LOCALES = new Set(["ckb"]);

export function isRtlLocale(locale: string) {
  return RTL_LOCALES.has(locale);
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ckb: { translation: ckb },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
