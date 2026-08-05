import { liveQuery } from 'dexie';
import { useEffect, useState, type DependencyList } from 'react';

export function useLiveData<T>(query: () => Promise<T>, dependencies: DependencyList, initial: T): T {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const subscription = liveQuery(query).subscribe({
      next: setValue,
      error: (error) => console.error('Local data query failed', error)
    });
    return () => subscription.unsubscribe();
    // The caller owns the stable dependency list for its query.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return value;
}
