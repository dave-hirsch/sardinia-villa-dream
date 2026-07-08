import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/i18n/locales/en.json";
import de from "@/i18n/locales/de.json";
import it from "@/i18n/locales/it.json";
import fr from "@/i18n/locales/fr.json";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: { en: { translation: en }, de: { translation: de }, it: { translation: it }, fr: { translation: fr } },
      fallbackLng: "en",
      supportedLngs: ["en", "de", "it", "fr"],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "msv-lang",
      },
    });
}

export default i18n;
