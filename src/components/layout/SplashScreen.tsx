import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const SplashScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
    >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 1, 
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.5 }
            }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="relative">
              {/* Outer spinning ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 border border-white/5 rounded-full"
              />
              
              <img
                src="https://i.postimg.cc/xT9tmPsn/haitiandev-(1).png"
                alt="Haitian D.E.V. Logo"
                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 flex flex-col items-center"
            >
              <h1 className="text-2xl md:text-3xl font-black tracking-[0.3em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                Haitian D.E.V.
              </h1>
              <div className="mt-2 h-0.5 w-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-full" />
            </motion.div>
          </motion.div>

          {/* Loading bar at the bottom */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full w-full bg-gradient-to-r from-blue-500 to-red-500"
            />
          </div>
      </motion.div>
  );
};
