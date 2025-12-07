export interface IRelationshipType {
  value: string;
  translationKey: string;
  emoji: string;
  color: string;
}

export const RELATIONSHIP_TYPES_CONSTANT: IRelationshipType[] = [
  {
    value: "friend",
    translationKey: "relationship_types.friend",
    emoji: "👥",
    color: "bg-green-500/10 text-green-600",
  },
  {
    value: "rival",
    translationKey: "relationship_types.rival",
    emoji: "⚔️",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    value: "mentor",
    translationKey: "relationship_types.mentor",
    emoji: "🎓",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    value: "apprentice",
    translationKey: "relationship_types.apprentice",
    emoji: "📖",
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    value: "enemy",
    translationKey: "relationship_types.enemy",
    emoji: "💀",
    color: "bg-red-500/10 text-red-600",
  },
  {
    value: "love_interest",
    translationKey: "relationship_types.love_interest",
    emoji: "❤️",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    value: "ally",
    translationKey: "relationship_types.ally",
    emoji: "🛡️",
    color: "bg-indigo-500/10 text-indigo-600",
  },
  {
    value: "acquaintance",
    translationKey: "relationship_types.acquaintance",
    emoji: "✨",
    color: "bg-gray-500/10 text-gray-600",
  },
  {
    value: "leader",
    translationKey: "relationship_types.leader",
    emoji: "👑",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    value: "subordinate",
    translationKey: "relationship_types.subordinate",
    emoji: "🫡",
    color: "bg-slate-500/10 text-slate-600",
  },
  {
    value: "family_love",
    translationKey: "relationship_types.family_love",
    emoji: "🏠",
    color: "bg-pink-400/10 text-pink-500",
  },
  {
    value: "romantic_relationship",
    translationKey: "relationship_types.romantic_relationship",
    emoji: "💕",
    color: "bg-fuchsia-500/10 text-fuchsia-600",
  },
  {
    value: "best_friend",
    translationKey: "relationship_types.best_friend",
    emoji: "🤝",
    color: "bg-teal-500/10 text-teal-600",
  },
  {
    value: "hatred",
    translationKey: "relationship_types.hatred",
    emoji: "🔥",
    color: "bg-red-700/10 text-red-700",
  },
  {
    value: "neutral",
    translationKey: "relationship_types.neutral",
    emoji: "😐",
    color: "bg-gray-400/10 text-gray-500",
  },
  {
    value: "devotion",
    translationKey: "relationship_types.devotion",
    emoji: "✨",
    color: "bg-violet-500/10 text-violet-600",
  },
];
