import type { IEncyclopediaEntry } from "@/types/encyclopedia";

export const MOCK_ENCYCLOPEDIA_ENTRIES: IEncyclopediaEntry[] = [
  {
    id: "1",
    title: "A Era das Trevas",
    category: "História",
    content:
      "Período sombrio da história mundial que durou aproximadamente 1000 anos. Iniciou-se com a Grande Ruptura, evento que dividiu o mundo entre luz e trevas. Durante este período, criaturas sombrias dominaram vastas regiões, forçando a humanidade a se refugiar em cidades fortificadas.",
    relatedEntries: ["Grande Ruptura", "Ordem dos Guardiões"],
    tags: ["história", "trevas", "guerra"],
    lastModified: "há 2 dias",
  },
  {
    id: "2",
    title: "Cristais de Aetherium",
    category: "Geografia",
    content:
      "Cristais mágicos raros encontrados apenas nas Montanhas Celestiais. São a principal fonte de poder mágico no mundo. Possuem uma cor azul-prateada e emitem uma luz suave. Extremamente valiosos e disputados por todas as facções.",
    relatedEntries: ["Montanhas Celestiais", "Sistema de Magia"],
    tags: ["magia", "cristais", "recursos"],
    lastModified: "há 1 semana",
  },
  {
    id: "3",
    title: "Festivais da Lua Prateada",
    category: "Cultura",
    content:
      "Celebração anual realizada durante a lua cheia de inverno. Marca o fim do período mais sombrio do ano e renova as esperanças de paz. Inclui danças rituais, oferendas aos ancestrais e a tradicional Cerimônia das Luzes.",
    relatedEntries: ["Cultura Élfica", "Religião da Luz"],
    tags: ["festival", "cultura", "tradição"],
    lastModified: "há 5 dias",
  },
  {
    id: "4",
    title: "Conselho dos Reinos",
    category: "Política",
    content:
      "Órgão político formado pelos representantes dos cinco principais reinos. Criado para coordenar a defesa contra as ameaças sombrias e mediar conflitos entre os reinos. Reúne-se na Torre Neutra uma vez por estação.",
    relatedEntries: ["Reino de Aethermoor", "Torre Neutra"],
    tags: ["política", "governo", "diplomacia"],
    lastModified: "há 3 dias",
  },
];
