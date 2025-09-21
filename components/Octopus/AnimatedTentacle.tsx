'use client';

import { motion } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import { useState, useMemo } from 'react';
import { HeldItem } from './HeldItem';

interface AnimatedTentacleProps {
  index: number;
  angle: number;
  length: number;
  nickname?: string;
  centerX: number;
  centerY: number;
}

export function AnimatedTentacle({ index, angle, length, nickname, centerX, centerY }: AnimatedTentacleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx, my], velocity, cancel }) => {
      setIsDragging(down);
      
      // Constrain drag to viewport bounds
      const maxDrag = 150;
      const constrainedX = Math.max(-maxDrag, Math.min(maxDrag, mx));
      const constrainedY = Math.max(-maxDrag, Math.min(maxDrag, my));

      if (Math.abs(mx) > maxDrag || Math.abs(my) > maxDrag) {
        cancel();
      }

      // Update drag offset state
      setDragOffset({ x: constrainedX, y: constrainedY });

      api.start({
        x: down ? constrainedX : 0,
        y: down ? constrainedY : 0,
        config: down 
          ? { tension: 400, friction: 40 }
          : { tension: 120, friction: 14 }
      });
    },
    { filterTaps: true }
  );

  // Calculate the end position of the tentacle
  const endPosition = useMemo(() => {
    const angleRad = (angle * Math.PI) / 180;
    const endX = centerX + Math.cos(angleRad) * length;
    const endY = centerY + Math.sin(angleRad) * length;
    return { x: endX, y: endY };
  }, [angle, length, centerX, centerY]);

  // Calculate rotation for the tentacle image
  const rotation = useMemo(() => {
    return angle; // Use the angle directly for rotation
  }, [angle]);

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        ease: "easeOut"
      }}
    >
      {/* Animated tentacle image */}
      <motion.image
        href="/tentacle-animation.gif"
        x={centerX - length/2} // Center the image horizontally
        y={centerY - 25} // Center the image vertically
        width={length} // Use length as width
        height={50} // Fixed height
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ 
          duration: 1.2, 
          delay: index * 0.2 + 0.3,
          ease: "easeOut"
        }}
        style={{
          transformOrigin: `${centerX}px ${centerY}px`,
          transform: `rotate(${rotation}deg)`,
        }}
      />
      
      {/* Drag handle at tip */}
      <motion.circle
        cx={endPosition.x}
        cy={endPosition.y}
        r="12"
        fill="url(#bodyGradient)"
        className="cursor-grab active:cursor-grabbing"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.2 + 1.0,
          type: "spring",
          bounce: 0.6
        }}
        {...(bind() as any)}
      />

      {/* Held item */}
      {nickname && (
        <HeldItem
          nickname={nickname}
          x={endPosition.x}
          y={endPosition.y - 40}
        />
      )}
    </motion.g>
  );
}
