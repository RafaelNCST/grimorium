import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCharacterDetail from "../../locales/en/character-detail.json";
import enCharacters from "../../locales/en/characters.json";
import enCreateBook from "../../locales/en/create-book.json";
import enCreateCharacter from "../../locales/en/create-character.json";
import enCreateItem from "../../locales/en/create-item.json";
import enCreateRace from "../../locales/en/create-race.json";
import enHome from "../../locales/en/home.json";
import enInbox from "../../locales/en/inbox.json";
import enItemDetail from "../../locales/en/item-detail.json";
import enItems from "../../locales/en/items.json";
import enOverview from "../../locales/en/overview.json";
import enRaces from "../../locales/en/races.json";
import ptCharacterDetail from "../../locales/pt/character-detail.json";
import ptCharacters from "../../locales/pt/characters.json";
import ptCreateBook from "../../locales/pt/create-book.json";
import ptCreateCharacter from "../../locales/pt/create-character.json";
import ptCreateItem from "../../locales/pt/create-item.json";
import ptCreateRace from "../../locales/pt/create-race.json";
import ptHome from "../../locales/pt/home.json";
import ptInbox from "../../locales/pt/inbox.json";
import ptItemDetail from "../../locales/pt/item-detail.json";
import ptItems from "../../locales/pt/items.json";
import ptOverview from "../../locales/pt/overview.json";
import ptRaces from "../../locales/pt/races.json";

const resources = {
  en: {
    home: enHome,
    inbox: enInbox,
    characters: enCharacters,
    "character-detail": enCharacterDetail,
    "create-book": enCreateBook,
    "create-character": enCreateCharacter,
    "create-item": enCreateItem,
    "create-race": enCreateRace,
    "item-detail": enItemDetail,
    items: enItems,
    overview: enOverview,
    races: enRaces,
  },
  pt: {
    home: ptHome,
    inbox: ptInbox,
    characters: ptCharacters,
    "character-detail": ptCharacterDetail,
    "create-book": ptCreateBook,
    "create-character": ptCreateCharacter,
    "create-item": ptCreateItem,
    "create-race": ptCreateRace,
    "item-detail": ptItemDetail,
    items: ptItems,
    overview: ptOverview,
    races: ptRaces,
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
