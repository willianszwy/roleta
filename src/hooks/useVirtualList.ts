import { useState, useEffect, useMemo } from 'react';

interface UseVirtualListOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Items extras para renderizar fora da viewport
}

interface VirtualListItem<T> {
  index: number;
  item: T;
  style: React.CSSProperties;
}

/**
 * Hook para virtual scrolling - renderiza apenas itens visíveis
 * Melhora performance significativamente com listas grandes (>100 itens)
 */
export function useVirtualList<T>(
  items: T[],
  options: UseVirtualListOptions
): {
  virtualItems: VirtualListItem<T>[];
  totalHeight: number;
  scrollElementProps: {
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    style: React.CSSProperties;
  };
} {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  // Calcular quantos itens cabem na viewport
  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  
  // Calcular índices dos itens visíveis
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan
  );
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleItemsCount + 2 * overscan
  );

  // Criar lista virtual dos itens visíveis
  const virtualItems = useMemo(() => {
    const result: VirtualListItem<T>[] = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      result.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute',
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
        },
      });
    }
    
    return result;
  }, [items, startIndex, endIndex, itemHeight]);

  // Handler para scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Props para o elemento de scroll
  const scrollElementProps = {
    onScroll: handleScroll,
    style: {
      height: containerHeight,
      overflow: 'auto',
      position: 'relative' as const,
    },
  };

  return {
    virtualItems,
    totalHeight: items.length * itemHeight,
    scrollElementProps,
  };
}

/**
 * Hook simplificado para listas que só precisam de otimização básica
 * Usa intersection observer para lazy loading
 */
export function useLazyList<T>(
  items: T[],
  threshold = 50 // Quantos itens renderizar inicialmente
): {
  visibleItems: T[];
  hasMore: boolean;
  loadMore: () => void;
} {
  const [visibleCount, setVisibleCount] = useState(Math.min(threshold, items.length));

  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);

  const hasMore = visibleCount < items.length;

  const loadMore = () => {
    setVisibleCount(prev => 
      Math.min(prev + threshold, items.length)
    );
  };

  // Auto-reset quando items mudam drasticamente
  useEffect(() => {
    if (items.length < visibleCount) {
      setVisibleCount(Math.min(threshold, items.length));
    }
  }, [items.length, threshold, visibleCount]);

  return {
    visibleItems,
    hasMore,
    loadMore,
  };
}