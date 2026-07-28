import sketchData from '@/data/sketches.json';

export interface Sketch {
  id: number;
  url: string;
  title: string | null;
  tags: string[];
  date: string;
}

export function useSketches() {
  const sketches = sketchData as Sketch[];
  return {
    sketches,
    loading: false,
    hasMore: false,
    loadMore: () => {},
  };
}
