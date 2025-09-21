'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getAvatarUrl } from '@/lib/avatar';

interface HeldItemProps {
  nickname: string;
  x: number;
  y: number;
}

export function HeldItem({ nickname, x, y }: HeldItemProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const url = await getAvatarUrl(nickname);
        setAvatarUrl(url);
      } catch (error) {
        console.error('Failed to load avatar:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvatar();
  }, [nickname]);

  // Generate a color based on the nickname
  const getColorFromNickname = (name: string) => {
    const colors = [
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600', 
      'from-indigo-400 to-indigo-600',
      'from-violet-400 to-violet-600',
      'from-fuchsia-400 to-fuchsia-600',
      'from-blue-400 to-blue-600',
      'from-cyan-400 to-cyan-600',
      'from-teal-400 to-teal-600'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <motion.foreignObject
      x={x - 35}
      y={y - 35}
      width="60"
      height="60"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.8, 
        type: "spring",
        bounce: 0.6,
        delay: 1.8
      }}
    >
      <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${getColorFromNickname(nickname)} p-1 shadow-lg`}>
        <div className="w-full h-full rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="text-white font-bold text-2xl drop-shadow-lg">
              {nickname.charAt(0).toUpperCase()}
            </div>
          ) : (
            <img 
              src={avatarUrl} 
              alt={`${nickname} avatar`}
              className="w-full h-full object-cover rounded-xl"
              onError={() => {
                // Fallback to initial if image fails to load
                setIsLoading(true);
              }}
            />
          )}
        </div>
      </div>
    </motion.foreignObject>
  );
}