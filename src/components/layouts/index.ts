/**
 * Layout Components
 *
 * Reusable layout components for entity listing and detail pages
 */

// Entity List Layouts
export { EntityListLayout } from "./EntityListLayout";
export type {
  EmptyStateConfig,
  HeaderConfig,
  SearchConfig,
  FilterConfig,
  EntityListLayoutProps,
} from "./EntityListLayout";

export { EntityCardList } from "./EntityCardList";
export type { GridColsConfig, EntityCardListProps } from "./EntityCardList";

// Entity Detail Layouts
export { EntityDetailLayout } from "./EntityDetailLayout";
export type {
  NavigationTab,
  ActionButton,
  ExtraSection,
  EntityDetailLayoutProps,
} from "./EntityDetailLayout";

export { EntityDetailVersionPanel } from "./EntityDetailVersionPanel";
export type {
  Version,
  EntityDetailVersionPanelProps,
} from "./EntityDetailVersionPanel";
