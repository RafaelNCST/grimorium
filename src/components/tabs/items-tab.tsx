import React, { useState } from "react";

import {
  Plus,
  Search,
  Package,
  Sword,
  Shield,
  Zap,
  Gem,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/empty-state";
import { CreateItemModal } from "@/components/modals/create-item-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data structures
interface Rarity {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface ItemStatus {
  id: string;
  name: string;
  icon: string;
}

interface Item {
  id: string;
  name: string;
  image: string;
  alternativeNames: string[];
  basicDescription: string;
  appearanceDescription: string;
  category: string;
  rarity: Rarity;
  status: ItemStatus;
  origin: string;
  weaknesses: string;
  powers: string;
  mythology: Array<{
    id: string;
    people: string;
    version: string;
  }>;
  inspirations: string;
}

// Mock data
const mockRarities: Rarity[] = [
  { id: "1", name: "Comum", color: "#6B7280", icon: "⚪" },
  { id: "2", name: "Incomum", color: "#10B981", icon: "🟢" },
  { id: "3", name: "Raro", color: "#3B82F6", icon: "🔵" },
  { id: "4", name: "Lendário", color: "#F59E0B", icon: "🟡" },
];

const mockStatuses: ItemStatus[] = [
  { id: "1", name: "Destruído", icon: "💥" },
  { id: "2", name: "Completa", icon: "✨" },
  { id: "3", name: "Incompleta", icon: "🪓" },
  { id: "4", name: "Selada", icon: "🔒" },
  { id: "5", name: "Enfraquecida", icon: "⚡" },
];

const mockItems: Item[] = [
  {
    id: "1",
    name: "Excalibur",
    image: "/placeholder.svg",
    alternativeNames: ["A Espada do Rei", "Caliburn"],
    basicDescription: "Lendária espada do Rei Arthur",
    appearanceDescription:
      "Uma espada de lâmina prateada com punho dourado ornamentado",
    category: "Arma",
    rarity: mockRarities[3],
    status: mockStatuses[1],
    origin: "Forjada por Merlim nas forjas celestiais",
    weaknesses: "Só pode ser empunhada por alguém puro de coração",
    powers: "Corta qualquer material, emite luz divina",
    mythology: [],
    inspirations: "Lenda Arturiana, mitologia celta",
  },
  {
    id: "2",
    name: "Poção de Cura Menor",
    image: "/placeholder.svg",
    alternativeNames: ["Elixir Básico"],
    basicDescription: "Poção que restaura ferimentos leves",
    appearanceDescription: "Líquido vermelho em frasco de vidro pequeno",
    category: "Consumível",
    rarity: mockRarities[0],
    status: mockStatuses[1],
    origin: "Alquimistas da Torre de Marfim",
    weaknesses: "Efeito limitado, não funciona em ferimentos mágicos",
    powers: "Regeneração acelerada de tecidos",
    mythology: [],
    inspirations: "RPGs clássicos, alquimia medieval",
  },
];

const categories = [
  "Arma",
  "Armadura",
  "Consumível",
  "Recurso",
  "Artefato",
  "Relíquia",
  "Outro",
];

export function ItemsTab() {
  const navigate = useNavigate();
  const [items] = useState<Item[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alternativeNames.some((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesRarity =
      selectedRarity === "all" || item.rarity.id === selectedRarity;

    return matchesSearch && matchesCategory && matchesRarity;
  });

  const handleItemClick = (itemId: string) => {
    navigate(`/item/${itemId}`);
  };

  const handleCreateItem = (itemData: any) => {
    console.log("Creating item:", itemData);
    setShowCreateModal(false);
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Itens</h2>
            <p className="text-muted-foreground">
              Gerencie armas, artefatos e itens importantes da sua história
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="btn-magical"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Item
          </Button>
        </div>

        <EmptyState
          icon={Package}
          title="Nenhum item cadastrado"
          description="Comece criando seu primeiro item para equipar seus personagens e enriquecer sua história."
          actionLabel="Criar Primeiro Item"
          onAction={() => setShowCreateModal(true)}
        />

        <CreateItemModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateItem}
          rarities={mockRarities}
          statuses={mockStatuses}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with compact rarity stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Itens</h2>
          <p className="text-muted-foreground">
            Gerencie armas, artefatos e itens importantes da sua história
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">{items.length} Total</Badge>
            <Badge className="bg-gray-100 text-gray-700">
              {items.filter((i) => i.rarity.name === "Comum").length} Comum
            </Badge>
            <Badge className="bg-blue-100 text-blue-700">
              {items.filter((i) => i.rarity.name === "Raro").length} Raro
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-700">
              {items.filter((i) => i.rarity.name === "Lendário").length}{" "}
              Lendário
            </Badge>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="btn-magical"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRarity} onValueChange={setSelectedRarity}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Raridade" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todas as raridades</SelectItem>
            {mockRarities.map((rarity) => (
              <SelectItem key={rarity.id} value={rarity.id}>
                <div className="flex items-center gap-2">
                  <span>{rarity.icon}</span>
                  <span>{rarity.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 && items.length > 0 && (
        <EmptyState
          icon={Search}
          title="Nenhum item encontrado"
          description="Tente ajustar os filtros ou o termo de busca."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            onClick={() => handleItemClick(item.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: `${item.rarity.color}20`,
                      color: item.rarity.color,
                      border: `1px solid ${item.rarity.color}40`,
                    }}
                  >
                    <span className="mr-1">{item.rarity.icon}</span>
                    {item.rarity.name}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg leading-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-lg">{item.status.icon}</span>
                    <span className="text-muted-foreground text-xs">
                      {item.status.name}
                    </span>
                  </div>
                </div>

                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.basicDescription}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateItemModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateItem}
        rarities={mockRarities}
        statuses={mockStatuses}
      />
    </div>
  );
}
