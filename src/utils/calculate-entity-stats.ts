export function calculateEntityStats<T extends Record<string, any>>(
  entities: T[],
  field: keyof T,
  values: string[]
): Record<string, number> & { total: number } {
  const stats: Record<string, number> = {};

  // Initialize counts for all values
  values.forEach(value => {
    stats[value] = 0;
  });

  // Count entities
  entities.forEach(entity => {
    const fieldValue = entity[field];
    if (fieldValue != null && typeof fieldValue === 'string') {
      if (stats[fieldValue] !== undefined) {
        stats[fieldValue]++;
      }
    }
  });

  // Add total
  return {
    ...stats,
    total: entities.length,
  };
}
