import { useState, useEffect } from 'react';
import { getCharactersByBookId } from '@/lib/db/characters.service';
import type { ICharacter } from '@/types/character-types';

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
    if (dataSource !== 'characters') {
      setEntities([]);
      return;
    }

    const loadEntities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const characters = await getCharactersByBookId(bookId);
        const options = characters.map((char: ICharacter) => ({
          id: char.id,
          name: char.name,
          image: char.image,
        }));
        setEntities(options);
      } catch (err) {
        setError('Failed to load entities');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntities();
  }, [dataSource, bookId]);

  return { entities, isLoading, error };
}
