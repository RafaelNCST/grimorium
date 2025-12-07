export interface IFamilyRelation {
  value: string;
  translationKey: string;
}

export interface IFamilyRelations {
  single: IFamilyRelation[];
  multiple: IFamilyRelation[];
}

export const FAMILY_RELATIONS_CONSTANT: IFamilyRelations = {
  single: [
    { value: "father", translationKey: "family_relations.father" },
    { value: "mother", translationKey: "family_relations.mother" },
    { value: "spouse", translationKey: "family_relations.spouse" },
  ],
  multiple: [
    { value: "child", translationKey: "family_relations.child" },
    { value: "sibling", translationKey: "family_relations.sibling" },
    { value: "halfSibling", translationKey: "family_relations.half_sibling" },
    { value: "uncleAunt", translationKey: "family_relations.uncle_aunt" },
    { value: "cousin", translationKey: "family_relations.cousin" },
  ],
};
