import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PopupSystem } from "./PopupSystem";
import { BannerRenderer } from "./BannerRenderer";
import { ChatBubble } from "./ChatBubble";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  const isDashboardPage = pathname === "/dashboard" || pathname === "/client-portal" || pathname === "/admin";

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] font-sans selection:bg-blue-500 selection:text-white relative overflow-x-clip text-white">
      {!isDashboardPage && (
        <div className="relative z-50 flex flex-col">
          <Navbar />
        </div>
      )}
      
      {/* Dynamic page transition */}
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-grow relative z-10"
      >
        {children}
      </motion.main>
      
      {!isDashboardPage && (
        <div className="relative z-10 flex flex-col">
          <BannerRenderer position="above_footer" />
          <Footer />
        </div>
      )}

      {/* Global popups rendering engine */}
      <PopupSystem />
      <ChatBubble />
    </div>
  );
};
