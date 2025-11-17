import { useCallback } from "react";

import { type Character, type TreeNode } from "@/mocks/local/family-data";

export const useBuildFamilyTree = (
  character: Character,
  allCharacters: Character[]
) =>
  useCallback(() => {
    const treeNodes: TreeNode[] = [];
    const processedIds = new Set<string>();

    const addToTree = (
      charId: string,
      generation: number,
      relation: string
    ) => {
      if (processedIds.has(charId)) return;

      const char = allCharacters.find((c) => c.id === charId);
      if (!char) return;

      processedIds.add(charId);

      const sameGenNodes = treeNodes.filter((n) => n.generation === generation);
      const position = sameGenNodes.length;

      treeNodes.push({
        id: charId,
        name: char.name,
        image: char.image,
        generation,
        position,
        relations: [relation],
      });

      return char;
    };

    addToTree(character.id, 0, "main");

    // Grandparents (generation -2)
    character.family?.grandparents?.forEach((grandparentId: string) => {
      addToTree(grandparentId, -2, "avô/avó");
    });

    // Parents (generation -1)
    character.family?.parents?.forEach((parentId: string) => {
      addToTree(parentId, -1, "pai/mãe");
    });

    // Uncles/Aunts (generation -1)
    character.family?.unclesAunts?.forEach((uncleAuntId: string) => {
      addToTree(uncleAuntId, -1, "tio/tia");
    });

    // Spouses (generation 0)
    character.family?.spouses?.forEach((spouseId: string) => {
      addToTree(spouseId, 0, "cônjuge");
    });

    // Siblings (generation 0)
    character.family?.siblings?.forEach((siblingId: string) => {
      addToTree(siblingId, 0, "irmão/irmã");
    });

    // Half Siblings (generation 0)
    character.family?.halfSiblings?.forEach((halfSiblingId: string) => {
      addToTree(halfSiblingId, 0, "meio-irmão/irmã");
    });

    // Cousins (generation 0)
    character.family?.cousins?.forEach((cousinId: string) => {
      addToTree(cousinId, 0, "primo/prima");
    });

    // Children (generation 1)
    character.family?.children?.forEach((childId: string) => {
      addToTree(childId, 1, "filho/filha");
    });

    return treeNodes.sort((a, b) => {
      if (a.generation !== b.generation) return b.generation - a.generation;
      return a.position - b.position;
    });
  }, [character, allCharacters]);
