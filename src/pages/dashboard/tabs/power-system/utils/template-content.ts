/**
 * Template Content - Simplified Basic Templates
 *
 * Este arquivo contém os templates básicos simplificados de sistemas de poder
 * em português e inglês. Os templates servem para demonstrar como usar blocos,
 * seções, páginas e grupos, com conceitos clichês de magia e artes marciais.
 */

import type { BlockType, BlockContent } from "../types/power-system-types";

export type Language = "pt" | "en";

export interface TemplateSection {
  title: string;
  blocks: Array<{
    type: BlockType;
    content: BlockContent;
  }>;
}

export interface TemplatePage {
  name: string;
  sections: TemplateSection[];
}

export interface TemplateGroup {
  name: string;
  pages: TemplatePage[];
}

export interface TemplateContent {
  overviewPage: TemplatePage;
  groups: TemplateGroup[];
}

// ============================================================================
// MAGIC TEMPLATE CONTENT
// ============================================================================

const magicTemplateContent: Record<Language, TemplateContent> = {
  pt: {
    overviewPage: {
      name: "Visão Geral",
      sections: [
        {
          title: "O que é Mana",
          blocks: [
            {
              type: "heading",
              content: {
                text: "A Energia Mística",
                level: 1,
                alignment: "center",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Mana é a energia mágica fundamental que permeia todo o universo. É uma força invisível que pode ser canalizada por aqueles com aptidão mágica para realizar feitiços e encantamentos.",
              },
            },
            {
              type: "tag-list",
              content: {
                tags: [
                  "Energia Mística",
                  "Invisível",
                  "Onipresente",
                  "Poderosa",
                ],
              },
            },
          ],
        },
        {
          title: "Origem",
          blocks: [
            {
              type: "heading",
              content: {
                text: "De onde vem o Mana",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "O mana flui do próprio tecido da realidade, concentrando-se em locais de poder como florestas antigas, montanhas sagradas e templos místicos. Magos podem absorver e armazenar mana em seus corpos através de meditação e prática.",
              },
            },
            {
              type: "unordered-list",
              content: {
                items: [
                  {
                    id: crypto.randomUUID(),
                    text: "Linhas ley - Veias de energia que cruzam o mundo",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Cristais mágicos - Condensação física de mana",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Fontes naturais - Lugares onde o mana brota naturalmente",
                  },
                ],
              },
            },
          ],
        },
        {
          title: "Como Manusear",
          blocks: [
            {
              type: "heading",
              content: {
                text: "Manipulação de Mana",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Para usar magia, o praticante deve primeiro sentir o mana ao seu redor, absorvê-lo para seu corpo, e então moldá-lo através de palavras de poder, gestos específicos ou círculos mágicos.",
              },
            },
            {
              type: "numbered-list",
              content: {
                items: [
                  {
                    id: crypto.randomUUID(),
                    text: "Sentir - Desenvolver sensibilidade ao mana ambiental",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Absorver - Puxar o mana para dentro do seu núcleo mágico",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Moldar - Dar forma e direção ao mana através de técnicas",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Liberar - Manifestar o feitiço no mundo físico",
                  },
                ],
              },
            },
            {
              type: "informative",
              content: {
                icon: "info",
                text: "Magos iniciantes devem começar com feitiços simples e aumentar gradualmente a complexidade conforme desenvolvem controle.",
              },
            },
          ],
        },
        {
          title: "Onde Encontrar",
          blocks: [
            {
              type: "heading",
              content: {
                text: "Fontes de Mana",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "O mana pode ser encontrado em diferentes concentrações ao redor do mundo. Magos experientes aprendem a identificar e buscar essas fontes para regenerar suas reservas.",
              },
            },
            {
              type: "icon-group",
              content: {
                icons: [
                  {
                    id: crypto.randomUUID(),
                    title: "Florestas Antigas",
                    description:
                      "Árvores centenárias acumulam mana naturalmente",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Fontes Místicas",
                    description:
                      "Nascentes de água imbuídas com energia mágica",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Ruínas Arcanas",
                    description:
                      "Locais onde poderosos feitiços foram lançados",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Cristais de Mana",
                    description: "Formações cristalinas que armazenam energia",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    groups: [
      {
        name: "Conceitos Gerais",
        pages: [
          {
            name: "Fundamentos",
            sections: [
              {
                title: "Uso Básico",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Fundamentos da Magia",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "A magia é dividida em diferentes escolas de pensamento, cada uma focando em um aspecto diferente da manipulação de mana. Todo mago deve dominar os fundamentos antes de avançar para magias mais complexas.",
                    },
                  },
                  {
                    type: "divider",
                    content: {},
                  },
                  {
                    type: "heading",
                    content: {
                      text: "Princípios Essenciais",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "unordered-list",
                    content: {
                      items: [
                        {
                          id: crypto.randomUUID(),
                          text: "Concentração - Manter foco durante o conjuro",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Controle - Dosear a quantidade certa de mana",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Precisão - Moldar o mana na forma exata desejada",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Vontade - Impor sua intenção sobre a energia",
                        },
                      ],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 3,
                      color: "purple",
                    },
                  },
                ],
              },
              {
                title: "Círculos Mágicos",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "A Arte dos Círculos",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Círculos mágicos são padrões geométricos que ajudam a canalizar e estabilizar o mana. Cada símbolo no círculo tem um significado específico e modifica o feitiço de uma forma particular.",
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "star",
                      text: "Círculos bem desenhados aumentam significativamente a eficiência e poder dos feitiços.",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Técnicas/Magias",
            sections: [
              {
                title: "Níveis de Poder",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Classificação de Feitiços",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Feitiços são classificados em diferentes níveis baseados na quantidade de mana necessária e na complexidade da execução. Magos iniciantes devem focar em feitiços de nível baixo antes de tentar magias mais avançadas.",
                    },
                  },
                  {
                    type: "divider",
                    content: {},
                  },
                ],
              },
              {
                title: "Feitiços Básicos",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Nível 1-3: Iniciante",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Luz Mágica",
                        "Chama Menor",
                        "Escudo Básico",
                        "Rajada de Vento",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Estes são os primeiros feitiços que todo aprendiz de magia domina. São simples, seguros e requerem pouco mana.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 2,
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Feitiços Intermediários",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Nível 4-6: Intermediário",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Bola de Fogo",
                        "Barreira Mágica",
                        "Raio Congelante",
                        "Telecinese",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Feitiços que requerem maior controle e quantidade de mana. Magos deste nível podem causar dano significativo ou criar defesas sólidas.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 4.5,
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Feitiços Avançados",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Nível 7-10: Avançado",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Meteoro Flamejante",
                        "Tempestade de Gelo",
                        "Teletransporte",
                        "Explosão Arcana",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Magias devastadoras que apenas magos experientes podem controlar. Requerem anos de prática e reservas massivas de mana.",
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "alert",
                      text: "Usar feitiços avançados sem treinamento adequado pode resultar em dano severo ao conjurador.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 5,
                      size: "large",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Meu Grimório",
            sections: [
              {
                title: "Perfil do Mago",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Meu Perfil Mágico",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Este é meu grimório pessoal, onde registro minhas preferências mágicas, feitiços dominados e meu progresso como mago.",
                    },
                  },
                  {
                    type: "image",
                    content: {
                      imageUrl: "",
                      caption: "Meu Círculo Mágico Pessoal",
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Especialização",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Minha Escola de Magia",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Cada mago eventualmente se especializa em uma escola de magia que melhor se alinha com suas habilidades e personalidade.",
                    },
                  },
                  {
                    type: "dropdown",
                    content: {
                      dataSource: "manual",
                      options: ["Evocação", "Ilusão", "Necromancia", "Encantamento", "Transmutação", "Adivinhação"],
                      selectedValue: "",
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "small",
                    },
                  },
                ],
              },
              {
                title: "Repertório",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Feitiços que Domino",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Lista de feitiços que aprendi e domino completamente. Posso conjurá-los sem dificuldade.",
                    },
                  },
                  {
                    type: "multi-dropdown",
                    content: {
                      dataSource: "manual",
                      options: ["Luz Mágica", "Bola de Fogo", "Escudo Arcano", "Raio Congelante", "Teletransporte", "Meteoro Flamejante"],
                      selectedValues: [],
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "info",
                      text: "Quanto mais feitiços você dominar, mais versátil será em combate.",
                    },
                  },
                ],
              },
              {
                title: "Mentor",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Meu Mestre de Magia",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Todo mago aprende com um mestre. Selecione o personagem que é seu mentor nas artes arcanas.",
                    },
                  },
                  {
                    type: "dropdown",
                    content: {
                      dataSource: "characters",
                      options: [],
                      selectedEntityId: undefined,
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "large",
                    },
                  },
                ],
              },
              {
                title: "Estudos Relacionados",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Explorar Elementos",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Use os navegadores abaixo para estudar cada elemento em detalhes.",
                    },
                  },
                  {
                    type: "navigator",
                    content: {
                      linkedPageId: undefined,
                      title: "Estudar Tipos Elementais",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Tipos Elementais",
            sections: [
              {
                title: "Os Quatro Elementos",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Magia Elemental",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "A magia elemental é a forma mais comum de manipulação de mana, dividida em quatro elementos principais: Fogo, Água, Terra e Ar. Cada elemento tem suas próprias características, vantagens e desvantagens.",
                    },
                  },
                ],
              },
              {
                title: "Fogo",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Elemento Fogo",
                      description:
                        "O elemento da destruição e paixão. Magias de fogo são poderosas e agressivas, causando grande dano mas consumindo muito mana.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Destrutivo", "Rápido", "Intenso", "Alto Consumo"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 8,
                      color: "red",
                    },
                  },
                ],
              },
              {
                title: "Água",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Elemento Água",
                      description:
                        "O elemento da adaptação e cura. Magias de água são versáteis, podendo curar aliados ou atacar inimigos com ondas devastadoras.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Versátil", "Curativo", "Adaptável", "Fluido"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 6,
                      color: "cyan",
                    },
                  },
                ],
              },
              {
                title: "Terra",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Elemento Terra",
                      description:
                        "O elemento da resistência e estabilidade. Magias de terra focam em defesa e controle de campo, criando barreiras impenetráveis.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Defensivo", "Estável", "Resistente", "Duradouro"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 9,
                      color: "green",
                    },
                  },
                ],
              },
              {
                title: "Ar",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Elemento Ar",
                      description:
                        "O elemento da velocidade e liberdade. Magias de ar são rápidas e evasivas, perfeitas para mobilidade e ataques rápidos.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Veloz", "Evasivo", "Leve", "Preciso"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 7,
                      color: "yellow",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  en: {
    overviewPage: {
      name: "Overview",
      sections: [
        {
          title: "What is Mana",
          blocks: [
            {
              type: "heading",
              content: {
                text: "The Mystical Energy",
                level: 1,
                alignment: "center",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Mana is the fundamental magical energy that permeates the entire universe. It is an invisible force that can be channeled by those with magical aptitude to cast spells and enchantments.",
              },
            },
            {
              type: "tag-list",
              content: {
                tags: [
                  "Mystical Energy",
                  "Invisible",
                  "Omnipresent",
                  "Powerful",
                ],
              },
            },
          ],
        },
        {
          title: "Origin",
          blocks: [
            {
              type: "heading",
              content: {
                text: "Where Mana Comes From",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Mana flows from the very fabric of reality, concentrating in places of power such as ancient forests, sacred mountains, and mystical temples. Mages can absorb and store mana in their bodies through meditation and practice.",
              },
            },
            {
              type: "unordered-list",
              content: {
                items: [
                  {
                    id: crypto.randomUUID(),
                    text: "Ley lines - Veins of energy that cross the world",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Magic crystals - Physical condensation of mana",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Natural springs - Places where mana naturally wells up",
                  },
                ],
              },
            },
          ],
        },
        {
          title: "How to Handle",
          blocks: [
            {
              type: "heading",
              content: {
                text: "Mana Manipulation",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "To use magic, the practitioner must first sense the mana around them, absorb it into their body, and then shape it through words of power, specific gestures, or magic circles.",
              },
            },
            {
              type: "numbered-list",
              content: {
                items: [
                  {
                    id: crypto.randomUUID(),
                    text: "Sense - Develop sensitivity to ambient mana",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Absorb - Pull mana into your magical core",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Shape - Give form and direction to mana through techniques",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Release - Manifest the spell in the physical world",
                  },
                ],
              },
            },
            {
              type: "informative",
              content: {
                icon: "info",
                text: "Beginner mages should start with simple spells and gradually increase complexity as they develop control.",
              },
            },
          ],
        },
        {
          title: "Where to Find",
          blocks: [
            {
              type: "heading",
              content: {
                text: "Mana Sources",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Mana can be found in different concentrations around the world. Experienced mages learn to identify and seek out these sources to regenerate their reserves.",
              },
            },
            {
              type: "icon-group",
              content: {
                icons: [
                  {
                    id: crypto.randomUUID(),
                    title: "Ancient Forests",
                    description: "Century-old trees naturally accumulate mana",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Mystical Springs",
                    description: "Water sources imbued with magical energy",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Arcane Ruins",
                    description: "Places where powerful spells were cast",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Mana Crystals",
                    description: "Crystalline formations that store energy",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    groups: [
      {
        name: "General Concepts",
        pages: [
          {
            name: "Fundamentals",
            sections: [
              {
                title: "Basic Usage",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Fundamentals of Magic",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Magic is divided into different schools of thought, each focusing on a different aspect of mana manipulation. Every mage must master the fundamentals before advancing to more complex magic.",
                    },
                  },
                  {
                    type: "divider",
                    content: {},
                  },
                  {
                    type: "heading",
                    content: {
                      text: "Essential Principles",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "unordered-list",
                    content: {
                      items: [
                        {
                          id: crypto.randomUUID(),
                          text: "Concentration - Maintain focus during casting",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Control - Measure the right amount of mana",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Precision - Shape mana into the exact desired form",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Willpower - Impose your intention on the energy",
                        },
                      ],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 3,
                      color: "purple",
                    },
                  },
                ],
              },
              {
                title: "Magic Circles",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "The Art of Circles",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Magic circles are geometric patterns that help channel and stabilize mana. Each symbol in the circle has a specific meaning and modifies the spell in a particular way.",
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "star",
                      text: "Well-drawn circles significantly increase the efficiency and power of spells.",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Techniques/Spells",
            sections: [
              {
                title: "Power Levels",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Spell Classification",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Spells are classified into different levels based on the amount of mana required and execution complexity. Beginner mages should focus on low-level spells before attempting more advanced magic.",
                    },
                  },
                  {
                    type: "divider",
                    content: {},
                  },
                ],
              },
              {
                title: "Basic Spells",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Level 1-3: Beginner",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Magic Light",
                        "Minor Flame",
                        "Basic Shield",
                        "Wind Gust",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "These are the first spells that every magic apprentice masters. They are simple, safe, and require little mana.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 2,
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Intermediate Spells",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Level 4-6: Intermediate",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Fireball",
                        "Magic Barrier",
                        "Freezing Ray",
                        "Telekinesis",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Spells that require greater control and amount of mana. Mages at this level can cause significant damage or create solid defenses.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 4.5,
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Advanced Spells",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Level 7-10: Advanced",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Flaming Meteor",
                        "Ice Storm",
                        "Teleportation",
                        "Arcane Explosion",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Devastating magic that only experienced mages can control. Requires years of practice and massive mana reserves.",
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "alert",
                      text: "Using advanced spells without proper training can result in severe damage to the caster.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 5,
                      size: "large",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "My Grimoire",
            sections: [
              {
                title: "Mage Profile",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "My Magical Profile",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "This is my personal grimoire, where I record my magical preferences, mastered spells, and my progress as a mage.",
                    },
                  },
                  {
                    type: "image",
                    content: {
                      imageUrl: "",
                      caption: "My Personal Magic Circle",
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Specialization",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "My School of Magic",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Each mage eventually specializes in a school of magic that best aligns with their abilities and personality.",
                    },
                  },
                  {
                    type: "dropdown",
                    content: {
                      dataSource: "manual",
                      options: ["Evocation", "Illusion", "Necromancy", "Enchantment", "Transmutation", "Divination"],
                      selectedValue: "",
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "small",
                    },
                  },
                ],
              },
              {
                title: "Repertoire",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Spells I Master",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "List of spells I've learned and completely mastered. I can cast them without difficulty.",
                    },
                  },
                  {
                    type: "multi-dropdown",
                    content: {
                      dataSource: "manual",
                      options: ["Magic Light", "Fireball", "Arcane Shield", "Freezing Ray", "Teleportation", "Flaming Meteor"],
                      selectedValues: [],
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "info",
                      text: "The more spells you master, the more versatile you'll be in combat.",
                    },
                  },
                ],
              },
              {
                title: "Mentor",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "My Magic Master",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Every mage learns from a master. Select the character who is your mentor in the arcane arts.",
                    },
                  },
                  {
                    type: "dropdown",
                    content: {
                      dataSource: "characters",
                      options: [],
                      selectedEntityId: undefined,
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "large",
                    },
                  },
                ],
              },
              {
                title: "Related Studies",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Explore Elements",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Use the navigators below to study each element in detail.",
                    },
                  },
                  {
                    type: "navigator",
                    content: {
                      linkedPageId: undefined,
                      title: "Study Elemental Types",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Elemental Types",
            sections: [
              {
                title: "The Four Elements",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Elemental Magic",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Elemental magic is the most common form of mana manipulation, divided into four main elements: Fire, Water, Earth, and Air. Each element has its own characteristics, advantages, and disadvantages.",
                    },
                  },
                ],
              },
              {
                title: "Fire",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Fire Element",
                      description:
                        "The element of destruction and passion. Fire magic is powerful and aggressive, causing great damage but consuming a lot of mana.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Destructive",
                        "Fast",
                        "Intense",
                        "High Consumption",
                      ],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 8,
                      color: "red",
                    },
                  },
                ],
              },
              {
                title: "Water",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Water Element",
                      description:
                        "The element of adaptation and healing. Water magic is versatile, able to heal allies or attack enemies with devastating waves.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Versatile", "Healing", "Adaptable", "Fluid"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 6,
                      color: "cyan",
                    },
                  },
                ],
              },
              {
                title: "Earth",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Earth Element",
                      description:
                        "The element of endurance and stability. Earth magic focuses on defense and field control, creating impenetrable barriers.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Defensive", "Stable", "Resistant", "Lasting"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 9,
                      color: "green",
                    },
                  },
                ],
              },
              {
                title: "Air",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Air Element",
                      description:
                        "The element of speed and freedom. Air magic is fast and evasive, perfect for mobility and quick attacks.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Fast", "Evasive", "Light", "Precise"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 7,
                      color: "yellow",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

// ============================================================================
// MARTIAL ARTS TEMPLATE CONTENT
// ============================================================================

const martialTemplateContent: Record<Language, TemplateContent> = {
  pt: {
    overviewPage: {
      name: "Visão Geral",
      sections: [
        {
          title: "O que é Ki",
          blocks: [
            {
              type: "heading",
              content: {
                text: "A Energia Vital",
                level: 1,
                alignment: "center",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Ki, também conhecido como Chi ou energia vital, é a força que flui através de todos os seres vivos. É a essência da vida que pode ser cultivada e direcionada através de práticas marciais para realizar feitos sobre-humanos.",
              },
            },
            {
              type: "tag-list",
              content: {
                tags: ["Energia Vital", "Interna", "Cultivável", "Poderosa"],
              },
            },
          ],
        },
        {
          title: "Origem",
          blocks: [
            {
              type: "heading",
              content: {
                text: "De onde vem o Ki",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "O Ki reside no centro de cada pessoa, no que os mestres chamam de 'dantian' ou núcleo energético. Todos nascem com Ki, mas poucos aprendem a cultivá-lo e direcioná-lo conscientemente. Através de meditação, respiração adequada e treino marcial, guerreiros podem aumentar suas reservas de Ki.",
              },
            },
            {
              type: "unordered-list",
              content: {
                items: [
                  {
                    id: crypto.randomUUID(),
                    text: "Dantian - O centro energético do corpo",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Meridianos - Canais por onde o Ki flui",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Pontos de Acupuntura - Nós onde o Ki se concentra",
                  },
                ],
              },
            },
          ],
        },
        {
          title: "Como Manusear",
          blocks: [
            {
              type: "heading",
              content: {
                text: "Manipulação do Ki",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Para usar o Ki em combate, o praticante deve primeiro cultivá-lo através de meditação e exercícios respiratórios. Em seguida, deve aprender a circulá-lo pelo corpo e finalmente projetá-lo externamente através de técnicas marciais.",
              },
            },
            {
              type: "numbered-list",
              content: {
                items: [
                  {
                    id: crypto.randomUUID(),
                    text: "Cultivar - Desenvolver e acumular Ki através de meditação",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Circular - Mover o Ki através dos meridianos",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Concentrar - Acumular Ki em pontos específicos do corpo",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Projetar - Liberar o Ki externamente em ataques",
                  },
                ],
              },
            },
            {
              type: "informative",
              content: {
                icon: "info",
                text: "Mestres de artes marciais podem levar décadas para dominar completamente o controle do Ki.",
              },
            },
          ],
        },
        {
          title: "Onde Encontrar",
          blocks: [
            {
              type: "heading",
              content: {
                text: "Cultivando o Ki",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Diferente do mana, o Ki não é encontrado externamente, mas sim cultivado internamente. No entanto, certos ambientes facilitam o cultivo de Ki, e mestres buscam esses locais para treinar.",
              },
            },
            {
              type: "icon-group",
              content: {
                icons: [
                  {
                    id: crypto.randomUUID(),
                    title: "Montanhas Altas",
                    description: "O ar rarefeito fortalece a respiração e o Ki",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Cachoeiras",
                    description: "O fluxo constante simboliza e reforça o Ki",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Templos Antigos",
                    description:
                      "Locais de meditação acumulam energia espiritual",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Campos de Batalha",
                    description: "Onde guerreiros testam seu Ki em combate",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    groups: [
      {
        name: "Conceitos Gerais",
        pages: [
          {
            name: "Fundamentos",
            sections: [
              {
                title: "Uso Básico",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Fundamentos das Artes Marciais",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "As artes marciais são mais do que simples técnicas de combate. São uma jornada de autodescoberta e domínio do corpo e mente. Todo praticante deve primeiro dominar os fundamentos antes de avançar para técnicas mais complexas.",
                    },
                  },
                  {
                    type: "divider",
                    content: {},
                  },
                  {
                    type: "heading",
                    content: {
                      text: "Princípios Essenciais",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "unordered-list",
                    content: {
                      items: [
                        {
                          id: crypto.randomUUID(),
                          text: "Postura - Manter base sólida e equilíbrio",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Respiração - Controlar o fluxo de Ki através da respiração",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Foco - Concentrar mente e energia no momento presente",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Fluxo - Mover-se naturalmente, sem resistência",
                        },
                      ],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 3,
                      color: "orange",
                    },
                  },
                ],
              },
              {
                title: "Fortalecimento do Corpo",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Temperar o Corpo",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Antes de usar técnicas avançadas de Ki, o praticante deve fortalecer seu corpo. Ossos, músculos e tendões devem ser temperados através de treinamento rigoroso para suportar o fluxo intenso de energia.",
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "star",
                      text: "Um corpo bem treinado é como uma arma afiada - letal e confiável.",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Técnicas",
            sections: [
              {
                title: "Níveis de Força",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Classificação de Técnicas",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "As técnicas marciais são classificadas em diferentes níveis baseados na quantidade de Ki necessária e na dificuldade de execução. Praticantes devem progredir gradualmente através dos níveis.",
                    },
                  },
                  {
                    type: "divider",
                    content: {},
                  },
                ],
              },
              {
                title: "Técnicas Básicas",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Nível 1-3: Iniciante",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Soco de Ferro",
                        "Chute Giratório",
                        "Bloqueio Básico",
                        "Esquiva Rápida",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Técnicas fundamentais que todo praticante aprende. Focam em forma correta e construção de força básica.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 2,
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Técnicas Intermediárias",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Nível 4-6: Intermediário",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Palma de Aço",
                        "Chute Voador",
                        "Contra-Ataque Relâmpago",
                        "Defesa Absoluta",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Técnicas que começam a incorporar Ki conscientemente. Praticantes neste nível podem quebrar pedras e madeira com golpes.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 4.5,
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Técnicas Avançadas",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Nível 7-10: Avançado",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Onda de Choque de Ki",
                        "Golpe do Dragão",
                        "Barreira de Energia",
                        "Impacto Dimensional",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Técnicas devastadoras que apenas mestres podem realizar. Requerem décadas de treinamento e controle perfeito do Ki.",
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "alert",
                      text: "Usar técnicas avançadas sem preparo adequado pode danificar permanentemente os meridianos.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 5,
                      size: "large",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Meu Dojo",
            sections: [
              {
                title: "Perfil do Guerreiro",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Meu Perfil Marcial",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Este é meu dojo pessoal, onde registro meu estilo de luta preferido, técnicas dominadas e meu progresso como artista marcial.",
                    },
                  },
                  {
                    type: "image",
                    content: {
                      imageUrl: "",
                      caption: "Minha Postura de Combate",
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Especialização",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Meu Estilo Principal",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Todo artista marcial eventualmente escolhe um estilo que melhor se adapta à sua natureza e objetivos de combate.",
                    },
                  },
                  {
                    type: "dropdown",
                    content: {
                      dataSource: "manual",
                      options: ["Estilo do Tigre", "Estilo da Serpente", "Estilo da Tartaruga", "Estilo da Garça"],
                      selectedValue: "",
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "small",
                    },
                  },
                ],
              },
              {
                title: "Arsenal",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Técnicas que Domino",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Lista de técnicas marciais que aprendi e domino completamente. Posso executá-las com precisão em combate.",
                    },
                  },
                  {
                    type: "multi-dropdown",
                    content: {
                      dataSource: "manual",
                      options: ["Soco de Ferro", "Palma de Aço", "Chute Voador", "Golpe do Dragão", "Barreira de Energia", "Onda de Choque de Ki"],
                      selectedValues: [],
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "info",
                      text: "Quanto mais técnicas você dominar, mais adaptável será em diferentes situações de combate.",
                    },
                  },
                ],
              },
              {
                title: "Mestre",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Meu Mestre Marcial",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Todo guerreiro aprende com um mestre. Selecione o personagem que é seu mentor nas artes marciais.",
                    },
                  },
                  {
                    type: "dropdown",
                    content: {
                      dataSource: "characters",
                      options: [],
                      selectedEntityId: undefined,
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "large",
                    },
                  },
                ],
              },
              {
                title: "Treinamento Relacionado",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Explorar Estilos",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Use os navegadores abaixo para estudar cada estilo de combate em detalhes.",
                    },
                  },
                  {
                    type: "navigator",
                    content: {
                      linkedPageId: undefined,
                      title: "Estudar Posturas de Combate",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Posturas de Combate",
            sections: [
              {
                title: "Estilos de Luta",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Posturas e Estilos",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Diferentes estilos de artes marciais enfatizam diferentes aspectos do combate. Cada estilo tem suas próprias posturas, técnicas e filosofias, baseadas em animais lendários ou forças da natureza.",
                    },
                  },
                ],
              },
              {
                title: "Estilo do Tigre",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Postura do Tigre",
                      description:
                        "Focado em força bruta e ataques devastadores. Praticantes deste estilo são como predadores, esperando o momento certo para atacar com toda força.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Agressivo", "Poderoso", "Direto", "Feroz"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 9,
                      color: "orange",
                    },
                  },
                ],
              },
              {
                title: "Estilo da Serpente",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Postura da Serpente",
                      description:
                        "Focado em flexibilidade e ataques rápidos e precisos. Praticantes fluem como água, esquivando e contra-atacando nos pontos vitais.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Flexível", "Rápido", "Preciso", "Adaptável"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 7,
                      color: "green",
                    },
                  },
                ],
              },
              {
                title: "Estilo da Tartaruga",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Postura da Tartaruga",
                      description:
                        "Focado em defesa impenetrável e contraataques calculados. Praticantes são pacientes, absorvendo ataques e esperando a abertura perfeita.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Defensivo",
                        "Resistente",
                        "Paciente",
                        "Calculado",
                      ],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 10,
                      color: "blue",
                    },
                  },
                ],
              },
              {
                title: "Estilo da Garça",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Postura da Garça",
                      description:
                        "Focado em equilíbrio perfeito e movimentos graciosos. Praticantes se movem com elegância mortal, atacando de ângulos inesperados.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Equilibrado",
                        "Gracioso",
                        "Imprevisível",
                        "Elegante",
                      ],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 6,
                      color: "cyan",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  en: {
    overviewPage: {
      name: "Overview",
      sections: [
        {
          title: "What is Ki",
          blocks: [
            {
              type: "heading",
              content: {
                text: "The Vital Energy",
                level: 1,
                alignment: "center",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Ki, also known as Chi or vital energy, is the force that flows through all living beings. It is the essence of life that can be cultivated and directed through martial practices to perform superhuman feats.",
              },
            },
            {
              type: "tag-list",
              content: {
                tags: ["Vital Energy", "Internal", "Cultivatable", "Powerful"],
              },
            },
          ],
        },
        {
          title: "Origin",
          blocks: [
            {
              type: "heading",
              content: {
                text: "Where Ki Comes From",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Ki resides in the center of each person, in what masters call the 'dantian' or energy core. Everyone is born with Ki, but few learn to cultivate and direct it consciously. Through meditation, proper breathing, and martial training, warriors can increase their Ki reserves.",
              },
            },
            {
              type: "unordered-list",
              content: {
                items: [
                  {
                    id: crypto.randomUUID(),
                    text: "Dantian - The body's energy center",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Meridians - Channels through which Ki flows",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Acupuncture Points - Nodes where Ki concentrates",
                  },
                ],
              },
            },
          ],
        },
        {
          title: "How to Handle",
          blocks: [
            {
              type: "heading",
              content: {
                text: "Ki Manipulation",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "To use Ki in combat, the practitioner must first cultivate it through meditation and breathing exercises. Then, they must learn to circulate it through the body and finally project it externally through martial techniques.",
              },
            },
            {
              type: "numbered-list",
              content: {
                items: [
                  {
                    id: crypto.randomUUID(),
                    text: "Cultivate - Develop and accumulate Ki through meditation",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Circulate - Move Ki through the meridians",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Concentrate - Accumulate Ki in specific body points",
                  },
                  {
                    id: crypto.randomUUID(),
                    text: "Project - Release Ki externally in attacks",
                  },
                ],
              },
            },
            {
              type: "informative",
              content: {
                icon: "info",
                text: "Martial arts masters can take decades to fully master Ki control.",
              },
            },
          ],
        },
        {
          title: "Where to Find",
          blocks: [
            {
              type: "heading",
              content: {
                text: "Cultivating Ki",
                level: 2,
                alignment: "left",
              },
            },
            {
              type: "paragraph",
              content: {
                text: "Unlike mana, Ki is not found externally but cultivated internally. However, certain environments facilitate Ki cultivation, and masters seek these places to train.",
              },
            },
            {
              type: "icon-group",
              content: {
                icons: [
                  {
                    id: crypto.randomUUID(),
                    title: "High Mountains",
                    description: "The thin air strengthens breathing and Ki",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Waterfalls",
                    description:
                      "The constant flow symbolizes and reinforces Ki",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Ancient Temples",
                    description:
                      "Places of meditation accumulate spiritual energy",
                  },
                  {
                    id: crypto.randomUUID(),
                    title: "Battlefields",
                    description: "Where warriors test their Ki in combat",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    groups: [
      {
        name: "General Concepts",
        pages: [
          {
            name: "Fundamentals",
            sections: [
              {
                title: "Basic Usage",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Fundamentals of Martial Arts",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Martial arts are more than simple combat techniques. They are a journey of self-discovery and mastery of body and mind. Every practitioner must first master the fundamentals before advancing to more complex techniques.",
                    },
                  },
                  {
                    type: "divider",
                    content: {},
                  },
                  {
                    type: "heading",
                    content: {
                      text: "Essential Principles",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "unordered-list",
                    content: {
                      items: [
                        {
                          id: crypto.randomUUID(),
                          text: "Stance - Maintain solid base and balance",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Breathing - Control Ki flow through breathing",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Focus - Concentrate mind and energy in the present moment",
                        },
                        {
                          id: crypto.randomUUID(),
                          text: "Flow - Move naturally, without resistance",
                        },
                      ],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 3,
                      color: "orange",
                    },
                  },
                ],
              },
              {
                title: "Body Strengthening",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Tempering the Body",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Before using advanced Ki techniques, the practitioner must strengthen their body. Bones, muscles, and tendons must be tempered through rigorous training to withstand intense energy flow.",
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "star",
                      text: "A well-trained body is like a sharpened weapon - lethal and reliable.",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Techniques",
            sections: [
              {
                title: "Power Levels",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Technique Classification",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Martial techniques are classified into different levels based on the amount of Ki required and execution difficulty. Practitioners must progress gradually through the levels.",
                    },
                  },
                  {
                    type: "divider",
                    content: {},
                  },
                ],
              },
              {
                title: "Basic Techniques",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Level 1-3: Beginner",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Iron Fist",
                        "Spinning Kick",
                        "Basic Block",
                        "Quick Dodge",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Fundamental techniques that every practitioner learns. Focus on proper form and building basic strength.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 2,
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Intermediate Techniques",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Level 4-6: Intermediate",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Steel Palm",
                        "Flying Kick",
                        "Lightning Counter",
                        "Absolute Defense",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Techniques that begin to consciously incorporate Ki. Practitioners at this level can break stones and wood with strikes.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 4.5,
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Advanced Techniques",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Level 7-10: Advanced",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Ki Shockwave",
                        "Dragon Strike",
                        "Energy Barrier",
                        "Dimensional Impact",
                      ],
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Devastating techniques that only masters can perform. Require decades of training and perfect Ki control.",
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "alert",
                      text: "Using advanced techniques without proper preparation can permanently damage the meridians.",
                    },
                  },
                  {
                    type: "stars",
                    content: {
                      rating: 5,
                      size: "large",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "My Dojo",
            sections: [
              {
                title: "Warrior Profile",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "My Martial Profile",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "This is my personal dojo, where I record my preferred fighting style, mastered techniques, and my progress as a martial artist.",
                    },
                  },
                  {
                    type: "image",
                    content: {
                      imageUrl: "",
                      caption: "My Combat Stance",
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "medium",
                    },
                  },
                ],
              },
              {
                title: "Specialization",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "My Main Style",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Every martial artist eventually chooses a style that best suits their nature and combat goals.",
                    },
                  },
                  {
                    type: "dropdown",
                    content: {
                      dataSource: "manual",
                      options: ["Tiger Style", "Snake Style", "Turtle Style", "Crane Style"],
                      selectedValue: "",
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "small",
                    },
                  },
                ],
              },
              {
                title: "Arsenal",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Techniques I Master",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "List of martial techniques I've learned and completely mastered. I can execute them with precision in combat.",
                    },
                  },
                  {
                    type: "multi-dropdown",
                    content: {
                      dataSource: "manual",
                      options: ["Iron Fist", "Steel Palm", "Flying Kick", "Dragon Strike", "Energy Barrier", "Ki Shockwave"],
                      selectedValues: [],
                    },
                  },
                  {
                    type: "informative",
                    content: {
                      icon: "info",
                      text: "The more techniques you master, the more adaptable you'll be in different combat situations.",
                    },
                  },
                ],
              },
              {
                title: "Master",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "My Martial Master",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Every warrior learns from a master. Select the character who is your mentor in the martial arts.",
                    },
                  },
                  {
                    type: "dropdown",
                    content: {
                      dataSource: "characters",
                      options: [],
                      selectedEntityId: undefined,
                    },
                  },
                  {
                    type: "spacer",
                    content: {
                      size: "large",
                    },
                  },
                ],
              },
              {
                title: "Related Training",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Explore Styles",
                      level: 2,
                      alignment: "left",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Use the navigators below to study each combat style in detail.",
                    },
                  },
                  {
                    type: "navigator",
                    content: {
                      linkedPageId: undefined,
                      title: "Study Combat Stances",
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Combat Stances",
            sections: [
              {
                title: "Fighting Styles",
                blocks: [
                  {
                    type: "heading",
                    content: {
                      text: "Stances and Styles",
                      level: 1,
                      alignment: "center",
                    },
                  },
                  {
                    type: "paragraph",
                    content: {
                      text: "Different martial arts styles emphasize different aspects of combat. Each style has its own stances, techniques, and philosophies, based on legendary animals or forces of nature.",
                    },
                  },
                ],
              },
              {
                title: "Tiger Style",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Tiger Stance",
                      description:
                        "Focused on brute strength and devastating attacks. Practitioners of this style are like predators, waiting for the right moment to attack with full force.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Aggressive", "Powerful", "Direct", "Fierce"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 9,
                      color: "orange",
                    },
                  },
                ],
              },
              {
                title: "Snake Style",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Snake Stance",
                      description:
                        "Focused on flexibility and quick, precise attacks. Practitioners flow like water, dodging and counterattacking vital points.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Flexible", "Fast", "Precise", "Adaptable"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 7,
                      color: "green",
                    },
                  },
                ],
              },
              {
                title: "Turtle Style",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Turtle Stance",
                      description:
                        "Focused on impenetrable defense and calculated counterattacks. Practitioners are patient, absorbing attacks and waiting for the perfect opening.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: ["Defensive", "Resilient", "Patient", "Calculated"],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 10,
                      color: "blue",
                    },
                  },
                ],
              },
              {
                title: "Crane Style",
                blocks: [
                  {
                    type: "icon",
                    content: {
                      title: "Crane Stance",
                      description:
                        "Focused on perfect balance and graceful movements. Practitioners move with deadly elegance, attacking from unexpected angles.",
                      alignment: "center",
                    },
                  },
                  {
                    type: "tag-list",
                    content: {
                      tags: [
                        "Balanced",
                        "Graceful",
                        "Unpredictable",
                        "Elegant",
                      ],
                    },
                  },
                  {
                    type: "attributes",
                    content: {
                      max: 10,
                      current: 6,
                      color: "cyan",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export function getMagicTemplateContent(language: Language): TemplateContent {
  return magicTemplateContent[language];
}

export function getMartialTemplateContent(language: Language): TemplateContent {
  return martialTemplateContent[language];
}
