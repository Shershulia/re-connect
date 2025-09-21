'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SceneLayoutProps {
  children: ReactNode;
}

export function SceneLayout({ children }: SceneLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Caustic Light Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="caustic-light absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30" />
        <div className="caustic-light absolute top-3/4 right-1/4 w-64 h-64 rounded-full opacity-20" style={{ animationDelay: '-3s' }} />
        <div className="caustic-light absolute top-1/2 left-3/4 w-80 h-80 rounded-full opacity-25" style={{ animationDelay: '-6s' }} />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />

      {/* Content */}
      <motion.div
        className="relative z-10 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}