interface ITutorialStep {
  title: string;
  content: string;
  target: string | null;
}

export const TUTORIAL_STEPS_CONSTANT: ITutorialStep[] = [
  {
    title: "Bem-vindo ao Sistema de Poder!",
    content:
      "Crie mapas visuais interativos para organizar seu sistema de mundo.",
    target: null,
  },
  {
    title: "Modo de Edição",
    content:
      "Clique em 'Visualizando' para entrar no modo de edição e acessar as ferramentas.",
    target: ".edit-button",
  },
  {
    title: "Barra de Elementos",
    content:
      "Use a barra lateral para adicionar diferentes tipos de elementos ao seu mapa.",
    target: ".sidebar-toolbox",
  },
  {
    title: "Cards de Seção",
    content:
      "Ideais para seções principais do seu sistema. Podem ser comprimidos para economizar espaço.",
    target: "[data-element-type='section-card']",
  },
  {
    title: "Cards de Detalhes",
    content:
      "Criam submapas navegáveis para organizar informações hierarquicamente.",
    target: "[data-element-type='details-card']",
  },
  {
    title: "Cards Visuais",
    content:
      "Focados em imagens, perfeitos para representações visuais do seu sistema.",
    target: "[data-element-type='visual-card']",
  },
  {
    title: "Caixas de Texto",
    content: "Elementos livres para anotações e descrições adicionais.",
    target: "[data-element-type='text-box']",
  },
];
