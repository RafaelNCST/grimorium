import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCharacterDetail from "../../locales/en/character-detail.json";
import enCharacters from "../../locales/en/characters.json";
import enCommon from "../../locales/en/common.json";
import enCreateBook from "../../locales/en/create-book.json";
import enCreateChapter from "../../locales/en/create-chapter.json";
import enCreateCharacter from "../../locales/en/create-character.json";
import enCreateFaction from "../../locales/en/create-faction.json";
import enCreateItem from "../../locales/en/create-item.json";
import enCreatePlotArc from "../../locales/en/create-plot-arc.json";
import enCreateRace from "../../locales/en/create-race.json";
import enFactionDetail from "../../locales/en/faction-detail.json";
import enFactions from "../../locales/en/factions.json";
import enHome from "../../locales/en/home.json";
import enInbox from "../../locales/en/inbox.json";
import enItemDetail from "../../locales/en/item-detail.json";
import enItems from "../../locales/en/items.json";
import enNoteDetail from "../../locales/en/note-detail.json";
import enNotes from "../../locales/en/notes.json";
import enOverview from "../../locales/en/overview.json";
import enPlot from "../../locales/en/plot.json";
import enPowerSystem from "../../locales/en/power-system.json";
import enRaceDetail from "../../locales/en/race-detail.json";
import enRaces from "../../locales/en/races.json";
import enRegionDetail from "../../locales/en/region-detail.json";
import enSettings from "../../locales/en/settings.json";
import enWorld from "../../locales/en/world.json";
import ptCharacterDetail from "../../locales/pt/character-detail.json";
import ptCharacters from "../../locales/pt/characters.json";
import ptCommon from "../../locales/pt/common.json";
import ptCreateBook from "../../locales/pt/create-book.json";
import ptCreateChapter from "../../locales/pt/create-chapter.json";
import ptCreateCharacter from "../../locales/pt/create-character.json";
import ptCreateFaction from "../../locales/pt/create-faction.json";
import ptCreateItem from "../../locales/pt/create-item.json";
import ptCreatePlotArc from "../../locales/pt/create-plot-arc.json";
import ptCreateRace from "../../locales/pt/create-race.json";
import ptFactionDetail from "../../locales/pt/faction-detail.json";
import ptFactions from "../../locales/pt/factions.json";
import ptHome from "../../locales/pt/home.json";
import ptInbox from "../../locales/pt/inbox.json";
import ptItemDetail from "../../locales/pt/item-detail.json";
import ptItems from "../../locales/pt/items.json";
import ptNoteDetail from "../../locales/pt/note-detail.json";
import ptNotes from "../../locales/pt/notes.json";
import ptOverview from "../../locales/pt/overview.json";
import ptPlot from "../../locales/pt/plot.json";
import ptPowerSystem from "../../locales/pt/power-system.json";
import ptRaceDetail from "../../locales/pt/race-detail.json";
import ptRaces from "../../locales/pt/races.json";
import ptRegionDetail from "../../locales/pt/region-detail.json";
import ptSettings from "../../locales/pt/settings.json";
import ptWorld from "../../locales/pt/world.json";

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    inbox: enInbox,
    characters: enCharacters,
    "character-detail": enCharacterDetail,
    "create-book": enCreateBook,
    "create-chapter": enCreateChapter,
    "create-character": enCreateCharacter,
    "create-faction": enCreateFaction,
    "create-item": enCreateItem,
    "create-plot-arc": enCreatePlotArc,
    "create-race": enCreateRace,
    "faction-detail": enFactionDetail,
    factions: enFactions,
    "item-detail": enItemDetail,
    items: enItems,
    notes: enNotes,
    "note-detail": enNoteDetail,
    overview: enOverview,
    plot: enPlot,
    "power-system": enPowerSystem,
    "race-detail": enRaceDetail,
    races: enRaces,
    "region-detail": enRegionDetail,
    settings: enSettings,
    world: enWorld,
  },
  pt: {
    common: ptCommon,
    home: ptHome,
    inbox: ptInbox,
    characters: ptCharacters,
    "character-detail": ptCharacterDetail,
    "create-book": ptCreateBook,
    "create-chapter": ptCreateChapter,
    "create-character": ptCreateCharacter,
    "create-faction": ptCreateFaction,
    "create-item": ptCreateItem,
    "create-plot-arc": ptCreatePlotArc,
    "create-race": ptCreateRace,
    "faction-detail": ptFactionDetail,
    factions: ptFactions,
    "item-detail": ptItemDetail,
    items: ptItems,
    notes: ptNotes,
    "note-detail": ptNoteDetail,
    overview: ptOverview,
    plot: ptPlot,
    "power-system": ptPowerSystem,
    "race-detail": ptRaceDetail,
    races: ptRaces,
    "region-detail": ptRegionDetail,
    settings: ptSettings,
    world: ptWorld,
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
