import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from "./contexts/language-context";
import { ThemeProvider } from "./contexts/theme-context";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ThemeProvider>
);
