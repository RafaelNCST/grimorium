import { useEffect } from "react";

import { useThemeStore } from "@/stores/theme-store";

export function ThemeInitializer() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return null;
}
