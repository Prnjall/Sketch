import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './Masonry.css';

export interface MasonryItem {
  id: string;
  img: string;
  url?: string;
  height: number;
  title?: string | null;
  date?: string;
}

interface MasonryProps {
  items: MasonryItem[];
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  onItemClick?: (item: MasonryItem, index: number) => void;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  onItemClick,
}) => {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Single IntersectionObserver for all items (much cheaper than one per item)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.id;
            if (id) setVisibleItems(prev => new Set(prev).add(id));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '200px' }
    );
    itemRefs.current.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="masonry-css-container">
      {items.map((item, index) => {
        const isVisible = visibleItems.has(item.id);
        return (
          <div
            key={item.id}
            ref={el => {
              if (el) itemRefs.current.set(item.id, el);
              else itemRefs.current.delete(item.id);
            }}
            data-id={item.id}
            className={`masonry-css-item${isVisible ? ' animate-in' : ''}`}
            style={{
              opacity: isVisible ? 1 : 0,
              filter: blurToFocus && !isVisible ? 'blur(8px)' : 'none',
              transform: 'scale(1)',
              transition: 'opacity 0.5s ease, filter 0.5s ease, transform 0.25s ease',
              willChange: 'opacity, filter',
            }}
            onClick={() => onItemClick?.(item, index)}
            onMouseEnter={e => {
              if (scaleOnHover) {
                (e.currentTarget as HTMLDivElement).style.transform = `scale(${hoverScale})`;
              }
            }}
            onMouseLeave={e => {
              if (scaleOnHover) {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
              }
            }}
          >
            <motion.img
              layoutId={`sketch-${item.id}`}
              className="masonry-item-img"
              src={item.img}
              alt={item.title || 'Sketch'}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;
