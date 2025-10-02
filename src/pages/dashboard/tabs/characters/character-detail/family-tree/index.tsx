import { useState, useCallback, useMemo } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { mockCharacter, mockCharacters } from "@/mocks/local/family-data";

import { useBuildFamilyTree } from "./hooks/use-build-family-tree";
import { getGenerationLabel } from "./utils/get-generation-label";
import { getRelationColor } from "./utils/get-relation-color";
import { FamilyTreeView } from "./view";

export function FamilyTreePage() {
  const { dashboardId, characterId } = useParams({
    from: "/dashboard/$dashboardId/tabs/character/$characterId/family-tree",
  });
  const navigate = useNavigate();

  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const character = mockCharacter;
  const allCharacters = mockCharacters;

  const buildFamilyTree = useBuildFamilyTree(character, allCharacters);
  const treeNodes = useMemo(() => buildFamilyTree(), [buildFamilyTree]);
  const generations = useMemo(
    () =>
      [...new Set(treeNodes.map((n) => n.generation))].sort((a, b) => b - a),
    [treeNodes]
  );

  const navigateToCharacterDetail = useCallback(() => {
    if (!dashboardId || !characterId) return;
    navigate({
      to: "/dashboard/$dashboardId/tabs/character/$characterId",
      params: { dashboardId, characterId },
    });
  }, [navigate, dashboardId, characterId]);

  const handleZoomIn = useCallback(
    () => setZoom((prev) => Math.min(prev + 0.2, 2)),
    []
  );

  const handleZoomOut = useCallback(
    () => setZoom((prev) => Math.max(prev - 0.2, 0.5)),
    []
  );

  const handleToggleFullscreen = useCallback(
    () => setIsFullscreen((prev) => !prev),
    []
  );

  const handleBack = useCallback(() => {
    navigateToCharacterDetail();
  }, [navigateToCharacterDetail]);

  return (
    <FamilyTreeView
      character={character}
      treeNodes={treeNodes}
      generations={generations}
      zoom={zoom}
      isFullscreen={isFullscreen}
      onBack={handleBack}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onToggleFullscreen={handleToggleFullscreen}
      getGenerationLabel={getGenerationLabel}
      getRelationColor={getRelationColor}
    />
  );
}
