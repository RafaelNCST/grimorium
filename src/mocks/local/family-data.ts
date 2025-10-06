export interface Character {
  id: string;
  name: string;
  image?: string;
  birthYear?: number;
  deathYear?: number;
  status: "alive" | "deceased" | "unknown";
  gender: "male" | "female" | "other";
}

export interface TreeNode {
  character: Character;
  spouses: Character[];
  children: TreeNode[];
  parents: Character[];
}

export const mockCharacter: Character = {
  id: "",
  name: "",
  status: "unknown",
  gender: "other",
};

export const mockCharacters: Character[] = [];
