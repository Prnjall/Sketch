'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="relative w-full py-20 md:py-32"
      style={{ background: 'rgba(0,0,0,0.60)', contain: 'paint' }}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            ABOUT
          </h2>
          <div className="h-1 w-24 bg-white/50 mb-12" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Left side - Number */}
          <motion.div
            className="flex items-center justify-center md:justify-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="text-9xl md:text-8xl font-bold text-white/10">02</div>
          </motion.div>

          {/* Right side - Bio */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              I'm Pranjal, pursuing Computer Science Engineering with a specialization in AI & Data Science. Along with that, I also sketch, just as a hobby.
            </p>

            <p className="text-lg text-white/80 leading-relaxed mb-12">
              I draw randomly depending on my mood. These sketches are simple and unplanned, reflecting whatever I feel in the moment.
            </p>

            {/* Contact */}
            <motion.div
              className="pt-8 border-t border-white/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <p className="text-white/60 text-sm mb-4">Get in touch:</p>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:pranjalpatil1405@gmail.com"
                  className="text-white hover:text-white/70 transition-colors mb-4 block"
                >
                  pranjalpatil1405@gmail.com
                </a>
                <a
                  href="https://www.instagram.com/prnjaal?igsh=NGxkOWN3bnp6NDVx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-fit px-[1.2rem] py-[0.5rem] rounded-[0.4rem] border border-[#333] bg-transparent text-[#e8e8e8] font-['Space_Grotesk'] hover:border-[#e8e8e8] hover:bg-white/5 transition-all duration-300"
                >
                  <Instagram size={18} />
                  <span>Instagram</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
