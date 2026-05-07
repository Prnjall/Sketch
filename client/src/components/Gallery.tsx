'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useSketches } from '@/hooks/useSketches';
import Masonry, { MasonryItem } from './Masonry';

// Deterministic height based on sketch id so layout is stable across renders
const getHeight = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  const sizes = [300, 380, 450, 500, 550, 400, 600, 350, 480];
  return sizes[hash % sizes.length];
};

const Gallery: React.FC = () => {
  const { sketches, loading, hasMore, loadMore } = useSketches(20);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < sketches.length - 1)
      setSelectedIndex(selectedIndex + 1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedIndex === null) return;
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setSelectedIndex(null);
  };

  React.useEffect(() => {
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedIndex, sketches.length]);

  const masonryItems: MasonryItem[] = sketches.map((sketch, index) => ({
    id: sketch.id,
    img: sketch.public_url,
    height: getHeight(sketch.id),
    title: sketch.title,
    date: sketch.created_at,
  }));

  return (
    <section
      id="gallery"
      className="relative w-full py-20 md:py-32"
      style={{ background: 'rgba(0,0,0,0.55)' }}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            ALL SKETCHES
          </h2>
          <div className="h-1 w-24 bg-white/50 mb-2" />
          <p className="text-white/60 text-sm tracking-widest uppercase">
            {sketches.length} pieces
          </p>
        </motion.div>

        {/* Masonry Gallery */}
        {sketches.length > 0 ? (
          <Masonry
            items={masonryItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover
            hoverScale={0.95}
            blurToFocus
            colorShiftOnHover={false}
            onItemClick={(item, index) => setSelectedIndex(index)}
          />
        ) : loading ? (
          <p className="text-white/40 text-sm">Loading sketches...</p>
        ) : (
          <p className="text-white/40 text-sm">No sketches yet.</p>
        )}

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 border border-white/30 text-white hover:border-white/70 hover:text-white transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Loading...' : 'Load More'}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[10000] text-white/70 hover:text-white transition-colors p-2 bg-black/20 rounded-full"
              onClick={() => setSelectedIndex(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={28} />
            </motion.button>

            {/* Navigation Arrows */}
            {selectedIndex > 0 && (
              <motion.button
                className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 z-[10000] text-white/70 hover:text-white transition-colors p-2 bg-black/20 rounded-full"
                onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={36} />
              </motion.button>
            )}

            {selectedIndex < sketches.length - 1 && (
              <motion.button
                className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 z-[10000] text-white/70 hover:text-white transition-colors p-2 bg-black/20 rounded-full"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={36} />
              </motion.button>
            )}

            {/* Image */}
            <motion.img
              layoutId={`sketch-${sketches[selectedIndex].id}`}
              src={sketches[selectedIndex].public_url}
              alt={sketches[selectedIndex].title || 'Sketch'}
              className="max-w-[95vw] max-h-[75vh] md:max-w-[85vw] md:max-h-[85vh] object-contain shadow-2xl z-[10001] rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Info */}
            <motion.div
              className="absolute bottom-6 md:bottom-8 left-0 right-0 text-center text-white pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {sketches[selectedIndex].title && (
                <p className="font-semibold text-base md:text-lg">{sketches[selectedIndex].title}</p>
              )}
              <p className="text-white/60 text-xs md:text-sm mt-1">
                {new Date(sketches[selectedIndex].created_at).toLocaleDateString()}
              </p>
              <p className="text-white/40 text-xs mt-1 md:mt-2">
                {selectedIndex + 1} / {sketches.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
