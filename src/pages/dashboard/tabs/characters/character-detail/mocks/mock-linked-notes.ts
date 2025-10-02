export interface ILinkedNote {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  linkCreatedAt: Date;
}

export const MOCK_LINKED_NOTES: ILinkedNote[] = [
  {
    id: "note-1",
    name: "Análise Psicológica do Aelric",
    content:
      "Análise detalhada da personalidade e motivações do personagem Aelric. Suas características heróicas contrastam com sua impulsividade...",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    linkCreatedAt: new Date("2024-01-16"),
  },
  {
    id: "note-2",
    name: "Arco Narrativo - Primeira Jornada",
    content:
      "Desenvolvimento do personagem durante sua primeira aventura. Como ele evolui de pastor simples para herói...",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    linkCreatedAt: new Date("2024-01-12"),
  },
];
