/**
 * Splash Screen
 *
 * Tela de carregamento inicial do app com frases temáticas de fantasia
 * Carrega todos os dados necessários antes de mostrar o app
 */

import { useEffect, useState } from "react";

import { BookOpen } from "lucide-react";

import { getAllBooks } from "@/lib/db/books.service";
import {
  needsGalleryThumbnailMigration,
  migrateGalleryThumbnails,
} from "@/lib/db/migrate-gallery-thumbnails";
import { useBookStore } from "@/stores/book-store";

const LOADING_PHRASES = [
  "Preparando magias...",
  "Treinando cavaleiros...",
  "Explorando masmorras...",
  "Forjando espadas lendárias...",
  "Invocando dragões...",
  "Escrevendo profecias...",
];

interface SplashScreenProps {
  onLoadingComplete?: () => void;
}

export function SplashScreen({ onLoadingComplete }: SplashScreenProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { setBooks } = useBookStore();

  // Cycle through loading phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Load all necessary data
  useEffect(() => {
    const loadAppData = async () => {
      try {
        // Load books from database
        const booksFromDB = await getAllBooks();

        setBooks(booksFromDB);

        // TODO: Add more initialization here:
        // - Check for updates
        // - Validate subscription
        // - Load user settings

        // Run gallery thumbnail migration if needed
        const needsMigration = await needsGalleryThumbnailMigration();

        if (needsMigration) {
          console.log('[SplashScreen] Starting gallery thumbnail migration...');
          const result = await migrateGalleryThumbnails((current, total) => {
            // Progresso da migração (opcional: pode atualizar uma mensagem no futuro)
            console.log(`[SplashScreen] Migration progress: ${current}/${total}`);
          });
          console.log('[SplashScreen] Migration complete:', result);
        }

        setIsDataLoaded(true);
      } catch (error) {
        console.error("[SplashScreen] Error loading app data:", error);
        // Even if there's an error, we should show the app
        setIsDataLoaded(true);
      }
    };

    loadAppData();
  }, [setBooks]);

  // Wait for both data loading and minimum display time, then fade out
  useEffect(() => {
    if (!isDataLoaded) return;

    // Ensure splash shows for at least 2 seconds for better UX
    const minDisplayTime = 2000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade out animation before calling onLoadingComplete
      setTimeout(() => {
        onLoadingComplete?.();
      }, 500);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [isDataLoaded, onLoadingComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center animate-out fade-out duration-500" />
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Logo/Icon with animations */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />

          {/* Rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          </div>

          {/* Book icon */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="relative">
              {/* Inner glow behind icon */}
              <div className="absolute inset-0 bg-primary/30 blur-md rounded-lg animate-pulse" />
              <BookOpen
                className="relative w-16 h-16 text-primary animate-pulse"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* Loading phrase with fade transition */}
        <div className="text-center space-y-3">
          <div className="h-12 flex items-center justify-center">
            <h1
              key={currentPhraseIndex}
              className="text-4xl font-bold text-foreground tracking-wide animate-in fade-in duration-300"
            >
              {LOADING_PHRASES[currentPhraseIndex]}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
