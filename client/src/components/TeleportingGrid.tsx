import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChaos } from '../context/ChaosContext';

interface TeleportingGridProps {
  children: React.ReactNode[];
  className?: string;
}

export const TeleportingGrid: React.FC<TeleportingGridProps> = ({ children, className = '' }) => {
  const [order, setOrder] = useState<number[]>(() => children.map((_, i) => i));
  const [lastTeleportTime, setLastTeleportTime] = useState<number>(Date.now());
  const { vowelFilter } = useChaos();
  const mouseVelocityRef = useRef<number>(0);

  // Shuffle widget order
  const shuffleOrder = () => {
    setOrder((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setLastTeleportTime(Date.now());
  };

  // 1. Teleport every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      shuffleOrder();
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // 2. Teleport upon erratic mouse movement (velocity threshold)
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastT = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(1, now - lastT);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      mouseVelocityRef.current = speed;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;

      // If user is flicking or panicking with mouse and hasn't teleported in 4 seconds
      if (speed > 2.8 && now - lastTeleportTime > 4000) {
        if (Math.random() > 0.6) {
          shuffleOrder();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [lastTeleportTime]);

  return (
    <div className="relative">
      {/* Teleport countdown badge */}
      <div className="flex justify-between items-center mb-2 px-1 text-[11px] font-mono text-yellow-400">
        <span className="flex items-center gap-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          {vowelFilter('GRID TELEMETRY ENTROPY: ACTIVE')}
        </span>
        <span className="text-gray-400">
          {vowelFilter('Next Widget Teleportation in')}: {Math.max(0, 12 - Math.floor((Date.now() - lastTeleportTime) / 1000))}s
        </span>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
        {order.map((childIndex) => (
          <motion.div
            key={childIndex}
            layout
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
            className="h-full"
          >
            {children[childIndex]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
