import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight, Megaphone, AlertTriangle, ShieldCheck, CheckSquare, Sparkles } from "lucide-react";
import { subscribeToCollection } from "../../utils/firebaseSync";

interface Banner {
  id: string;
  styleVisualPreset: "promo" | "info" | "warning" | "success";
  emplacementBaniere: "above_navbar" | "above_footer";
  targetAudience: "Tous" | "Étudiant" | "Client" | "Admin";
  contenuMessage: string;
  texteCta?: string;
  urlRedirection?: string;
  isActive: boolean;
  createdAt: string;
}

interface BannerRendererProps {
  position: "above_navbar" | "above_footer";
}

export const BannerRenderer: React.FC<BannerRendererProps> = ({ position }) => {
  const [activeBanners, setActiveBanners] = useState<Banner[]>([]);
  const [dismissedBannerIds, setDismissedBannerIds] = useState<string[]>([]);
  
  useEffect(() => {
    // 1. Fetch current user role safely
    let userRole = "Tous";
    const storedUser = localStorage.getItem("haitiandev_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        userRole = parsed.role || "Tous";
      } catch (e) {
        userRole = "Tous";
      }
    }

    // 2. Subscribe to firestore
    const unsubscribe = subscribeToCollection<Banner>("haitian_dev_banners", "haitian_dev_banners", (data) => {
      const filtered = data.filter((b) => {
        if (!b.isActive) return false;
        if (b.emplacementBaniere !== position) return false;
        
        // Target Audience matching
        if (b.targetAudience === "Tous") return true;
        return b.targetAudience === userRole;
      });
      setActiveBanners(filtered);
    }, []);

    return unsubscribe;
  }, [position]);

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDismissedBannerIds((prev) => [...prev, id]);
  };

  const visibleBanners = activeBanners.filter((b) => !dismissedBannerIds.includes(b.id));

  if (visibleBanners.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-1 z-40 relative">
      {visibleBanners.map((b) => {
        // Choose appropriate styles based on the type
        let styleClasses = "";
        let icon = <Megaphone className="w-4 h-4 text-white shrink-0" />;

        switch (b.styleVisualPreset) {
          case "promo":
            styleClasses = "bg-gradient-to-r from-[#00209F] via-indigo-950 to-[#D21034] text-white border-b border-indigo-900/60";
            icon = <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow shrink-0" />;
            break;
          case "warning":
            styleClasses = "bg-amber-950/95 text-amber-200 border-b border-amber-900/60";
            icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
            break;
          case "success":
            styleClasses = "bg-emerald-955/95 bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-100 border-b border-emerald-900/60";
            icon = <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />;
            break;
          case "info":
          default:
            styleClasses = "bg-blue-950 text-blue-100 border-b border-blue-900/60";
            icon = <Megaphone className="w-4 h-4 text-blue-400 shrink-0" />;
            break;
        }

        return (
          <div
            id={`banner-el-${b.id}`}
            key={b.id}
            className={`${styleClasses} w-full transition-all duration-300 py-3 px-4 sm:px-6 relative flex flex-col sm:flex-row items-center justify-center text-center gap-3`}
          >
            {/* Left Decor / Decorative line on left */}
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-white/95 uppercase leading-relaxed max-w-full sm:max-w-none break-words">
                {b.contenuMessage}
              </span>
            </div>

            {/* Interaction Button CTA */}
            {b.texteCta && b.urlRedirection && (
              <div className="shrink-0 flex items-center">
                {b.urlRedirection.startsWith("/") ? (
                  <Link
                    to={b.urlRedirection}
                    className="flex items-center gap-1.5 bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95 transition-all px-3 py-1 text-[10px] font-mono font-extrabold rounded-lg uppercase tracking-wider"
                  >
                    <span>{b.texteCta}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <a
                    href={b.urlRedirection}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95 transition-all px-3 py-1 text-[10px] font-mono font-extrabold rounded-lg uppercase tracking-wider"
                  >
                    <span>{b.texteCta}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Dismiss Cross */}
            <button
              onClick={(e) => handleDismiss(b.id, e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              title="Fermer cette annonce"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
