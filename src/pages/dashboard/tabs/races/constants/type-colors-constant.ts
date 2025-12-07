import { TFunction } from "i18next";

export const getTypeColorsConstant = (
  t: TFunction
): Record<string, string> => ({
  [t("races:types.aquatic.label")]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  [t("races:types.terrestrial.label")]:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  [t("races:types.flying.label")]:
    "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  [t("races:types.spatial.label")]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  [t("races:types.ethereal.label")]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
});

export const getTypeBadgeColorsConstant = (
  t: TFunction
): Record<string, string> => ({
  [t("races:types.aquatic.label")]:
    "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  [t("races:types.terrestrial.label")]:
    "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
  [t("races:types.flying.label")]:
    "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
  [t("races:types.spatial.label")]:
    "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  [t("races:types.ethereal.label")]:
    "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400",
});
