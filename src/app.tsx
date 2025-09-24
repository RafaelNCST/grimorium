import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { BeastDetail } from "@/pages/beast-detail";
import { ChapterEditor } from "@/pages/chapter-editor";
import { ChaptersPage } from "@/pages/chapters-page";
import { CharacterDetail } from "@/pages/character-detail";
import { FamilyTreePage } from "@/pages/family-tree-page";
import FileEditor from "@/pages/file-editor";
import Index from "@/pages/index";
import ItemDetail from "@/pages/item-detail";
import ItemTimeline from "@/pages/item-timeline";
import NotFound from "@/pages/not-found";
import { OrganizationDetail } from "@/pages/organization-detail";
import { PlotArcDetail } from "@/pages/plot-arc-detail";
import { PlotTimeline } from "@/pages/plot-timeline";
import { RaceDetail } from "@/pages/race-detail";
import { SpeciesDetail } from "@/pages/species-detail";
import { WorldDetail } from "@/pages/world-detail";

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
              <Route
                path="/book/:bookId/character/:characterId"
                element={<CharacterDetail />}
              />
              <Route
                path="/book/:bookId/character/:characterId/family-tree"
                element={<FamilyTreePage />}
              />
              <Route
                path="/book/:bookId/world/:worldId"
                element={<WorldDetail />}
              />
              <Route
                path="/book/:bookId/world/:worldId/species/:speciesId"
                element={<SpeciesDetail />}
              />
              <Route
                path="/book/:bookId/world/:worldId/race/:raceId"
                element={<RaceDetail />}
              />
              <Route
                path="/book/:bookId/organization/:orgId"
                element={<OrganizationDetail />}
              />
              <Route path="/plot-arc/:id" element={<PlotArcDetail />} />
              <Route path="/plot-timeline" element={<PlotTimeline />} />
              <Route
                path="/book/:bookId/file/:fileId"
                element={<FileEditor />}
              />
              <Route path="/beast/:id" element={<BeastDetail />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/item/:id/timeline" element={<ItemTimeline />} />
              <Route path="/book/:bookId/chapters" element={<ChaptersPage />} />
              <Route
                path="/book/:bookId/chapter/:chapterId"
                element={<ChapterEditor />}
              />
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
