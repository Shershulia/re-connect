'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useOctopusStore } from '@/lib/store';
import { OctopusBody } from './OctopusBody';
import { Tentacle } from './Tentacle';

export function Octopus() {
  const nicknames = useOctopusStore((state) => state.nicknames);

  // Generate evenly distributed positions for each tentacle around the octopus
  const activeTentacles = useMemo(() => {
    return nicknames.map((nickname, index) => {
      // Distribute tentacles evenly around the octopus
      const angleStep = 360 / nicknames.length; // Полный круг (360 градусов)
      const baseAngle = index * angleStep;
      const randomOffset = (Math.random() - 0.5) * 30; // ±15 градусов случайности
      const angle = baseAngle + randomOffset;
      
      // Vary the length slightly for more natural look
      const baseLength = 3000; // Оптимальная длина для гифки
      const lengthVariation = 300; // Вариация длины
      const length = baseLength + (index % 2 === 0 ? lengthVariation : -lengthVariation);
      
      return {
        angle,
        length,
        nickname,
        key: `${nickname}-${index}` // Unique key for each tentacle
      };
    });
  }, [nicknames]);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Космический контейнер с обводкой */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Обводка */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-blue-900 shadow-2xl"
          style={{
            width: '1000px',
            height: '1000px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 40px rgba(30, 58, 138, 0.8), inset 0 0 40px rgba(30, 58, 138, 0.3)'
          }}
        />
        
        {/* Внутренний контейнер для космического фона */}
        <div 
          className="absolute rounded-full overflow-hidden"
          style={{
            width: '992px', // 1000 - 8px для обводки
            height: '992px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundImage: 'url(/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <motion.svg
          width="1200"
          height="1000"
          viewBox="0 0 1200 1000"
          className="max-w-full max-h-full relative z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
        <defs>
          <radialGradient id="bodyGradient" cx="0.3" cy="0.3">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="60%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </radialGradient>
          <filter id="dropShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
          </filter>
          <filter id="tentacleShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.2"/>
          </filter>
        </defs>



        {/* Tentacles */}
        {activeTentacles.map((tentacle, index) => (
          <Tentacle
            key={tentacle.key}
            index={index}
            angle={tentacle.angle}
            length={tentacle.length}
            nickname={tentacle.nickname}
            centerX={600}
            centerY={500}
            />
          ))}
          {/* Body */}
          <OctopusBody centerX={600} centerY={500} />
        </motion.svg>
      </motion.div>
    </div>
  );
}