export interface IRelationshipType {
  value: string;
  label: string;
  emoji: string;
  color: string;
}

export const RELATIONSHIP_TYPES_CONSTANT: IRelationshipType[] = [
  {
    value: "friend",
    label: "Amigo",
    emoji: "👥",
    color: "bg-green-500/10 text-green-600",
  },
  {
    value: "rival",
    label: "Rival",
    emoji: "⚔️",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    value: "mentor",
    label: "Mentor",
    emoji: "🎓",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    value: "apprentice",
    label: "Aprendiz",
    emoji: "📖",
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    value: "enemy",
    label: "Inimigo",
    emoji: "💀",
    color: "bg-red-500/10 text-red-600",
  },
  {
    value: "love_interest",
    label: "Interesse Amoroso",
    emoji: "❤️",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    value: "ally",
    label: "Aliado",
    emoji: "🛡️",
    color: "bg-indigo-500/10 text-indigo-600",
  },
  {
    value: "acquaintance",
    label: "Conhecido",
    emoji: "✨",
    color: "bg-gray-500/10 text-gray-600",
  },
  {
    value: "leader",
    label: "Líder",
    emoji: "👑",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    value: "subordinate",
    label: "Subordinado",
    emoji: "🫡",
    color: "bg-slate-500/10 text-slate-600",
  },
  {
    value: "family_love",
    label: "Amor Familiar",
    emoji: "🏠",
    color: "bg-pink-400/10 text-pink-500",
  },
  {
    value: "romantic_relationship",
    label: "Relacionamento Amoroso",
    emoji: "💕",
    color: "bg-fuchsia-500/10 text-fuchsia-600",
  },
  {
    value: "best_friend",
    label: "Melhor Amigo",
    emoji: "🤝",
    color: "bg-teal-500/10 text-teal-600",
  },
  {
    value: "hatred",
    label: "Ódio",
    emoji: "🔥",
    color: "bg-red-700/10 text-red-700",
  },
  {
    value: "neutral",
    label: "Neutro",
    emoji: "😐",
    color: "bg-gray-400/10 text-gray-500",
  },
  {
    value: "devotion",
    label: "Devoção",
    emoji: "✨",
    color: "bg-violet-500/10 text-violet-600",
  },
];
