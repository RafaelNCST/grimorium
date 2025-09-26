export interface FamilyRelations {
  father: string | null;
  mother: string | null;
  children: string[];
  siblings: string[];
  spouse: string | null;
  halfSiblings: string[];
  unclesAunts: string[];
  grandparents: string[];
  cousins: string[];
}

export interface Character {
  id: string;
  name: string;
  image?: string;
  family?: FamilyRelations;
}

export interface TreeNode {
  id: string;
  name: string;
  image?: string;
  generation: number;
  position: number;
  relations: string[];
}

// Mock data - in real app this would come from state management
export const mockCharacter = {
  id: "1",
  name: "Aelric Valorheart",
  image:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  family: {
    father: null,
    mother: null,
    children: [],
    siblings: [],
    spouse: null,
    halfSiblings: [],
    unclesAunts: [],
    grandparents: [],
    cousins: [],
  },
};

export const mockCharacters: Character[] = [
  {
    id: "1",
    name: "Aelric Valorheart",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Elena Moonwhisper",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Marcus Ironforge",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Lyra Starweaver",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "Thane Stormborn",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "Aria Nightsong",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: "7",
    name: "Gareth Goldshield",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: "8",
    name: "Vera Shadowbane",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: "9",
    name: "Duncan Firebeard",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
  },
  {
    id: "10",
    name: "Seraphina Dawnbringer",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
  },
];
