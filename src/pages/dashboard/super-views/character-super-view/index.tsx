import { useState, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { getCharacterById } from "@/lib/db/characters.service";
import { Route } from "@/routes/dashboard/$dashboardId/super-views/character/$characterId";
import type { ICharacter } from "@/types/character-types";

import { CharacterSuperView } from "./view";

export function CharacterSuperViewPage() {
  const params = useParams({
    from: "/dashboard/$dashboardId/super-views/character/$characterId",
  });
  const navigate = useNavigate();
  const { t } = useTranslation(["errors"]);
  const search = Route.useSearch();
  const { dashboardId, characterId } = params;
  const fromChapterId = search.from;

  const [character, setCharacter] = useState<ICharacter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load character data
  useEffect(() => {
    const loadCharacter = async () => {
      setIsLoading(true);
      try {
        const data = await getCharacterById(characterId);
        if (data) {
          setCharacter(data);
        }
      } catch (error) {
        console.error("Error loading character:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacter();
  }, [dashboardId, characterId]);

  const handleBack = () => {
    // Navigate back to specific chapter
    if (fromChapterId) {
      navigate({
        to: "/dashboard/$dashboardId/chapters/$editor-chapters-id",
        params: { dashboardId, "editor-chapters-id": fromChapterId },
      });
    } else {
      navigate({
        to: "/dashboard/$dashboardId/chapters",
        params: { dashboardId },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          {t("errors:not_found.character")}
        </p>
      </div>
    );
  }

  return (
    <CharacterSuperView
      character={character}
      displayData={character}
      bookId={dashboardId}
      onBack={handleBack}
    />
  );
}
