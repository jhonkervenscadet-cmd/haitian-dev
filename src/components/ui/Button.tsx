import React from "react";
import { motion } from "motion/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  animate = true,
  disabled,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-display rounded-xl font-medium transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-650 text-white shadow-lg shadow-blue-500/25 border border-white/10",
    secondary:
      "border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-900/60",
    outline:
      "border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white hover:bg-slate-900/60",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-900/30",
    link: "text-blue-400 hover:text-blue-300 underline underline-offset-4 bg-transparent p-0",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs tracking-wider",
    md: "px-5 py-2.5 text-sm tracking-wide",
    lg: "px-7 py-3.5 text-base tracking-wide font-semibold",
  };

  const compStyle = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;

  if (animate && !disabled) {
    return (
      <motion.button
        className={compStyle}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <button className={compStyle} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
