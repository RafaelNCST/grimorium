import { TFunction } from "i18next";

export const getFamilyRelationLabel = (
  relationType: string,
  characterName: string,
  t: TFunction
): string => {
  const relationKeyMap: Record<string, string> = {
    father: "family_relation_labels.father_of",
    mother: "family_relation_labels.mother_of",
    child: "family_relation_labels.child_of",
    sibling: "family_relation_labels.sibling_of",
    spouse: "family_relation_labels.spouse_of",
    halfSibling: "family_relation_labels.half_sibling_of",
    uncleAunt: "family_relation_labels.uncle_aunt_of",
    grandparent: "family_relation_labels.grandparent_of",
    cousin: "family_relation_labels.cousin_of",
  };

  const key = relationKeyMap[relationType];
  return key ? t(key, { name: characterName }) : "";
};
