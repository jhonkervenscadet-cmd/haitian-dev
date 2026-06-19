import React from 'react';
import { motion } from 'motion/react';

interface AnimatedGlassCardProps {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  hoverable?: boolean;
  showEnergyOutline?: boolean;
}

export const AnimatedGlassCard: React.FC<AnimatedGlassCardProps> = ({ 
  children, 
  className = "", 
  wrapperClassName = "",
  hoverable = true,
  showEnergyOutline = true
}) => {
  return (
    <div 
      className={`relative group p-[2px] rounded-3xl overflow-hidden bg-slate-900/40 h-full flex ${wrapperClassName}`}
      style={{
        contain: 'paint',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Subtle border background gradient removed per user request */}
      
      {/* Individual Animated Energy Outline */}
      {showEnergyOutline && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] aspect-square z-0 pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg, transparent 75%, #002f6c 85%, #c8102e 100%)',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
          }}
        />
      )}
      
      {/* Inner Glassmorphism Card */}
      <div 
        className={`relative w-full z-10 bg-[#050508]/85 backdrop-blur-xl h-full rounded-[22px] flex flex-col overflow-hidden ${className}`}
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          pointerEvents: 'auto',
        }}
      >
        {/* Glowing background blob on hover - inside card removed per user request */}
        {hoverable && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        )}
        <div className="relative z-10 flex-grow flex flex-col h-full">
            {children}
        </div>
      </div>
    </div>
  );
};
