import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enEncyclopedia from "../../locales/en/encyclopedia.json";
import enHome from "../../locales/en/home.json";
import ptEncyclopedia from "../../locales/pt/encyclopedia.json";
import ptHome from "../../locales/pt/home.json";

const resources = {
  en: {
    home: enHome,
    encyclopedia: enEncyclopedia,
  },
  pt: {
    home: ptHome,
    encyclopedia: ptEncyclopedia,
  },
};

const getStoredLanguage = (): string => {
  try {
    const stored = localStorage.getItem("language-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.language || "pt";
    }
  } catch {
    return "pt";
  }
  return "pt";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage(),
  fallbackLng: "pt",
  defaultNS: "home",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
