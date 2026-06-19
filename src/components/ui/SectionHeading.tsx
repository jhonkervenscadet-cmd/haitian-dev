import React from 'react';
import { motion } from 'motion/react';

interface SectionHeadingProps {
  overline: string;
  title: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  description?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  overline, 
  title, 
  className = '',
  align = 'left',
  description
}) => {
  const alignClass = align === 'center' 
    ? 'text-center flex flex-col items-center' 
    : align === 'right' 
      ? 'text-right flex flex-col items-end' 
      : 'text-center md:text-left flex flex-col md:items-start items-center';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`space-y-4 mb-12 lg:mb-16 w-full ${alignClass} ${className}`}
    >
      <span className="font-mono text-xs font-bold text-gray-500 uppercase tracking-[0.25em] block">
        {overline}
      </span>
      <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)] tracking-wide leading-tight">
        {title}
      </h2>
      {description && (
        <p className={`text-zinc-500 text-sm max-w-lg mt-4 leading-relaxed font-sans ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-center md:text-left'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};
