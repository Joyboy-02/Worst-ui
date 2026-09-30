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

  useEffect(() => {
    const timer = setInterval(() => {
      shuffleOrder();
    }, 12000);
    return () => clearInterval(timer);
  }, []);

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
      <div className="flex justify-between items-center mb-2 px-2 text-[11px] font-mono text-lichen-stone bg-forester-dark p-1.5 border border-bureau-green">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-subdued-fern"></span>
          {vowelFilter('FIELD DATA CABINET: ROTATIONAL DISPLACEMENT PROTOCOL ACTIVE')}
        </span>
        <span className="text-parchment-muted/80">
          {vowelFilter('Next Module Reorganization')}: {Math.max(0, 12 - Math.floor((Date.now() - lastTeleportTime) / 1000))}s
        </span>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {order.map((childIndex) => (
          <motion.div
            key={childIndex}
            layout
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 26,
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
