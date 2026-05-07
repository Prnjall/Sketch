'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Stack from './Stack';
import { useSketches } from '@/hooks/useSketches';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onScrollGallery?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onScrollGallery }) => {
  const { sketches } = useSketches(5);

  const stackCards = sketches.slice(0, 5).map((sketch) => (
    <img
      key={sketch.id}
      src={sketch.public_url}
      alt={sketch.title || 'Sketch'}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '1rem',
      }}
    />
  ));

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100dvh' }}   /* dvh = dynamic viewport height, fixes mobile browser-chrome bounce */
    >
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* ── Mobile layout: column (text → cards)
           Desktop layout: row (text | cards side-by-side) ── */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 px-6 md:px-12 lg:px-16 pt-28 pb-20 lg:pt-0 lg:pb-0 lg:h-screen max-w-6xl mx-auto">

        {/* Text block */}
        <div className="flex flex-col justify-center w-full lg:w-[460px]">
          <motion.h1
            className="hero-title text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            PRANJAL
          </motion.h1>

          <motion.div
            className="mt-4 md:mt-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          >
            <div className="h-1 w-24 bg-white/50 mb-4" />
            <p className="hero-subtitle text-white/70">
              Sketches &amp; Doodles
            </p>
          </motion.div>

          <motion.p
            className="mt-6 md:mt-10 text-sm md:text-base text-white/60 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: 'easeOut' }}
          >
            Raw lines, honest art. A collection of hand-drawn sketches capturing moments in time.
          </motion.p>

          <motion.button
            onClick={onScrollGallery}
            className="mt-10 md:mt-14 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            whileHover={{ y: 4 }}
          >
            <span className="text-sm tracking-widest uppercase">View Work</span>
            <ChevronDown size={18} />
          </motion.button>
        </div>

        {/* ── Stack cards ──
            Visible on all screen sizes.
            Responsive sizes: small on mobile → larger on desktop. */}
        {stackCards.length > 0 && (
          <motion.div
            className="flex-shrink-0 flex items-center justify-center w-full lg:w-auto"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            {/* Size: 260px on mobile, 320px on md, 400px on lg, 480px on xl */}
            <div
              style={{
                width: 'clamp(240px, 60vw, 480px)',
                height: 'clamp(240px, 60vw, 480px)',
              }}
            >
              <Stack
                cards={stackCards}
                randomRotation
                sensitivity={180}
                sendToBackOnClick={true}
                autoplay={true}
                autoplayDelay={3500}
                pauseOnHover
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator — hidden on mobile to save space */}
      <motion.div
        className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={24} className="text-white/40" />
      </motion.div>
    </section>
  );
};

export default Hero;
