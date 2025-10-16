import React from "react";

import { Plus, Search, Package } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { CreateItemModal } from "@/components/modals/create-item-modal/index";
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
import { Item, Rarity, ItemStatus } from "@/mocks/local/item-data";

interface PropsItemsView {
  items: Item[];
  filteredItems: Item[];
  categories: string[];
  mockRarities: Rarity[];
  mockStatuses: ItemStatus[];
  searchTerm: string;
  selectedCategory: string;
  selectedRarity: string;
  showCreateModal: boolean;
  onSearchTermChange: (term: string) => void;
  onSelectedCategoryChange: (category: string) => void;
  onSelectedRarityChange: (rarity: string) => void;
  onShowCreateModalChange: (show: boolean) => void;
  onNavigateToItem: (itemId: string) => void;
  onCreateItem: (itemData: any) => void;
}

export function ItemsView({
  items,
  filteredItems,
  categories,
  mockRarities,
  mockStatuses,
  searchTerm,
  selectedCategory,
  selectedRarity,
  showCreateModal,
  onSearchTermChange,
  onSelectedCategoryChange,
  onSelectedRarityChange,
  onShowCreateModalChange,
  onNavigateToItem,
  onCreateItem,
}: PropsItemsView) {
  if (items.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Itens</h2>
            <p className="text-muted-foreground">
              Gerencie armas, artefatos e itens importantes da sua história
            </p>
          </div>
          <Button
            variant="magical"
            size="lg"
            onClick={() => onShowCreateModalChange(true)}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Item
          </Button>
        </div>

        <EmptyState
          icon={Package}
          title="Nenhum item cadastrado"
          description="Comece criando seu primeiro item para equipar seus personagens e enriquecer sua história."
        />

        <CreateItemModal
          open={showCreateModal}
          onClose={() => onShowCreateModalChange(false)}
          onConfirm={onCreateItem}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Itens</h2>
          <p className="text-muted-foreground">
            Gerencie armas, artefatos e itens importantes da sua história
          </p>
          {items.length > 0 && (
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
          )}
        </div>
        <Button
          variant="magical"
          size="lg"
          onClick={() => onShowCreateModalChange(true)}
          className="animate-glow"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Item
        </Button>
      </div>

      {items.length > 0 && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar itens..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={selectedCategory}
            onValueChange={onSelectedCategoryChange}
          >
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

          <Select value={selectedRarity} onValueChange={onSelectedRarityChange}>
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
      )}

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
            onClick={() => onNavigateToItem(item.id)}
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
        open={showCreateModal}
        onClose={() => onShowCreateModalChange(false)}
        onConfirm={onCreateItem}
      />
    </div>
  );
}
