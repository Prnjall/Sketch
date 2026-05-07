'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Sketch } from '@/types/sketch';

export function useSketches(limit = 9) {
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from('sketches')
          .select('*')
          .order('created_at', { ascending: false })
          .range(page * limit, (page + 1) * limit - 1);

        if (err) {
          setError(err.message);
          return;
        }

        if (!data) {
          setError('No data returned');
          return;
        }

        setSketches(prev => [...prev, ...data]);
        if (data.length < limit) setHasMore(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, limit]);

  return {
    sketches,
    loading,
    hasMore,
    error,
    loadMore: () => setPage(p => p + 1),
  };
}
