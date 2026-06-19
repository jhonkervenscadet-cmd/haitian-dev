import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Code, Terminal, TerminalIcon, Cpu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div className="font-mono text-[#f5f5f5] text-lg sm:text-xl md:text-2xl min-h-[2rem]">
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block ml-1 font-bold font-mono"
      >
        |
      </motion.span>
    </div>
  );
};

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 bg-transparent">
      {/* Animated Cyberpunk Haitian Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Base Transparent Background (inherited from Layout) */}
        <div className="absolute inset-0 bg-transparent" />

        {/* Cyberpunk Techno Mesh Grid */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, #002f6c 1px, transparent 1px),
              linear-gradient(to bottom, #002f6c 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
            backgroundPosition: 'center center'
          }}
        />
        
        {/* Overlay gradient to fade the grid towards edges so it doesn't look harsh */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-transparent to-[#050508] opacity-80" />

        {/* Dynamic Data Flow Lines on the Grid */}
        <motion.div
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#002f6c] to-transparent shadow-[0_0_15px_#002f6c]"
          style={{ left: '20%' }}
          animate={{
            y: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#c8102e] to-transparent shadow-[0_0_15px_#c8102e]"
          style={{ left: '75%' }}
          animate={{
            y: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "linear",
            delay: 1.5
          }}
        />
        {/* Horizontal Data Lines */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#002f6c] to-transparent shadow-[0_0_15px_#002f6c]"
          style={{ top: '30%' }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c8102e] to-transparent shadow-[0_0_15px_#c8102e]"
          style={{ top: '65%' }}
          animate={{
            x: ['100%', '-100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
        />

        {/* Pulsing Neon Glows - Haitian Blue & Red */}
        {/* Top Left Blue Glow */}
        <motion.div 
          className="absolute w-[50vw] h-[50vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[100px] opacity-50 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, #002f6c 0%, transparent 70%)', top: '-10%', left: '-10%' }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Bottom Right Red Glow */}
        <motion.div 
          className="absolute w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] rounded-full blur-[120px] opacity-40 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, #c8102e 0%, transparent 70%)', bottom: '-15%', right: '-15%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
            >
              <span className="flex items-center gap-1.5 justify-center lg:justify-start">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-red-500" />
                {t("hero.tagline")}
              </span>
            </motion.div>

            {/* Display Title */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-6xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-4 text-left flex flex-wrap gap-x-4 items-center"
              >
                <span className="text-blue-500 uppercase drop-shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
                  HAITIAN
                </span>
                <span className="text-red-500 uppercase drop-shadow-[0_4px_16px_rgba(239,68,68,0.3)]">
                  D.E.V.
                </span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mb-6 flex justify-center lg:justify-start"
              >
                <TypewriterText text={t("hero.connecting")} />
              </motion.div>
            </div>

            {/* CTA Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4"
            >
              <Link 
                to="/signup" 
                className="group flex flex-row items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-bold rounded-full px-8 py-3.5 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] transition-all duration-300 w-full sm:w-auto"
              >
                <span>{t("hero.create_account")}</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </Link>
              <Link 
                to="/login" 
                className="text-[#94a3b8] hover:text-white hover:underline underline-offset-4 transition-all duration-300 text-base font-medium w-full sm:w-auto text-center"
              >
                {t("hero.login_to_account")}
              </Link>
            </motion.div>
          </div>

          {/* Hero Right Visuals: Beautiful floating brand logo on a soft ambient glow backdrop */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex items-center justify-center lg:justify-end">
            {/* Ambient glow underneath the floating logo */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-blue-600/15 to-red-600/15 blur-[90px] pointer-events-none animate-pulse" />
            
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                scale: [1, 1.02, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative z-10 w-[300px] sm:w-[450px] md:w-[550px] lg:w-[650px] xl:w-[750px] lg:mr-[-10%]"
            >
              <img 
                src="https://i.postimg.cc/xT9tmPsn/haitiandev-(1).png" 
                alt="Haitian D.E.V. Logo" 
                className="w-full h-auto object-contain mx-auto drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)] relative z-10"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
