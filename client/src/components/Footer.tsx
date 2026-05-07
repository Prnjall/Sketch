import React from 'react';
import { Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-[#222] py-6 px-6">
      <div className="container mx-auto flex items-center justify-between max-w-6xl">
        {/* Left: Name */}
        <div className="text-[#e8e8e8] font-medium tracking-widest text-sm uppercase">
          Pranjal
        </div>

        {/* Center: Year */}
        <div className="text-[#888] text-xs absolute left-1/2 -translate-x-1/2">
          &copy; 2026
        </div>

        {/* Right: Instagram Icon */}
        <a
          href="https://www.instagram.com/prnjaal?igsh=NGxkOWN3bnp6NDVx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#888] hover:text-[#e8e8e8] transition-colors duration-300 flex items-center"
          aria-label="Instagram Profile"
        >
          <Instagram size={18} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
