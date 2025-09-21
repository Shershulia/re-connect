'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface OctopusBodyProps {
  centerX: number;
  centerY: number;
}

export function OctopusBody({ centerX, centerY }: OctopusBodyProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const talkInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsTalking(true);
        setTimeout(() => setIsTalking(false), 800);
      }
    }, 4000);

    return () => clearInterval(talkInterval);
  }, []);

  return (
    <motion.g
      animate={{
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Main body */}
      <motion.ellipse
        cx={centerX}
        cy={centerY}
        rx="80"
        ry="75"
        fill="url(#bodyGradient)"
        filter="url(#dropShadow)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      
      <motion.image
        href="/cap.png"
        x={centerX - 80}
        y={centerY - 120}
        width="160"
        height="80"
        initial={{ scale: 0, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />
      

      {/* Eyes */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {/* Left eye */}
        <ellipse
          cx={centerX - 35}
          cy={centerY - 15}
          rx="20"
          ry={isBlinking ? 2 : 25}
          fill="white"
          style={{ transition: 'ry 0.1s ease' }}
        />
        <ellipse
          cx={centerX - 30}
          cy={centerY - 15}
          rx="8"
          ry={isBlinking ? 1 : 12}
          fill="#1a1a1a"
          style={{ transition: 'ry 0.1s ease' }}
        />
        <ellipse
          cx={centerX - 27}
          cy={centerY - 20}
          rx="3"
          ry={isBlinking ? 0.5 : 4}
          fill="white"
          style={{ transition: 'ry 0.1s ease' }}
        />

        {/* Right eye */}
        <ellipse
          cx={centerX + 35}
          cy={centerY - 15}
          rx="20"
          ry={isBlinking ? 2 : 25}
          fill="white"
          style={{ transition: 'ry 0.1s ease' }}
        />
        <ellipse
          cx={centerX + 40}
          cy={centerY - 15}
          rx="8"
          ry={isBlinking ? 1 : 12}
          fill="#1a1a1a"
          style={{ transition: 'ry 0.1s ease' }}
        />
        <ellipse
          cx={centerX + 43}
          cy={centerY - 20}
          rx="3"
          ry={isBlinking ? 0.5 : 4}
          fill="white"
          style={{ transition: 'ry 0.1s ease' }}
        />
      </motion.g>

      {/* Purple mouth with red tongue */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        {/* Mouth outline */}
        <ellipse
          cx={centerX}
          cy={centerY + 15}
          rx="12"
          ry={isTalking ? 12 : 8}
          fill="#4a1a4a"
          stroke="#2d0f2d"
          strokeWidth="2"
          style={{ transition: 'ry 0.2s ease' }}
        />
        {/* Red tongue */}
        <ellipse
          cx={centerX}
          cy={centerY + 18}
          rx={isTalking ? 10 : 8}
          ry={isTalking ? 7 : 5}
          fill="#ff4444"
          style={{ transition: 'rx 0.2s ease, ry 0.2s ease' }}
        />
        {/* Tongue tip */}
        <ellipse
          cx={centerX}
          cy={centerY + (isTalking ? 22 : 20)}
          rx="4"
          ry="3"
          fill="#ff6666"
          style={{ transition: 'cy 0.2s ease' }}
        />
      </motion.g>
    </motion.g>
  );
}