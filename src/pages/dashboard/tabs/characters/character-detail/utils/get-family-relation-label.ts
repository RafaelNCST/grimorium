export const getFamilyRelationLabel = (
  relationType: string,
  characterName: string
): string => {
  const relations: Record<string, string> = {
    father: `Pai de ${characterName}`,
    mother: `Mãe de ${characterName}`,
    child: `Filho(a) de ${characterName}`,
    sibling: `Irmão(ã) de ${characterName}`,
    spouse: `Cônjuge de ${characterName}`,
    halfSibling: `Meio-irmão(ã) de ${characterName}`,
    uncleAunt: `Tio(a) de ${characterName}`,
    grandparent: `Avô(ó) de ${characterName}`,
    cousin: `Primo(a) de ${characterName}`,
  };
  return relations[relationType] || "";
};
