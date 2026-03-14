import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";
import frTranslations from "./locales/fr.json";
import bnTranslations from "./locales/bn.json";
import hiTranslations from "./locales/hi.json";
import arTranslations from "./locales/ar.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  es: {
    translation: esTranslations,
  },
  fr: {
    translation: frTranslations,
  },
  bn: {
    translation: bnTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
  ar: {
    translation: arTranslations,
  },
};

// Get saved language from localStorage or use default (handle SSR)
const savedLanguage =
  typeof window !== "undefined"
    ? localStorage.getItem("language") || "en"
    : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
