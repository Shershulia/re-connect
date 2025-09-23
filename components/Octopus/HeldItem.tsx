'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
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

  // SVG-safe unique clipPath id per nickname
  const clipId = useMemo(() => {
    return 'clip-' + btoa(unescape(encodeURIComponent(nickname))).replace(/=+/g, '');
  }, [nickname]);

  const size = 60;
  const half = size / 2;
  const radius = 14;

  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.6, delay: 1.8 }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={-half} y={-half} width={size} height={size} rx={radius} ry={radius} />
        </clipPath>
      </defs>

      {/* Border */}
      <rect x={-half - 2} y={-half - 2} width={size + 4} height={size + 4} rx={radius + 2} ry={radius + 2} fill="#7c3aed" opacity="0.9" />
      <rect x={-half} y={-half} width={size} height={size} rx={radius} ry={radius} fill="#111827" />

      {isLoading || !avatarUrl ? (
        <text x={0} y={8} textAnchor="middle" fontSize={24} fontWeight="bold" fill="#ffffff">
          {nickname.charAt(0).toUpperCase()}
        </text>
      ) : (
        <image
          href={avatarUrl}
          x={-half}
          y={-half}
          width={size}
          height={size}
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
          onError={() => setIsLoading(true)}
        />
      )}
    </motion.g>
  );
}