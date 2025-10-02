export interface IRelationshipType {
  value: string;
  label: string;
  emoji: string;
  color: string;
}

export const RELATIONSHIP_TYPES_CONSTANT: IRelationshipType[] = [
  {
    value: "odio",
    label: "Ódio",
    emoji: "😡",
    color: "bg-red-500/10 text-red-600",
  },
  {
    value: "amor",
    label: "Amor",
    emoji: "❤️",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    value: "interesse_amoroso",
    label: "Interesse Amoroso",
    emoji: "💕",
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    value: "mentorado",
    label: "Mentorado",
    emoji: "🎓",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    value: "subordinacao",
    label: "Subordinação",
    emoji: "🫡",
    color: "bg-gray-500/10 text-gray-600",
  },
  {
    value: "rivalidade",
    label: "Rivalidade",
    emoji: "⚔️",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    value: "lideranca",
    label: "Liderança",
    emoji: "👑",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    value: "amizade",
    label: "Amizade",
    emoji: "😊",
    color: "bg-green-500/10 text-green-600",
  },
  {
    value: "melhores_amigos",
    label: "Melhores Amigos",
    emoji: "👥",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    value: "inimizade",
    label: "Inimizade",
    emoji: "😤",
    color: "bg-red-600/10 text-red-700",
  },
  {
    value: "neutro",
    label: "Neutro",
    emoji: "😐",
    color: "bg-slate-500/10 text-slate-600",
  },
];
