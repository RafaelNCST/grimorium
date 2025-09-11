import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext"; 
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CharacterDetail } from "./pages/CharacterDetail";
import { WorldDetail } from "./pages/WorldDetail";
import { OrganizationDetail } from "./pages/OrganizationDetail";
import { FamilyTreePage } from "./pages/FamilyTreePage";
import { SpeciesDetail } from "./pages/SpeciesDetail";
import { RaceDetail } from "./pages/RaceDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/book/:bookId/character/:characterId" element={<CharacterDetail />} />
              <Route path="/book/:bookId/character/:characterId/family-tree" element={<FamilyTreePage />} />
          <Route path="/book/:bookId/world/:worldId" element={<WorldDetail />} />
          <Route path="/book/:bookId/world/:worldId/species/:speciesId" element={<SpeciesDetail />} />
          <Route path="/book/:bookId/world/:worldId/race/:raceId" element={<RaceDetail />} />
          <Route path="/book/:bookId/organization/:orgId" element={<OrganizationDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
