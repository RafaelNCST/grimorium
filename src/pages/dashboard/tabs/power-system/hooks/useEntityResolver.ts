import { useState, useEffect } from "react";

import { getCharacterById } from "@/lib/db/characters.service";
import { getFactionById } from "@/lib/db/factions.service";
import { getItemById } from "@/lib/db/items.service";
import { getRaceById } from "@/lib/db/races.service";

interface ResolvedEntity {
  id: string;
  name: string;
  exists: boolean;
}

export function useEntityResolver(
  dataSource: string | undefined,
  entityIds: string[],
  bookId: string
) {
  const [resolvedEntities, setResolvedEntities] = useState<ResolvedEntity[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!dataSource || dataSource === "manual" || entityIds.length === 0) {
      setResolvedEntities([]);
      return;
    }

    const resolveEntities = async () => {
      setIsLoading(true);

      try {
        const resolved = await Promise.all(
          entityIds.map(async (id) => {
            try {
              let entity = null;

              switch (dataSource) {
                case "characters":
                  entity = await getCharacterById(id);
                  break;
                case "factions":
                  entity = await getFactionById(id);
                  break;
                case "items":
                  entity = await getItemById(id);
                  break;
                case "races":
                  entity = await getRaceById(id);
                  break;
              }

              return {
                id,
                name: entity?.name ?? "[Deleted]",
                exists: !!entity,
              };
            } catch {
              return {
                id,
                name: "[Deleted]",
                exists: false,
              };
            }
          })
        );

        setResolvedEntities(resolved);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    resolveEntities();
  }, [dataSource, JSON.stringify(entityIds), bookId]);

  return { resolvedEntities, isLoading };
}
