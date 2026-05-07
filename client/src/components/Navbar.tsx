'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Hero', id: 'hero' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'About', id: 'about' },
  ];

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
    onNavigate?.(id);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="text-white font-bold text-xl tracking-widest"
          whileHover={{ scale: 1.05 }}
        >
          PRANJAL
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-white/70 hover:text-white transition-colors text-sm tracking-widest uppercase"
              whileHover={{ color: 'rgba(255, 255, 255, 1)' }}
            >
              {item.label}
            </motion.button>
          ))}
          <motion.a
            href="/admin"
            className="text-white/70 hover:text-white transition-colors text-sm tracking-widest uppercase"
            whileHover={{ color: 'rgba(255, 255, 255, 1)' }}
          >
            Admin
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-black/95 backdrop-blur-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-white/70 hover:text-white transition-colors text-sm tracking-widest uppercase text-left"
              >
                {item.label}
              </button>
            ))}
            <a
              href="/admin"
              className="text-white/70 hover:text-white transition-colors text-sm tracking-widest uppercase"
            >
              Admin
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
