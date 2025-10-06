export interface IEncyclopediaEntry {
  id: string;
  title: string;
  category:
    | "História"
    | "Geografia"
    | "Cultura"
    | "Política"
    | "Economia"
    | "Religião"
    | "Outros";
  content: string;
  relatedEntries: string[];
  tags: string[];
  lastModified: number;
}

export interface ICategoryGroup {
  category: string;
  entries: IEncyclopediaEntry[];
  count: number;
}
