import React from 'react';
import { motion } from 'motion/react';
import { AnimatedGlassCard } from "../ui/AnimatedGlassCard";
import { useTranslation } from "react-i18next";
import { loadCollection, subscribeToCollection } from "../../utils/firebaseSync";

interface AppStats {
  id: string;
  fondateur: string;
  expert: string;
  projet: string;
  anne: string;
}

const DEFAULT_STATS_DOC: AppStats = {
  id: "main_stats",
  fondateur: "2",
  expert: "12",
  projet: "10+",
  anne: "1"
};

export const StatsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [stats, setStats] = React.useState<AppStats>(() => {
    const raw = localStorage.getItem("haitiandev_app_stats");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Failed to load local stats:", e);
      }
    }
    return DEFAULT_STATS_DOC;
  });

  React.useEffect(() => {
    // Initial fetch including potential Firebase Sync
    const initLoad = async () => {
      const data = await loadCollection<AppStats>("stats", "haitiandev_app_stats_local", [DEFAULT_STATS_DOC]);
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    };
    initLoad();

    // Live Firebase Subscription
    const unsubscribe = subscribeToCollection<AppStats>("stats", "haitiandev_app_stats_local", (data) => {
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    }, [DEFAULT_STATS_DOC]);

    // Regular local broadcast listener (for immediate reaction to Local Live edits)
    const handleUpdate = () => {
      const raw = localStorage.getItem("haitiandev_app_stats");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setStats(parsed);
        } catch (e) {
          console.error("Failed to parse updated stats:", e);
        }
      }
    };
    
    window.addEventListener("haitiandev_stats_updated", handleUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener("haitiandev_stats_updated", handleUpdate);
    };
  }, []);

  const statsList = [
    { value: stats.fondateur, label: isEn ? "FOUNDERS" : "FONDATEURS", delay: 0 },
    { value: stats.expert, label: isEn ? "EXPERTS" : "EXPERTS", delay: 0.1 },
    { value: stats.projet, label: isEn ? "PROJECTS" : "PROJETS", delay: 0.2 },
    { value: stats.anne, label: isEn ? "YEARS" : "AN", delay: 0.3 }
  ];

  return (
    <section className="relative bg-transparent py-8 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Relative container for the connecting line & grid */}
        <div className="relative">
          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
            {statsList.map((stat, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: stat.delay }}
                  viewport={{ once: true }}
                >
                  <AnimatedGlassCard className="px-3 py-8 sm:px-6 sm:py-12 items-center justify-center text-center">
                    <span className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 drop-shadow-[0_4px_14px_rgba(59,130,246,0.3)] mb-3 group-hover:scale-110 transition-transform duration-500 relative z-10">
                      {stat.value}
                    </span>
                    <span className="font-mono text-[10px] sm:text-sm md:text-base font-bold tracking-[0.2em] text-[#f5f5f5] uppercase relative z-10">
                      {stat.label}
                    </span>
                  </AnimatedGlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
