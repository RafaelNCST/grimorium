import { useState, useEffect } from "react";

import {
  Link,
  Unlink,
  User,
  Skull,
  Globe,
  Mountain,
  MapPin,
  Package,
  Search,
  Plus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { IAnnotationLink, ILinkedEntity } from "@/types/annotations";

interface PropsEntityLinksModal {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  noteName: string;
  currentLinks: IAnnotationLink[];
  onLinksChange: (links: IAnnotationLink[]) => void;
}

// Mock data - in real app would come from API/state
const mockEntities: ILinkedEntity[] = [
  // Characters
  { id: "char-1", name: "Aelric Valorheart", type: "character" },
  { id: "char-2", name: "Elena Moonwhisper", type: "character" },
  { id: "char-3", name: "Marcus Ironforge", type: "character" },

  // Beasts
  { id: "beast-1", name: "Dragão Sombrio", type: "beast" },
  { id: "beast-2", name: "Lobo das Névoas", type: "beast" },

  // World entities
  { id: "world-1", name: "Aethermoor", type: "world" },
  { id: "continent-1", name: "Continente Central", type: "continent" },
  { id: "location-1", name: "Floresta das Lamentações", type: "location" },
  { id: "location-2", name: "Vila Pedraverde", type: "location" },

  // Items
  { id: "item-1", name: "Excalibur", type: "item" },
  { id: "item-2", name: "Anel do Poder", type: "item" },
];

export function EntityLinksModal({
  isOpen,
  onClose,
  noteId,
  noteName,
  currentLinks,
  onLinksChange,
}: PropsEntityLinksModal) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "character":
        return <User className="w-4 h-4" />;
      case "beast":
        return <Skull className="w-4 h-4" />;
      case "world":
        return <Globe className="w-4 h-4" />;
      case "continent":
        return <Mountain className="w-4 h-4" />;
      case "location":
        return <MapPin className="w-4 h-4" />;
      case "item":
        return <Package className="w-4 h-4" />;
      default:
        return <Link className="w-4 h-4" />;
    }
  };

  const getEntityTypeName = (type: string) => {
    switch (type) {
      case "character":
        return "Personagem";
      case "beast":
        return "Besta";
      case "world":
        return "Mundo";
      case "continent":
        return "Continente";
      case "location":
        return "Local";
      case "item":
        return "Item";
      default:
        return "Entidade";
    }
  };

  const filteredEntities = mockEntities.filter((entity) => {
    const matchesSearch = entity.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === "all" || entity.type === selectedTab;
    return matchesSearch && matchesTab;
  });

  const isLinked = (entityId: string) =>
    currentLinks.some((link) => link.entityId === entityId);

  const handleToggleLink = (entity: ILinkedEntity) => {
    const existingLink = currentLinks.find(
      (link) => link.entityId === entity.id
    );

    if (existingLink) {
      // Remove link
      const newLinks = currentLinks.filter(
        (link) => link.entityId !== entity.id
      );
      onLinksChange(newLinks);
      toast({
        title: "Link removido",
        description: `Link com ${entity.name} foi removido.`,
      });
    } else {
      // Add link
      const newLink: IAnnotationLink = {
        id: `link-${Date.now()}`,
        noteId,
        entityType: entity.type,
        entityId: entity.id,
        createdAt: new Date(),
      };
      onLinksChange([...currentLinks, newLink]);
      toast({
        title: "Link criado",
        description: `Link com ${entity.name} foi criado.`,
      });
    }
  };

  const linkedEntities = mockEntities.filter((entity) =>
    currentLinks.some((link) => link.entityId === entity.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[80vh]"
        aria-describedby="entity-links-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Gerenciar Links - {noteName}
          </DialogTitle>
        </DialogHeader>

        <div id="entity-links-description" className="sr-only">
          Modal para gerenciar links entre a anotação {noteName} e outras
          entidades do projeto
        </div>

        <div className="space-y-4">
          {/* Current Links Summary */}
          {linkedEntities.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <h3 className="font-semibold mb-2">
                Links Atuais ({linkedEntities.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {linkedEntities.map((entity) => (
                  <Badge
                    key={entity.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {getEntityIcon(entity.type)}
                    {entity.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleToggleLink(entity)}
                    >
                      <Unlink className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar entidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Entity Types Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="character">Personagens</TabsTrigger>
              <TabsTrigger value="beast">Bestas</TabsTrigger>
              <TabsTrigger value="world">Mundos</TabsTrigger>
              <TabsTrigger value="location">Locais</TabsTrigger>
              <TabsTrigger value="item">Itens</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {filteredEntities.map((entity) => (
                    <Card
                      key={entity.id}
                      className="hover:shadow-sm transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getEntityIcon(entity.type)}
                            <div>
                              <span className="font-medium">{entity.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {getEntityTypeName(entity.type)}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant={
                              isLinked(entity.id) ? "destructive" : "outline"
                            }
                            size="sm"
                            onClick={() => handleToggleLink(entity)}
                          >
                            {isLinked(entity.id) ? (
                              <>
                                <Unlink className="w-4 h-4 mr-2" />
                                Deslinkar
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Linkar
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredEntities.length === 0 && (
                    <div className="text-center py-8">
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhuma entidade encontrada com "{searchTerm}"
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
