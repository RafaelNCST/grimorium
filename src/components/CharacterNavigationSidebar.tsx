import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Character {
  id: string;
  name: string;
  image?: string;
  role?: string;
}

interface CharacterNavigationSidebarProps {
  characters: Character[];
  currentCharacterId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CharacterNavigationSidebar({
  characters,
  currentCharacterId,
  isOpen,
  onClose
}: CharacterNavigationSidebarProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCharacters = characters.filter(char =>
    char.id !== currentCharacterId &&
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCharacterSelect = (characterId: string) => {
    // Use replace to not accumulate in history
    navigate(`/book/1/character/${characterId}`, { replace: true });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border shadow-lg lg:relative lg:shadow-none">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Personagens</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar personagens..."
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredCharacters.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchTerm ? "Nenhum personagem encontrado" : "Não há outros personagens"}
            </p>
          ) : (
            filteredCharacters.map((char) => (
              <button
                key={char.id}
                onClick={() => handleCharacterSelect(char.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={char.image} alt={char.name} />
                  <AvatarFallback>{char.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{char.name}</p>
                  {char.role && (
                    <p className="text-sm text-muted-foreground capitalize">{char.role}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}