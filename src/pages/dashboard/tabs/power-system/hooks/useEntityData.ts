import { useState, useEffect } from "react";

import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import type { IItem } from "@/lib/db/items.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import { getRegionsByBookId } from "@/lib/db/regions.service";
import type { IRace } from "@/pages/dashboard/tabs/races/types/race-types";
import type { IRegion } from "@/pages/dashboard/tabs/world/types/region-types";
import type { ICharacter } from "@/types/character-types";
import type { IFaction } from "@/types/faction-types";

interface EntityOption {
  id: string;
  name: string;
  image?: string;
}

export function useEntityData(dataSource: string | undefined, bookId: string) {
  const [entities, setEntities] = useState<EntityOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataSource || dataSource === "manual") {
      setEntities([]);
      return;
    }

    const loadEntities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let options: EntityOption[] = [];

        switch (dataSource) {
          case "characters": {
            const characters = await getCharactersByBookId(bookId);
            options = characters.map((char: ICharacter) => ({
              id: char.id,
              name: char.name,
              image: char.image,
            }));
            break;
          }
          case "factions": {
            const factions = await getFactionsByBookId(bookId);
            options = factions.map((faction: IFaction) => ({
              id: faction.id,
              name: faction.name,
              image: faction.image,
            }));
            break;
          }
          case "items": {
            const items = await getItemsByBookId(bookId);
            options = items.map((item: IItem) => ({
              id: item.id,
              name: item.name,
              image: item.image,
            }));
            break;
          }
          case "races": {
            const races = await getRacesByBookId(bookId);
            options = races.map((race: IRace) => ({
              id: race.id,
              name: race.name,
              image: race.image,
            }));
            break;
          }
          case "regions": {
            const regions = await getRegionsByBookId(bookId);
            options = regions.map((region: IRegion) => ({
              id: region.id,
              name: region.name,
              image: region.image,
            }));
            break;
          }
        }

        setEntities(options);
      } catch (err) {
        setError("Failed to load entities");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntities();
  }, [dataSource, bookId]);

  return { entities, isLoading, error };
}
