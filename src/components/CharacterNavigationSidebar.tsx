import { useState } from "react";
import { X, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Character {
  id: string;
  name: string;
  image?: string;
}

interface CharacterNavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  currentCharacterId?: string;
  onCharacterSelect: (characterId: string) => void;
}

export function CharacterNavigationSidebar({
  isOpen,
  onClose,
  characters,
  currentCharacterId,
  onCharacterSelect
}: CharacterNavigationSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className={`w-80 bg-background border-r border-border shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Personagens</h2>
          <span className="text-xs text-muted-foreground">
            ({filteredCharacters.length})
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar personagem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Character List */}
      <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
        <div className="p-2">
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum personagem encontrado</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCharacters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => {
                    onCharacterSelect(character.id);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50 ${
                    currentCharacterId === character.id 
                      ? 'bg-muted border border-primary/20' 
                      : ''
                  }`}
                >
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={character.image} />
                    <AvatarFallback className="text-sm">
                      {character.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {character.name}
                    </p>
                    {currentCharacterId === character.id && (
                      <p className="text-xs text-primary">
                        Visualizando atualmente
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}