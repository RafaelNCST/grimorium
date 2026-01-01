import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAdvancedSettings from "../../locales/en/advanced-settings.json";
import enChapterCard from "../../locales/en/chapter-card.json";
import enChapterEditor from "../../locales/en/chapter-editor.json";
import enChapterMetrics from "../../locales/en/chapter-metrics.json";
import enChapterWarnings from "../../locales/en/chapter-warnings.json";
import enChapters from "../../locales/en/chapters.json";
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
import enDialogs from "../../locales/en/dialogs.json";
import enEmptyStates from "../../locales/en/empty-states.json";
import enEntityLogs from "../../locales/en/entity-logs.json";
import enEntityReference from "../../locales/en/entity-reference.json";
import enErrors from "../../locales/en/errors.json";
import enExportPreview from "../../locales/en/export-preview.json";
import enFactionDetail from "../../locales/en/faction-detail.json";
import enFactions from "../../locales/en/factions.json";
import enForms from "../../locales/en/forms.json";
import enGallery from "../../locales/en/gallery.json";
import enGlobalGoals from "../../locales/en/global-goals.json";
import enHome from "../../locales/en/home.json";
import enInbox from "../../locales/en/inbox.json";
import enItemDetail from "../../locales/en/item-detail.json";
import enItems from "../../locales/en/items.json";
import enLoading from "../../locales/en/loading.json";
import enOverview from "../../locales/en/overview.json";
import enPlot from "../../locales/en/plot.json";
import enPowerSystem from "../../locales/en/power-system.json";
import enRaceDetail from "../../locales/en/race-detail.json";
import enRaces from "../../locales/en/races.json";
import enRegionDetail from "../../locales/en/region-detail.json";
import enSettings from "../../locales/en/settings.json";
import enTooltips from "../../locales/en/tooltips.json";
import enUpgrade from "../../locales/en/upgrade.json";
import enWarningsSettings from "../../locales/en/warnings-settings.json";
import enWelcome from "../../locales/en/welcome.json";
import enWorld from "../../locales/en/world.json";
import ptAdvancedSettings from "../../locales/pt/advanced-settings.json";
import ptChapterCard from "../../locales/pt/chapter-card.json";
import ptChapterEditor from "../../locales/pt/chapter-editor.json";
import ptChapterMetrics from "../../locales/pt/chapter-metrics.json";
import ptChapterWarnings from "../../locales/pt/chapter-warnings.json";
import ptChapters from "../../locales/pt/chapters.json";
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
import ptDialogs from "../../locales/pt/dialogs.json";
import ptEmptyStates from "../../locales/pt/empty-states.json";
import ptEntityLogs from "../../locales/pt/entity-logs.json";
import ptEntityReference from "../../locales/pt/entity-reference.json";
import ptErrors from "../../locales/pt/errors.json";
import ptExportPreview from "../../locales/pt/export-preview.json";
import ptFactionDetail from "../../locales/pt/faction-detail.json";
import ptFactions from "../../locales/pt/factions.json";
import ptForms from "../../locales/pt/forms.json";
import ptGallery from "../../locales/pt/gallery.json";
import ptGlobalGoals from "../../locales/pt/global-goals.json";
import ptHome from "../../locales/pt/home.json";
import ptInbox from "../../locales/pt/inbox.json";
import ptItemDetail from "../../locales/pt/item-detail.json";
import ptItems from "../../locales/pt/items.json";
import ptLoading from "../../locales/pt/loading.json";
import ptOverview from "../../locales/pt/overview.json";
import ptPlot from "../../locales/pt/plot.json";
import ptPowerSystem from "../../locales/pt/power-system.json";
import ptRaceDetail from "../../locales/pt/race-detail.json";
import ptRaces from "../../locales/pt/races.json";
import ptRegionDetail from "../../locales/pt/region-detail.json";
import ptSettings from "../../locales/pt/settings.json";
import ptTooltips from "../../locales/pt/tooltips.json";
import ptUpgrade from "../../locales/pt/upgrade.json";
import ptWarningsSettings from "../../locales/pt/warnings-settings.json";
import ptWelcome from "../../locales/pt/welcome.json";
import ptWorld from "../../locales/pt/world.json";

const resources = {
  en: {
    "advanced-settings": enAdvancedSettings,
    common: enCommon,
    home: enHome,
    inbox: enInbox,
    characters: enCharacters,
    chapters: enChapters,
    "chapter-card": enChapterCard,
    "character-detail": enCharacterDetail,
    "chapter-editor": enChapterEditor,
    "chapter-metrics": enChapterMetrics,
    "chapter-warnings": enChapterWarnings,
    "create-book": enCreateBook,
    "create-chapter": enCreateChapter,
    "create-character": enCreateCharacter,
    "create-faction": enCreateFaction,
    "create-item": enCreateItem,
    "create-plot-arc": enCreatePlotArc,
    "create-race": enCreateRace,
    dialogs: enDialogs,
    "empty-states": enEmptyStates,
    "entity-logs": enEntityLogs,
    "entity-reference": enEntityReference,
    errors: enErrors,
    "export-preview": enExportPreview,
    "faction-detail": enFactionDetail,
    factions: enFactions,
    forms: enForms,
    gallery: enGallery,
    "global-goals": enGlobalGoals,
    "item-detail": enItemDetail,
    items: enItems,
    loading: enLoading,
    overview: enOverview,
    plot: enPlot,
    "power-system": enPowerSystem,
    "race-detail": enRaceDetail,
    races: enRaces,
    "region-detail": enRegionDetail,
    settings: enSettings,
    tooltips: enTooltips,
    upgrade: enUpgrade,
    "warnings-settings": enWarningsSettings,
    welcome: enWelcome,
    world: enWorld,
  },
  pt: {
    "advanced-settings": ptAdvancedSettings,
    common: ptCommon,
    home: ptHome,
    inbox: ptInbox,
    characters: ptCharacters,
    chapters: ptChapters,
    "chapter-card": ptChapterCard,
    "character-detail": ptCharacterDetail,
    "chapter-editor": ptChapterEditor,
    "chapter-metrics": ptChapterMetrics,
    "chapter-warnings": ptChapterWarnings,
    "create-book": ptCreateBook,
    "create-chapter": ptCreateChapter,
    "create-character": ptCreateCharacter,
    "create-faction": ptCreateFaction,
    "create-item": ptCreateItem,
    "create-plot-arc": ptCreatePlotArc,
    "create-race": ptCreateRace,
    dialogs: ptDialogs,
    "empty-states": ptEmptyStates,
    "entity-logs": ptEntityLogs,
    "entity-reference": ptEntityReference,
    errors: ptErrors,
    "export-preview": ptExportPreview,
    "faction-detail": ptFactionDetail,
    factions: ptFactions,
    forms: ptForms,
    gallery: ptGallery,
    "global-goals": ptGlobalGoals,
    "item-detail": ptItemDetail,
    items: ptItems,
    loading: ptLoading,
    overview: ptOverview,
    plot: ptPlot,
    "power-system": ptPowerSystem,
    "race-detail": ptRaceDetail,
    races: ptRaces,
    "region-detail": ptRegionDetail,
    settings: ptSettings,
    tooltips: ptTooltips,
    upgrade: ptUpgrade,
    "warnings-settings": ptWarningsSettings,
    welcome: ptWelcome,
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
