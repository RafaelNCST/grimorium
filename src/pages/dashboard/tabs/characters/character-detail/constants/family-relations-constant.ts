export interface IFamilyRelation {
  value: string;
  label: string;
}

export interface IFamilyRelations {
  single: IFamilyRelation[];
  multiple: IFamilyRelation[];
}

export const FAMILY_RELATIONS_CONSTANT: IFamilyRelations = {
  single: [
    { value: "father", label: "Pai" },
    { value: "mother", label: "Mãe" },
    { value: "spouse", label: "Cônjuge" },
  ],
  multiple: [
    { value: "child", label: "Filho/Filha" },
    { value: "sibling", label: "Irmão/Irmã" },
    { value: "halfSibling", label: "Meio-irmão/Meio-irmã" },
    { value: "uncleAunt", label: "Tio/Tia" },
    { value: "cousin", label: "Primo/Prima" },
  ],
};
