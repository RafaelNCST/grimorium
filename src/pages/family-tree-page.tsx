import { useState } from "react";

import { ArrowLeft, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - in real app this would come from state management
const mockCharacter = {
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

const mockCharacters = [
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

interface TreeNode {
  id: string;
  name: string;
  image?: string;
  generation: number;
  position: number;
  relations: string[];
}

export function FamilyTreePage() {
  const { bookId, characterId } = useParams();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const character = mockCharacter; // In real app, fetch by characterId
  const allCharacters = mockCharacters;

  // Build family tree data structure
  const buildFamilyTree = () => {
    const treeNodes: TreeNode[] = [];
    const processedIds = new Set<string>();

    // Helper function to add character to tree
    const addToTree = (
      charId: string,
      generation: number,
      relation: string
    ) => {
      if (processedIds.has(charId)) return;

      const char = allCharacters.find((c) => c.id === charId);
      if (!char) return;

      processedIds.add(charId);

      // Calculate position within generation
      const sameGenNodes = treeNodes.filter((n) => n.generation === generation);
      const position = sameGenNodes.length;

      treeNodes.push({
        id: charId,
        name: char.name,
        image: char.image,
        generation,
        position,
        relations: [relation],
      });

      return char;
    };

    // Start with the main character
    addToTree(character.id, 0, "main");

    // Add parents (generation -1)
    if (character.family.father) {
      addToTree(character.family.father, -1, "pai");
    }
    if (character.family.mother) {
      addToTree(character.family.mother, -1, "mãe");
    }

    // Add grandparents (generation -2)
    character.family.grandparents.forEach((grandparentId: string) => {
      addToTree(grandparentId, -2, "avô/avó");
    });

    // Add spouse (same generation)
    if (character.family.spouse) {
      addToTree(character.family.spouse, 0, "cônjuge");
    }

    // Add siblings (same generation)
    character.family.siblings.forEach((siblingId: string) => {
      addToTree(siblingId, 0, "irmão/irmã");
    });

    character.family.halfSiblings.forEach((halfSiblingId: string) => {
      addToTree(halfSiblingId, 0, "meio-irmão/irmã");
    });

    // Add uncles/aunts (generation -1)
    character.family.unclesAunts.forEach((uncleAuntId: string) => {
      addToTree(uncleAuntId, -1, "tio/tia");
    });

    // Add cousins (same generation)
    character.family.cousins.forEach((cousinId: string) => {
      addToTree(cousinId, 0, "primo/prima");
    });

    // Add children (generation +1)
    character.family.children.forEach((childId: string) => {
      addToTree(childId, 1, "filho/filha");
    });

    return treeNodes.sort((a, b) => {
      if (a.generation !== b.generation) return b.generation - a.generation; // Higher generations first
      return a.position - b.position;
    });
  };

  const treeNodes = buildFamilyTree();
  const generations = [...new Set(treeNodes.map((n) => n.generation))].sort(
    (a, b) => b - a
  );

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  const getGenerationLabel = (generation: number) => {
    switch (generation) {
      case -2:
        return "Bisavós";
      case -1:
        return "Pais e Tios";
      case 0:
        return "Personagem e Irmãos";
      case 1:
        return "Filhos";
      case 2:
        return "Netos";
      default:
        return generation < 0 ? "Ancestrais" : "Descendentes";
    }
  };

  const getRelationColor = (relation: string) => {
    switch (relation) {
      case "main":
        return "bg-primary text-primary-foreground";
      case "pai":
      case "mãe":
        return "bg-blue-500 text-white";
      case "cônjuge":
        return "bg-red-500 text-white";
      case "irmão/irmã":
        return "bg-green-500 text-white";
      case "meio-irmão/irmã":
        return "bg-green-400 text-white";
      case "filho/filha":
        return "bg-purple-500 text-white";
      case "avô/avó":
        return "bg-orange-500 text-white";
      case "tio/tia":
        return "bg-yellow-500 text-white";
      case "primo/prima":
        return "bg-indigo-500 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  if (treeNodes.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/book/${bookId}/character/${characterId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">
            Árvore Genealógica - {character.name}
          </h1>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhuma relação familiar foi definida para este personagem.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Adicione relações familiares no modo de edição do personagem.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto py-8 px-4 ${isFullscreen ? "max-w-full h-screen" : "max-w-7xl"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/book/${bookId}/character/${characterId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">
            Árvore Genealógica - {character.name}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 2}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className={`flex-1 overflow-auto p-6 bg-muted/20 rounded-lg ${isFullscreen ? "h-[calc(100vh-200px)]" : "min-h-[70vh]"}`}
      >
        <div
          className="min-w-max min-h-full flex flex-col items-center justify-center space-y-8 transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          {generations.map((generation) => {
            const generationNodes = treeNodes.filter(
              (n) => n.generation === generation
            );

            return (
              <div key={generation} className="w-full">
                <div className="text-center mb-4">
                  <Badge variant="outline" className="text-xs">
                    {getGenerationLabel(generation)}
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-6 flex-wrap">
                  {generationNodes.map((node) => (
                    <Card
                      key={node.id}
                      className={`w-48 ${node.id === character.id ? "ring-2 ring-primary" : ""}`}
                    >
                      <CardContent className="p-4 text-center">
                        <Avatar className="w-12 h-12 mx-auto mb-3">
                          <AvatarImage src={node.image} />
                          <AvatarFallback>
                            {node.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <h4 className="font-medium text-sm mb-2">
                          {node.name}
                        </h4>

                        <div className="flex flex-wrap gap-1 justify-center">
                          {node.relations.map((relation, index) => (
                            <Badge
                              key={index}
                              className={`text-xs ${getRelationColor(relation)}`}
                            >
                              {relation === "main" ? "Personagem" : relation}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Connection lines (simplified visual representation) */}
                {generation > generations[generations.length - 1] && (
                  <div className="flex justify-center my-4">
                    <div className="w-px h-8 bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <p className="text-xs text-muted-foreground">
          Use os controles de zoom para navegar pela árvore genealógica
        </p>
      </div>
    </div>
  );
}
