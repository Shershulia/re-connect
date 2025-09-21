'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HeldItem } from './HeldItem';

interface TentacleProps {
  index: number;
  angle: number;
  length: number;
  nickname?: string;
  centerX: number;
  centerY: number;
}

const TENTACLE_GIF_SRC = '/tentacle-animation.gif';
const GIF_HEIGHT = 200;
const END_PADDING = -40;

export function Tentacle({
  index,
  angle,
  length,
  nickname,
  centerX,
  centerY,
}: TentacleProps) {
  const segments = 10;

  // генерируем "кость" щупальца
  const generatePath = () => {
    const pts: Array<{ x: number; y: number }> = [];
    const baseAngleRad = (angle * Math.PI) / 180;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const segLen = (length / segments) * t;
      const wave = Math.sin(t * Math.PI * 2) * 10 * (1 - t);

      const px =
        centerX +
        Math.cos(baseAngleRad) * segLen +
        Math.cos(baseAngleRad + Math.PI / 2) * wave;
      const py =
        centerY +
        Math.sin(baseAngleRad) * segLen +
        Math.sin(baseAngleRad + Math.PI / 2) * wave;

      pts.push({ x: px, y: py });
    }
    return pts;
  };

  const points = useMemo(
    () => generatePath(),
    [angle, length, centerX, centerY]
  );

  const tip = points[points.length - 1] || { x: centerX, y: centerY };
  const pathData = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;

  // геометрия гиф-ленты
  const dx = tip.x - centerX;
  const dy = tip.y - centerY;
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const distance = Math.hypot(dx, dy);
  const widthAlong = Math.max(0, distance - END_PADDING);

  // === орбита аватара: две крайние точки по перпендикуляру к щупальцу ===
  const baseRad = Math.atan2(dy, dx);       // угол щупальца
  const perpRad = baseRad + Math.PI / 2;    // перпендикуляр к нему
  const orbitR = 24;                        // радиус орбиты вокруг tip
  const offsetX = Math.cos(perpRad) * orbitR;
  const offsetY = Math.sin(perpRad) * orbitR;

  // Движение по маленькой дуге окружности вокруг tip по часовой и обратно
  const arcRadius = 10;             // радиус дуги (несколько пикселей)
  const arcSpan = Math.PI / 4;     // размах дуги ~60°
  const steps = 24;                // детализация дуги
  const startPhi = perpRad - arcSpan / 2; // точка A
  const phiArray = Array.from({ length: steps }, (_, i) => startPhi + (arcSpan * i) / (steps - 1));
  const arcXs = phiArray.map((phi) => tip.x + arcRadius * Math.cos(phi));
  const arcYs = phiArray.map((phi) => tip.y + arcRadius * Math.sin(phi));
  const times = phiArray.map((_, i) => i / (steps - 1));
  return (
    <g>
      {/* гиф-лента */}
      <image
        href={TENTACLE_GIF_SRC}
        x={centerX}
        y={centerY - GIF_HEIGHT / 2}
        width={widthAlong}
        height={GIF_HEIGHT}
        preserveAspectRatio="none"
        className="tentacle-anim"
        style={{
          pointerEvents: 'none',
          ['--base-angle' as any]: `${angleDeg}deg`,
        }}
      />


      {/* === АВАТАР: синхронизирован с гифкой (5с туда, 5с обратно) === */}
      {nickname && (
        <motion.g
          initial={{ x: arcXs[0], y: arcYs[0] }}
          animate={{ x: arcXs, y: arcYs }}
          transition={{
            duration: 4,
            ease: 'linear',
            times,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 0.5,
          }}
        >
          {/* HeldItem центрируется относительно (0,0) */}
          <HeldItem nickname={nickname} x={0} y={0} />
          <text
            x={0}
            y={42}
            textAnchor="middle"
            fontSize={10}
            fontWeight="bold"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth={0.75}
            style={{ paintOrder: 'stroke fill' }}
          >
            {nickname}
          </text>
        </motion.g>
      )}
    </g>
  );
}
