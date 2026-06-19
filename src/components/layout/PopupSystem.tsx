import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Megaphone, Info, AlertTriangle, CheckSquare, ArrowRight, Shield, User, MessageSquare, Mail } from "lucide-react";
import { loadCollection, subscribeToCollection, saveCollectionItem } from "../../utils/firebaseSync";

export interface PopupConfig {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "promo" | "success";
  targetAudience: "Tous" | "Étudiant" | "Client" | "Admin";
  delaySeconds: number;
  isActive: boolean;
  buttonText?: string;
  buttonUrl?: string;
  createdAt: string;
  views?: number;
  clicks?: number;
}

const defaultPopups: PopupConfig[] = [
  {
    id: "pop_welcome",
    title: "🚀 L'Ingénierie Logicielle d'Élite en Haïti",
    content: "Bienvenue sur HaitianDev ! Explorez nos solutions d'automatisation IA, d'applications mobiles performantes et de plateformes web sur mesure pour concrétiser vos visions technologiques les plus ambitieuses.",
    type: "info",
    targetAudience: "Tous",
    delaySeconds: 2,
    isActive: true,
    buttonText: "Configurateur de Devis",
    buttonUrl: "/services",
    createdAt: "2026-06-08",
    views: 142,
    clicks: 45
  },
  {
    id: "pop_student_promo",
    title: "🎓 Bourse Spéciale d'Études Révolution IA",
    content: "Avis à tous nos étudiants ! Déverrouillez un accès d'élite gratuit à nos ateliers immersifs de génie logiciel et bénéficiez d'un accompagnement direct par des mentors de l'industrie pour lancer votre carrière internationale.",
    type: "promo",
    targetAudience: "Étudiant",
    delaySeconds: 1,
    isActive: true,
    buttonText: "S'inscrire aux Formations",
    buttonUrl: "/training",
    createdAt: "2026-06-08",
    views: 89,
    clicks: 34
  },
  {
    id: "pop_client_offer",
    title: "💼 Audit Technique Gratuit (Limité)",
    content: "Optimisez vos infrastructures logicielles dès aujourd'hui. Bénéficiez d'un audit complet gratuit de vos systèmes de bases de données, sécurité cloud et pipelines de livraison continue par nos architectes principaux.",
    type: "success",
    targetAudience: "Client",
    delaySeconds: 3,
    isActive: true,
    buttonText: "Demander mon Audit",
    buttonUrl: "/services/ai-automation",
    createdAt: "2026-06-08",
    views: 65,
    clicks: 18
  }
];

export const PopupSystem: React.FC = () => {
  const [popups, setPopups] = useState<PopupConfig[]>([]);
  const [activePopup, setActivePopup] = useState<PopupConfig | null>(null);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const { pathname } = useLocation();

  // Load user session
  const [userSession, setUserSession] = useState<{ name: string; email: string; role: string; company?: string } | null>(null);
  const [supportMessages, setSupportMessages] = useState<any[]>([]);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  useEffect(() => {
    const initLoad = async () => {
      // Load popups with Firestore logic
      const currentPopups = await loadCollection<PopupConfig>(
        "haitian_dev_popups",
        "haitian_dev_popups",
        defaultPopups
      );
      setPopups(currentPopups);

      // Load active simulated user session
      const storedUser = localStorage.getItem("haitiandev_user");
      if (storedUser) {
        try {
          setUserSession(JSON.parse(storedUser));
        } catch (e) {
          setUserSession(null);
        }
      } else {
        setUserSession(null);
      }

      // Load admin messages
      const rawMsgs = localStorage.getItem("haitiandev_support_messages");
      if (rawMsgs) {
        try {
          setSupportMessages(JSON.parse(rawMsgs));
        } catch (e) {
          setSupportMessages([]);
        }
      }
    };

    initLoad();

    // Subscribe to popups for real-time deactivation/activation
    const unsubscribePopups = subscribeToCollection<PopupConfig>(
      "haitian_dev_popups",
      "haitian_dev_popups",
      (data) => setPopups(data),
      defaultPopups
    );

    // Listen to local triggers
    const handleLocalUpdate = () => {
      const storedUser = localStorage.getItem("haitiandev_user");
      if (storedUser) {
        try {
          setUserSession(JSON.parse(storedUser));
        } catch (e) {
          setUserSession(null);
        }
      } else {
        setUserSession(null);
      }

      const rawMsgs = localStorage.getItem("haitiandev_support_messages");
      if (rawMsgs) {
        try {
          setSupportMessages(JSON.parse(rawMsgs));
        } catch (e) {
          setSupportMessages([]);
        }
      }
    };

    window.addEventListener("storage", handleLocalUpdate);
    window.addEventListener("haitian_popups_updated", handleLocalUpdate);
    window.addEventListener("haitian_messages_updated", handleLocalUpdate);
    
    return () => {
      unsubscribePopups();
      window.removeEventListener("storage", handleLocalUpdate);
      window.removeEventListener("haitian_popups_updated", handleLocalUpdate);
      window.removeEventListener("haitian_messages_updated", handleLocalUpdate);
    };
  }, []);

  // Reset active popup on path change to avoid stacking issues across views
  useEffect(() => {
    setActivePopup(null);
  }, [pathname]);

  // Handle active popup trigger delays depending on conditions
  useEffect(() => {
    if (popups.length === 0) return;
    if (activePopup) return; // If a popup is already active, don't schedule or reset anything

    // Filter available active popups targeting current user role
    const currentRole = userSession?.role || "Tous";
    
    const targetablePopups = popups.filter(popup => {
      if (!popup.isActive) return false;
      if (dismissedIds.includes(popup.id)) return false;

      // Targeting conditions:
      // "Tous" matches everybody
      // Other roles match exact role string or if the current role matches target audience
      if (popup.targetAudience === "Tous") return true;
      return popup.targetAudience === currentRole;
    });

    if (targetablePopups.length === 0) return;

    // Trigger first targetable popup after its configured delay
    const popupToTrigger = targetablePopups[0];
    const timer = setTimeout(() => {
      setActivePopup(popupToTrigger);

      // Increment simulated View Count inside the storage for cool feedback!
      const updatedItem = { ...popupToTrigger, views: (popupToTrigger.views || 0) + 1 };
      saveCollectionItem("haitian_dev_popups", "haitian_dev_popups", updatedItem, popups).then(updated => {
        setPopups(updated);
      });
      // Remove window.dispatchEvent to avoid recursive update triggers that cause blinking
    }, (popupToTrigger.delaySeconds || 1) * 1000);

    return () => clearTimeout(timer);
  }, [popups, userSession, dismissedIds, activePopup, pathname]);

  const handleClose = () => {
    if (activePopup) {
      setDismissedIds([...dismissedIds, activePopup.id]);
      setActivePopup(null);
    }
  };

  const handleActionClick = () => {
    if (activePopup) {
      // Increment simulated Click Count inside storage
      const updatedItem = { ...activePopup, clicks: (activePopup.clicks || 0) + 1 };
      saveCollectionItem("haitian_dev_popups", "haitian_dev_popups", updatedItem, popups).then(updated => {
        setPopups(updated);
      });
      
      setDismissedIds([...dismissedIds, activePopup.id]);
      setActivePopup(null);
    }
  };

  // Helper values for icon & color accents
  const getThemeClass = (type: PopupConfig["type"]) => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          accent: "from-amber-600/20 to-amber-900/10 border-amber-500/50",
          button: "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/10",
          accentColor: "text-amber-400"
        };
      case "promo":
        return {
          icon: <Megaphone className="w-6 h-6 text-red-500" />,
          accent: "from-red-600/20 to-red-900/10 border-red-500/50",
          button: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/10",
          accentColor: "text-red-400"
        };
      case "success":
        return {
          icon: <CheckSquare className="w-6 h-6 text-emerald-400" />,
          accent: "from-emerald-600/20 to-emerald-900/10 border-emerald-500/50",
          button: "bg-emerald-500 hover:bg-emerald-600 text-black shadow-emerald-500/10",
          accentColor: "text-emerald-400"
        };
      default:
        return {
          icon: <Info className="w-6 h-6 text-blue-400" />,
          accent: "from-blue-600/20 to-blue-900/10 border-blue-500/50",
          button: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10",
          accentColor: "text-blue-400"
        };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("haitiandev_user");
    setUserSession(null);
    window.dispatchEvent(new Event("haitian_popups_updated"));
  };

  // Filter messages specifically for the logged-in user
  const recipientMessages = supportMessages.filter((m) => {
    if (!userSession) return false;
    const emailMatch = m.recipientEmail && m.recipientEmail.toLowerCase().trim() === (userSession.email || "").toLowerCase().trim();
    const roleMatch = m.recipientRole && m.recipientRole.toLowerCase().trim() === (userSession.role || "").toLowerCase().trim();
    
    // Admins don't need notifications here since they are sending
    if (userSession.role === "Admin") return false;
    
    return emailMatch || roleMatch;
  });

  return (
    <>
      {/* Actual popup modal */}
      <AnimatePresence>
        {activePopup && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`w-full max-w-md bg-gradient-to-b ${getThemeClass(activePopup.type).accent} bg-zinc-950/98 border rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-black/80`}
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-950/60 border border-zinc-900 text-zinc-400 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                {/* Accent Icon Tag */}
                <div className="flex items-center space-x-3 pb-1 border-b border-white/5">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    {getThemeClass(activePopup.type).icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-500">
                      INFO PLATFORME
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-red-400 font-bold uppercase tracking-wider">
                        🎯 {activePopup.targetAudience}
                      </span>
                      {activePopup.delaySeconds > 0 && (
                        <span className="text-[9px] font-mono text-zinc-500 leading-none">
                          Delai: {activePopup.delaySeconds}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content text */}
                <div className="space-y-2">
                  <h3 className="text-lg font-display font-extrabold text-white tracking-tight">
                    {activePopup.title}
                  </h3>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans">
                    {activePopup.content}
                  </p>
                </div>

                {/* CTA Action button */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {activePopup.buttonText && activePopup.buttonUrl ? (
                    <a
                      href={activePopup.buttonUrl}
                      onClick={handleActionClick}
                      className={`flex-1 flex items-center justify-center space-x-1.5 py-3 px-5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${getThemeClass(activePopup.type).button} hover:scale-[1.02] active:scale-[0.98] duration-200 outline-none`}
                    >
                      <span>{activePopup.buttonText}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </a>
                  ) : null}
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-850 hover:border-zinc-800 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer duration-200 active:scale-95"
                  >
                    Fermer l'alerte
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Member Messages Panel Button */}
      {userSession && userSession.role !== "Admin" && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setIsInboxOpen(true)}
            className="relative flex items-center bg-gradient-to-r from-red-650 to-blue-650 hover:brightness-110 active:scale-95 transition-all p-3 sm:p-4 rounded-full text-white shadow-lg shadow-red-500/15 border border-white/20 cursor-pointer animate-pulse hover:animate-none group"
            title="Mon Espace Courrier HaitianDev"
          >
            <MessageSquare className="w-5 h-5 text-white animate-none" />
            
            {recipientMessages.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-[10px] font-mono leading-none rounded-full px-1.5 py-1 text-white font-extrabold border border-zinc-950 animate-bounce">
                {recipientMessages.length}
              </span>
            )}
            
            <span className="max-w-0 group-hover:max-w-[150px] overflow-hidden transition-all duration-500 ease-in-out pl-0 group-hover:pl-2 text-xs font-bold font-mono tracking-wide uppercase whitespace-nowrap">
              Espace Messages
            </span>
          </button>
        </div>
      )}

      {/* Received Messages Viewer Overlay */}
      {isInboxOpen && userSession && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[85vh] overflow-y-auto">
            
            {/* Close */}
            <button 
              onClick={() => setIsInboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 border-b border-zinc-900 pb-4">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#D21034] bg-red-950/15 px-2 py-1 rounded border border-red-500/10">
                Espace Personnel • {userSession.role}
              </span>
              <h3 className="text-xl font-display font-extrabold text-white mt-2">
                📬 Messagerie &amp; Directives Administrateur
              </h3>
              <p className="text-zinc-550 text-xs">
                Boîte de réception pour <strong className="text-zinc-350">{userSession.name}</strong> ({userSession.email})
              </p>
            </div>

            <div className="space-y-4">
              {recipientMessages.length === 0 ? (
                <div className="text-center p-12 bg-zinc-900/10 border border-zinc-900 rounded-2xl">
                  <Mail className="w-8 h-8 text-zinc-750 mx-auto mb-3" />
                  <p className="font-mono text-zinc-500 text-xs text-center leading-normal">
                    Aucun message de l'administration d'élite reçu à ce jour.
                  </p>
                  <p className="text-zinc-700 text-[10px] mt-1.5 italic leading-normal">
                    Lorsque l'administration HaitianDev S.A. vous notifiera d'une directive d'assistance, d'un parcours de formation d'élite, d'un suivi de devis ou d'une alerte urgente, votre bulletin sera archivé ici de façon confidentielle.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {recipientMessages.map((m) => {
                    const beautifulDate = new Date(m.timestamp).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    return (
                      <div key={m.id} className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/15 space-y-3">
                        <div className="flex justify-between items-center border-b border-zinc-900/40 pb-2">
                          <span className="text-[10px] text-zinc-400 font-mono">
                            De : <strong className="text-white">{m.senderName}</strong> (Admin)
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono">{beautifulDate}</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-zinc-200">Objet : {m.subject}</h4>
                          <p className="text-xs text-zinc-400 font-mono leading-relaxed whitespace-pre-line pl-3 border-l border-[#00209F]">
                            {m.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-emerald-500 pt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Unilatéral : Réponse impossible depuis cette interface (Copie envoyée à {userSession.email})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsInboxOpen(false)}
              className="w-full bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-850 py-3.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Fermer mon courrier
            </button>
          </div>
        </div>
      )}
    </>
  );
};
