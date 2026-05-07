'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import About from '@/components/About';
import Footer from '@/components/Footer';

export default function Home() {
  const handleScrollGallery = () => {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="page-content">
        <Navbar />
        <Hero onScrollGallery={handleScrollGallery} />
        
        {/* Decorative Divider */}
        <div className="w-full flex items-center justify-center gap-4 py-12 my-12" style={{ opacity: 0.8 }}>
          <div className="h-[1px] w-[80px] bg-[#333]"></div>
          <div className="text-[#888] text-sm leading-none pt-[2px]">✦</div>
          <div className="h-[1px] w-[80px] bg-[#333]"></div>
        </div>

        <Gallery />
        <About />
        <Footer />
      </div>
    </div>
  );
}
