import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { BannerRenderer } from "./BannerRenderer";
import { auth, db, isFirebaseEnabled } from "../../lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isMobileCompanyOpen, setIsMobileCompanyOpen] = useState(false);
  const [isEducationDropdownOpen, setIsEducationDropdownOpen] = useState(false);
  const [isMobileEducationOpen, setIsMobileEducationOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const location = useLocation();
  const { t, i18n } = useTranslation();

  const currentLang = (i18n.language || "fr").toUpperCase() === "EN" ? "EN" : "FR";

  const handleLanguageChange = (lang: "FR" | "EN") => {
    i18n.changeLanguage(lang.toLowerCase());
    localStorage.setItem("haitiandev_lang", lang);
  };

  useEffect(() => {
    if (isFirebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user && db) {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserProfile(docSnap.data());
            }
          } catch (err) {
            console.error("Error fetching user profile in navbar:", err);
          }
        } else {
          setUserProfile(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      localStorage.removeItem("haitiandev_user");
      window.location.reload();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsMobileCompanyOpen(false);
    setIsMobileEducationOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

  const navLinks = [
    { name: t("navbar.home"), path: "/" },
    { name: t("navbar.company"), path: "/about-us", isDropdown: true, type: "company" },
    { name: t("navbar.services"), path: "/services", isDropdown: true, type: "services" },
    { name: t("navbar.education"), path: "/training", isDropdown: true, type: "education" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full z-[100] flex flex-col transition-all duration-300 ${
        scrollY > 20 
          ? "bg-[#050508] lg:bg-[#050508]/80 lg:backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/10"
          : "bg-[#050508] lg:bg-transparent border-b border-white/5 lg:border-transparent"
      }`}
    >
      <BannerRenderer position="above_navbar" />
      <div className="py-4 px-6 lg:px-16 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 1. Logo (Left) */}
        <Link to="/" className="flex-shrink-0 flex items-center">
          <img
            src="https://i.postimg.cc/xT9tmPsn/haitiandev-(1).png"
            alt="Haitian D.E.V. Logo"
            className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* 2. Desktop Navigation Links (Center) */}
        <nav className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => {
            if (link.isDropdown) {
              if (link.type === "company") {
                const hasActiveSublink = 
                  location.pathname === "/portfolio" || 
                  location.pathname === "/process" || 
                  location.pathname === "/partners" || 
                  location.pathname === "/about-us";

                return (
                  <div 
                    key={link.name}
                    className="relative py-2"
                    onMouseEnter={() => setIsCompanyDropdownOpen(true)}
                    onMouseLeave={() => setIsCompanyDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                      className={`flex items-center space-x-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                        hasActiveSublink 
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 font-bold" 
                          : "text-slate-300 hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-red-500"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCompanyDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isCompanyDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-zinc-900 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="flex flex-col space-y-1">
                            {[
                              { label: t("navbar.portfolio"), path: "/portfolio" },
                              { label: t("navbar.processus"), path: "/process" },
                              { label: t("navbar.partners"), path: "/partners" },
                              { label: t("navbar.about"), path: "/about-us" }
                            ].map((subOption) => {
                              const isSubActive = location.pathname === subOption.path;
                              return (
                                <Link
                                  key={subOption.path}
                                  to={subOption.path}
                                  onClick={() => setIsCompanyDropdownOpen(false)}
                                  className={`px-4 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                                    isSubActive
                                      ? "text-white bg-gradient-to-r from-blue-950/40 to-red-950/40 border-l-2 border-red-500 font-extrabold"
                                      : "text-zinc-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
                                  }`}
                                >
                                  {subOption.label}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              } else if (link.type === "services") {
                const hasActiveSublink = location.pathname.startsWith("/services");

                return (
                  <div 
                    key={link.name}
                    className="relative py-2"
                    onMouseEnter={() => setIsServicesDropdownOpen(true)}
                    onMouseLeave={() => setIsServicesDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                      className={`flex items-center space-x-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                        hasActiveSublink 
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 font-bold" 
                          : "text-slate-300 hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-red-500"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isServicesDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isServicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-zinc-900 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="flex flex-col space-y-1">
                            {[
                              { label: currentLang === "EN" ? "Web Development" : "Développement Web", path: "/services/web-design" },
                              { label: currentLang === "EN" ? "Mobile Application" : "Application Mobile", path: "/services/app-dev" },
                              { label: currentLang === "EN" ? "AI Solutions" : "Solution IA", path: "/services/ai-automation" },
                              { label: currentLang === "EN" ? "Game Development" : "Jeu Vidéo", path: "/services/game-dev" },
                              { label: currentLang === "EN" ? "All Services" : "Tous nos services", path: "/services" }
                            ].map((subOption) => {
                              const isSubActive = location.pathname === subOption.path;
                              const isMainServices = subOption.path === "/services";
                              return (
                                <Link
                                  key={subOption.path}
                                  to={subOption.path}
                                  onClick={() => setIsServicesDropdownOpen(false)}
                                  className={`px-4 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                                    isSubActive
                                      ? "text-white bg-gradient-to-r from-blue-950/40 to-red-950/40 border-l-2 border-red-500 font-extrabold"
                                      : isMainServices
                                        ? "text-zinc-500 hover:text-white hover:bg-white/5 border-t border-zinc-900 mt-1 pt-3"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
                                  }`}
                                >
                                  {subOption.label}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              } else if (link.type === "education") {
                const hasActiveSublink = 
                  location.pathname === "/training" || 
                  location.pathname === "/blog" || 
                  location.pathname === "/docs";

                return (
                  <div 
                    key={link.name}
                    className="relative py-2"
                    onMouseEnter={() => setIsEducationDropdownOpen(true)}
                    onMouseLeave={() => setIsEducationDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setIsEducationDropdownOpen(!isEducationDropdownOpen)}
                      className={`flex items-center space-x-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                        hasActiveSublink 
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 font-bold" 
                          : "text-slate-300 hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-red-500"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isEducationDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isEducationDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-zinc-900 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="flex flex-col space-y-1">
                            {[
                              { label: t("navbar.training"), path: "/training" },
                              { label: t("navbar.blog"), path: "/blog" },
                              { label: t("navbar.docs"), path: "/docs" }
                            ].map((subOption) => {
                              const isSubActive = location.pathname === subOption.path;
                              return (
                                <Link
                                  key={subOption.path}
                                  to={subOption.path}
                                  onClick={() => setIsEducationDropdownOpen(false)}
                                  className={`px-4 py-2.5 rounded-xl text-left text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                                    isSubActive
                                      ? "text-white bg-gradient-to-r from-blue-950/40 to-red-950/40 border-l-2 border-red-500 font-extrabold"
                                      : "text-zinc-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
                                  }`}
                                >
                                  {subOption.label}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
            }

            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 font-bold" 
                      : "text-slate-300 hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-red-500"
                  }`
                }
              >
                {link.name}
              </NavLink>
            );
          })}
        </nav>
         {/* 3. Actions (Right) */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-900/60 p-1 rounded-full border border-slate-800">
                    <button
                      onClick={() => handleLanguageChange("FR")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        currentLang === "FR"
                          ? "bg-gradient-to-r from-blue-500 to-red-500 text-white shadow-sm shadow-blue-500/20"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      FR
                    </button>
                    <button
                      onClick={() => handleLanguageChange("EN")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        currentLang === "EN"
                          ? "bg-gradient-to-r from-blue-500 to-red-500 text-white shadow-sm shadow-red-500/20"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      EN
                    </button>
                  </div>

          {/* Action Button */}
          {currentUser ? (
            <div className="relative" onMouseEnter={() => setIsUserDropdownOpen(true)} onMouseLeave={() => setIsUserDropdownOpen(false)}>
              <button
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-red-500/20 border border-white/10 flex items-center justify-center text-blue-400 hover:text-white hover:border-blue-500/50 transition-all duration-300"
              >
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-zinc-900 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-zinc-900 mb-1">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{userProfile?.role || "Utilisateur"}</p>
                      <p className="text-xs font-bold text-white truncate">{userProfile?.fullName || currentUser.email}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Link
                        to={userProfile?.role === "Client" ? "/client-portal" : "/dashboard"}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{t("navbar.profile")}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-left w-full cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t("navbar.logout")}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}

          <Link
            to="/services"
            className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold text-sm rounded-full px-6 py-2.5 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] transition-all transform hover:-translate-y-0.5"
          >
            {t("navbar.engage_us")}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-md text-slate-300 hover:bg-slate-800 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full bg-black z-50 flex flex-col lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <img
                  src="https://i.postimg.cc/xT9tmPsn/haitiandev-(1).png"
                  alt="Haitian D.E.V. Logo"
                  className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-slate-300 hover:bg-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col space-y-6">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => {
                    if (link.isDropdown) {
                      if (link.type === "company") {
                        const hasActiveSublink = 
                          location.pathname === "/portfolio" || 
                          location.pathname === "/process" || 
                          location.pathname === "/partners" || 
                          location.pathname === "/about-us";

                        return (
                          <div key={link.name} className="flex flex-col space-y-2">
                            <button
                              onClick={() => setIsMobileCompanyOpen(!isMobileCompanyOpen)}
                              className={`flex items-center justify-between w-full text-lg font-medium transition-all duration-200 text-left cursor-pointer ${
                                hasActiveSublink 
                                  ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 font-bold" 
                                  : "text-slate-300"
                              }`}
                            >
                              <span>{link.name}</span>
                              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isMobileCompanyOpen ? "rotate-180" : ""}`} />
                            </button>
                            
                            <AnimatePresence>
                              {isMobileCompanyOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden pl-4 border-l border-zinc-800 flex flex-col space-y-3 pt-1 pb-2"
                                >
                                  {[
                                    { label: t("navbar.portfolio"), path: "/portfolio" },
                                    { label: t("navbar.processus"), path: "/process" },
                                    { label: t("navbar.partners"), path: "/partners" },
                                    { label: t("navbar.about"), path: "/about-us" }
                                  ].map((subOption) => {
                                    const isSubActive = location.pathname === subOption.path;
                                    return (
                                      <Link
                                        key={subOption.path}
                                        to={subOption.path}
                                        onClick={() => {
                                          setIsOpen(false);
                                          setIsMobileCompanyOpen(false);
                                        }}
                                        className={`text-base transition-all duration-200 uppercase tracking-wide font-mono ${
                                          isSubActive
                                            ? "text-red-500 font-bold"
                                            : "text-zinc-400 hover:text-white"
                                        }`}
                                      >
                                        {subOption.label}
                                      </Link>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      } else if (link.type === "services") {
                        const hasActiveSublink = location.pathname.startsWith("/services");

                        return (
                          <div key={link.name} className="flex flex-col space-y-2">
                            <button
                              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                              className={`flex items-center justify-between w-full text-lg font-medium transition-all duration-200 text-left cursor-pointer ${
                                hasActiveSublink 
                                  ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 font-bold" 
                                  : "text-slate-300"
                              }`}
                            >
                              <span>{link.name}</span>
                              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isMobileServicesOpen ? "rotate-180" : ""}`} />
                            </button>
                            
                            <AnimatePresence>
                              {isMobileServicesOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden pl-4 border-l border-zinc-800 flex flex-col space-y-3 pt-1 pb-2"
                                >
                                  {[
                                    { label: currentLang === "EN" ? "Web Development" : "Développement Web", path: "/services/web-design" },
                                    { label: currentLang === "EN" ? "Mobile Application" : "Application Mobile", path: "/services/app-dev" },
                                    { label: currentLang === "EN" ? "AI Solutions" : "Solution IA", path: "/services/ai-automation" },
                                    { label: currentLang === "EN" ? "Game Development" : "Jeu Vidéo", path: "/services/game-dev" },
                                    { label: currentLang === "EN" ? "All Services" : "Tous nos services", path: "/services" }
                                  ].map((subOption) => {
                                    const isSubActive = location.pathname === subOption.path;
                                    return (
                                      <Link
                                        key={subOption.path}
                                        to={subOption.path}
                                        onClick={() => {
                                          setIsOpen(false);
                                          setIsMobileServicesOpen(false);
                                        }}
                                        className={`text-base transition-all duration-200 uppercase tracking-wide font-mono ${
                                          isSubActive
                                            ? "text-red-500 font-bold"
                                            : "text-zinc-400 hover:text-white"
                                        }`}
                                      >
                                        {subOption.label}
                                      </Link>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      } else if (link.type === "education") {
                        const hasActiveSublink = 
                          location.pathname === "/training" || 
                          location.pathname === "/blog" || 
                          location.pathname === "/docs";

                        return (
                          <div key={link.name} className="flex flex-col space-y-2">
                            <button
                              onClick={() => setIsMobileEducationOpen(!isMobileEducationOpen)}
                              className={`flex items-center justify-between w-full text-lg font-medium transition-all duration-200 text-left cursor-pointer ${
                                hasActiveSublink 
                                  ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 font-bold" 
                                  : "text-slate-300"
                              }`}
                            >
                              <span>{link.name}</span>
                              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isMobileEducationOpen ? "rotate-180" : ""}`} />
                            </button>
                            
                            <AnimatePresence>
                              {isMobileEducationOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden pl-4 border-l border-zinc-800 flex flex-col space-y-3 pt-1 pb-2"
                                >
                                  {[
                                    { label: t("navbar.training"), path: "/training" },
                                    { label: t("navbar.blog"), path: "/blog" },
                                    { label: t("navbar.docs"), path: "/docs" }
                                  ].map((subOption) => {
                                    const isSubActive = location.pathname === subOption.path;
                                    return (
                                      <Link
                                        key={subOption.path}
                                        to={subOption.path}
                                        onClick={() => {
                                          setIsOpen(false);
                                          setIsMobileEducationOpen(false);
                                        }}
                                        className={`text-base transition-all duration-200 uppercase tracking-wide font-mono ${
                                          isSubActive
                                            ? "text-red-500 font-bold"
                                            : "text-zinc-400 hover:text-white"
                                        }`}
                                      >
                                        {subOption.label}
                                      </Link>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }
                    }

                    return (
                      <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                          `text-lg font-medium transition-all duration-200 ${
                            isActive 
                              ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 font-bold" 
                              : "text-slate-300 hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-red-500"
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    );
                  })}
                </div>                 <div className="mt-auto flex flex-col space-y-6 pt-6 border-t border-white/5">
                  <div className="flex items-center bg-slate-900/60 p-1 rounded-full w-max mx-auto border border-slate-800">
                    <button
                      onClick={() => handleLanguageChange("FR")}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                        currentLang === "FR"
                          ? "bg-gradient-to-r from-blue-500 to-red-500 text-white shadow-sm shadow-blue-500/20"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      FR
                    </button>
                    <button
                      onClick={() => handleLanguageChange("EN")}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                        currentLang === "EN"
                          ? "bg-gradient-to-r from-blue-500 to-red-500 text-white shadow-sm shadow-red-500/20"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      EN
                    </button>
                  </div>

                  <div className="flex flex-col space-y-3 pt-4 border-t border-white/5">
                    {currentUser ? (
                      <Link
                        to={userProfile?.role === "Client" ? "/client-portal" : "/dashboard"}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-white leading-none mb-1">{userProfile?.fullName || currentUser.email}</p>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">{userProfile?.role || "Utilisateur"}</p>
                          </div>
                        </div>
                        <LayoutDashboard className="w-5 h-5 text-zinc-500" />
                      </Link>
                    ) : null}
                  </div>

                  <Link
                    to="/services"
                    className="w-full text-center bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold text-sm rounded-full px-6 py-3 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-lg transition-all"
                  >
                    {t("navbar.engage_us")}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
};

