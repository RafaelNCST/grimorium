import { useState, useEffect } from 'react';
import { getCharacterById } from '@/lib/db/characters.service';

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
  const [resolvedEntities, setResolvedEntities] = useState<ResolvedEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dataSource !== 'characters' || entityIds.length === 0) {
      setResolvedEntities([]);
      return;
    }

    const resolveEntities = async () => {
      setIsLoading(true);

      try {
        const resolved = await Promise.all(
          entityIds.map(async (id) => {
            try {
              const char = await getCharacterById(id);
              return {
                id,
                name: char?.name ?? '[Deleted]',
                exists: !!char,
              };
            } catch {
              return {
                id,
                name: '[Deleted]',
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
