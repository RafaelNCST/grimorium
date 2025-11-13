import { useCallback } from 'react';
import { useLocalStorageState } from '@/lib/utils/storage';

export type CollapsibleSectionsState = Record<string, boolean>;

export interface UseCollapsibleSectionsReturn {
  openSections: CollapsibleSectionsState;
  toggleSection: (section: string) => void;
  openSection: (section: string) => void;
  closeSection: (section: string) => void;
  setOpenSections: (sections: CollapsibleSectionsState | ((prev: CollapsibleSectionsState) => CollapsibleSectionsState)) => void;
  isOpen: (section: string) => boolean;
}

/**
 * Hook for managing collapsible sections with localStorage persistence
 * @param storageKey - The localStorage key to persist state
 * @param defaultSections - Default state for sections (default: {})
 * @returns Collapsible sections state and functions
 */
export function useCollapsibleSections(
  storageKey: string,
  defaultSections: CollapsibleSectionsState = {}
): UseCollapsibleSectionsReturn {
  const [openSections, setOpenSections] = useLocalStorageState<CollapsibleSectionsState>(
    storageKey,
    defaultSections,
    500 // 500ms debounce
  );

  // Toggle a section's open/close state
  const toggleSection = useCallback((section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, [setOpenSections]);

  // Open a specific section
  const openSection = useCallback((section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: true,
    }));
  }, [setOpenSections]);

  // Close a specific section
  const closeSection = useCallback((section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: false,
    }));
  }, [setOpenSections]);

  // Check if a section is open
  const isOpen = useCallback((section: string): boolean => {
    return openSections[section] ?? false;
  }, [openSections]);

  return {
    openSections,
    toggleSection,
    openSection,
    closeSection,
    setOpenSections,
    isOpen,
  };
}
