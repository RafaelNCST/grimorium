import { FilterRow } from "@/components/entity-list";

export interface RoleStats {
  total: number;
  protagonist: number;
  antagonist: number;
  secondary: number;
  villain: number;
  extra: number;
}

/**
 * Creates filter rows configuration for character roles
 *
 * @param stats Role statistics
 * @param t Translation function
 * @returns Filter rows configuration
 */
export function createRoleFilterRows(
  stats: RoleStats,
  t: (key: string) => string
): FilterRow<string>[] {
  return [
    {
      id: "character-roles",
      items: [
        {
          value: "protagonist",
          label: t("characters:page.protagonist_badge"),
          count: stats.protagonist,
          colorConfig: {
            color: "yellow",
            inactiveClasses: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:!bg-yellow-500 hover:!text-black hover:!border-yellow-400",
            activeClasses: "!bg-yellow-500 !text-black !border-yellow-500",
          },
        },
        {
          value: "antagonist",
          label: t("characters:page.antagonist_badge"),
          count: stats.antagonist,
          colorConfig: {
            color: "orange",
            inactiveClasses: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:!bg-orange-500 hover:!text-black hover:!border-orange-500",
            activeClasses: "!bg-orange-500 !text-black !border-orange-500",
          },
        },
        {
          value: "villain",
          label: t("characters:page.villain_badge"),
          count: stats.villain,
          colorConfig: {
            color: "red",
            inactiveClasses: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:!bg-red-500 hover:!text-black hover:!border-red-500",
            activeClasses: "!bg-red-500 !text-black !border-red-500",
          },
        },
        {
          value: "secondary",
          label: t("characters:page.secondary_badge"),
          count: stats.secondary,
          colorConfig: {
            color: "blue",
            inactiveClasses: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500",
            activeClasses: "!bg-blue-500 !text-black !border-blue-500",
          },
        },
        {
          value: "extra",
          label: t("characters:page.extra_badge"),
          count: stats.extra,
          colorConfig: {
            color: "gray",
            inactiveClasses: "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400 hover:!bg-gray-500 hover:!text-black hover:!border-gray-500",
            activeClasses: "!bg-gray-500 !text-black !border-gray-500",
          },
        },
      ],
    },
  ];
}
