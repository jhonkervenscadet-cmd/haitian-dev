import React from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  className?: string;
  variant?: "glass" | "solid" | "glow-blue" | "glow-red";
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "glass",
  hoverable = true,
  ...props
}) => {
  const baseStyle = "rounded-3xl border p-6 transition-all duration-300";
  
  const variants = {
    glass: "glass-panel border-slate-800/60 text-slate-100",
    solid: "bg-[#0B0D12] border-slate-800/60 text-slate-100",
    "glow-blue": "glass-panel border-red-500/10 hover:border-blue-500/20 shadow-[0_4px_25px_rgba(239,68,68,0.06)] text-slate-100",
    "glow-red": "glass-panel border-red-500/10 shadow-[0_4px_25px_rgba(239,68,68,0.04)] text-slate-100",
  };

  const hoverStyle = hoverable
    ? "hover:border-red-500/30 hover:shadow-[0_12px_30px_rgba(239,68,68,0.12)] cursor-default"
    : "";

  const finalStyle = `${baseStyle} ${variants[variant]} ${hoverStyle} ${className}`;

  if (hoverable) {
    return (
      <motion.div
        className={finalStyle}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={finalStyle}>
      {children}
    </div>
  );
};
