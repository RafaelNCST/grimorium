/**
 * Splash Screen
 *
 * Tela de carregamento inicial do app com frases temáticas de fantasia
 * Carrega todos os dados necessários antes de mostrar o app
 */

import { useEffect, useState } from "react";

import { getAllBooks } from "@/lib/db/books.service";
import {
  needsGalleryThumbnailMigration,
  migrateGalleryThumbnails,
} from "@/lib/db/migrate-gallery-thumbnails";
import {
  needsChapterUniqueConstraintRemoval,
  removeChapterUniqueConstraint,
} from "@/lib/db/migrate-remove-chapter-unique";
import {
  needsEntityLogMigration,
  migrateEntityLogsToGlobal,
} from "@/lib/db/migrate-entity-logs-to-global";
import { useBookStore } from "@/stores/book-store";

interface SplashScreenProps {
  onLoadingComplete?: () => void;
}

export function SplashScreen({ onLoadingComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { setBooks } = useBookStore();

  // Load all necessary data
  useEffect(() => {
    const loadAppData = async () => {
      try {
        // Load books from database
        const booksFromDB = await getAllBooks();

        setBooks(booksFromDB);

        // Run chapter UNIQUE constraint removal migration if needed
        const needsChapterMigration =
          await needsChapterUniqueConstraintRemoval();

        if (needsChapterMigration) {
          console.log(
            "[SplashScreen] Starting chapter UNIQUE constraint removal..."
          );
          await removeChapterUniqueConstraint();
          console.log("[SplashScreen] Chapter constraint migration complete!");
        }

        // Run gallery thumbnail migration if needed
        const needsMigration = await needsGalleryThumbnailMigration();

        if (needsMigration) {
          console.log("[SplashScreen] Starting gallery thumbnail migration...");
          const result = await migrateGalleryThumbnails((current, total) => {
            // Progresso da migração (opcional: pode atualizar uma mensagem no futuro)
            console.log(
              `[SplashScreen] Migration progress: ${current}/${total}`
            );
          });
          console.log("[SplashScreen] Migration complete:", result);
        }

        // Run entity logs to global migration if needed
        const needsEntityLogsMigration = await needsEntityLogMigration();

        if (needsEntityLogsMigration) {
          console.log(
            "[SplashScreen] Starting entity logs to global system migration..."
          );
          const result = await migrateEntityLogsToGlobal((current, total) => {
            console.log(
              `[SplashScreen] Entity logs migration progress: ${current}/${total}`
            );
          });
          console.log(
            "[SplashScreen] Entity logs migration complete:",
            result
          );
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
      {/* Logo with animations */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse" />

        {/* Logo container */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Inner glow behind logo */}
          <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />

          {/* SVG Logo with custom animations */}
          <div className="relative w-40 h-40">
            <style>
              {`
                @keyframes spin-diamond {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }

                @keyframes pulse-glow {
                  0%, 100% {
                    filter: drop-shadow(0 0 8px rgba(218, 138, 255, 0.4));
                  }
                  50% {
                    filter: drop-shadow(0 0 20px rgba(218, 138, 255, 0.8));
                  }
                }

                .grimoire-logo {
                  animation: pulse-glow 2s ease-in-out infinite;
                }

                .grimoire-diamond {
                  transform-origin: center;
                  animation: spin-diamond 4s linear infinite;
                }
              `}
            </style>
            <svg
              width="1024"
              height="1024"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="grimoire-logo w-full h-full"
            >
              <rect
                x="92"
                y="12"
                width="840.998"
                height="1000"
                rx="20"
                fill="#101014"
                stroke="#DA8AFF"
                strokeWidth="24"
              />
              <g className="grimoire-diamond">
                <rect
                  width="364.045"
                  height="364.045"
                  rx="32"
                  transform="matrix(0.721099 -0.692832 0.721099 0.692832 250.474 512)"
                  fill="#DA8AFF"
                />
              </g>
              <path
                d="M100 900H180.822C198.495 900 212.822 914.327 212.822 932V1004H100V900Z"
                fill="#DA8AFF"
              />
              <path
                d="M204 20V96.536C204 114.209 189.673 128.536 172 128.536H100V20H204Z"
                fill="#DA8AFF"
              />
              <path
                d="M925 122H844.178C826.505 122 812.178 107.673 812.178 90V20H925V122Z"
                fill="#DA8AFF"
              />
              <path
                d="M820 1004V926.464C820 908.791 834.327 894.464 852 894.464H925V1004H820Z"
                fill="#DA8AFF"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
