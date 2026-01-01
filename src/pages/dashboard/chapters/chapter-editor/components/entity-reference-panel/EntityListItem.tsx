import { User, MapPin, Shield, Sparkles, Users, Pin, PinOff } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { EntityListItemProps } from "./types";

const ENTITY_CONFIG = {
  character: { icon: User, color: "text-blue-500" },
  region: { icon: MapPin, color: "text-green-500" },
  faction: { icon: Shield, color: "text-purple-500" },
  item: { icon: Sparkles, color: "text-amber-500" },
  race: { icon: Users, color: "text-pink-500" },
};

export function EntityListItem({
  type,
  name,
  image,
  isPinned,
  onPin,
  onUnpin,
  onClick,
}: EntityListItemProps) {
  const Icon = ENTITY_CONFIG[type].icon;

  return (
    <div
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
      onClick={isPinned ? onUnpin : onPin}
      title={isPinned ? "Clique para desafixar" : "Clique para fixar"}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Avatar className="w-8 h-8 flex-shrink-0 rounded-md">
          <AvatarImage src={image} />
          <AvatarFallback className="rounded-md">
            <Icon className={`w-4 h-4 ${ENTITY_CONFIG[type].color}`} />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{name}</span>
      </div>

      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {isPinned ? (
          <PinOff className={`w-3.5 h-3.5 ${ENTITY_CONFIG[type].color}`} />
        ) : (
          <Pin className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
