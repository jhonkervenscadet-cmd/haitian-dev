import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Smartphone,
  Sparkles,
  Gamepad2,
  Cpu,
  GraduationCap,
  Sparkle,
  Zap,
  ArrowRight,
  X
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";
import { AnimatedGlassCard } from "../ui/AnimatedGlassCard";

export const Features: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  useEffect(() => {
    if (selectedFeature !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedFeature]);

  const services = [
    {
      icon: <Globe className="w-8 h-8" stroke="url(#gradient-web)" />,
      title: t("data.services.web-design.title"),
      desc: t("data.services.web-design.description"),
      path: "/services/web-design"
    },
    {
      icon: <Smartphone className="w-8 h-8" stroke="url(#gradient-app)" />,
      title: t("data.services.app-dev.title"),
      desc: t("data.services.app-dev.description"),
      path: "/services/app-dev"
    },
    {
      icon: <Sparkles className="w-8 h-8" stroke="url(#gradient-ai)" />,
      title: t("data.services.ai-automation.title"),
      desc: t("data.services.ai-automation.description"),
      path: "/services/ai-automation"
    },
    {
      icon: <Gamepad2 className="w-8 h-8" stroke="url(#gradient-game)" />,
      title: t("data.services.game-dev.title"),
      desc: t("data.services.game-dev.description"),
      path: "/services/game-dev"
    }
  ];

  const values = [
    {
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      title: isEn ? "Innovation" : "Innovation",
      desc: isEn 
        ? "Always at the cutting edge — AI-first models, edge servers, immersive 3D layout." 
        : "Toujours à la pointe — IA, edge computing, design 3D.",
      fullDesc: isEn 
        ? "We integrate cutting-edge technologies like artificial intelligence, cloud computing, and immersive 3D designs to deliver solutions that are not just modern but ahead of their time. Our innovative approach ensures that every product we build is scalable, efficient, and ready for future challenges." 
        : "Nous intégrons des technologies de pointe comme l'intelligence artificielle, le cloud et les designs 3D immersifs pour fournir des solutions qui ne sont pas seulement modernes, mais en avance sur leur temps. Notre approche innovante garantit que chaque produit est évolutif, efficace et prêt pour l'avenir."
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-red-400" />,
      title: isEn ? "Education" : "Éducation",
      desc: isEn 
        ? "We train the next wave of elite Haitian technology developers and engineers." 
        : "Nous formons la prochaine génération de talents tech haïtiens.",
      fullDesc: isEn 
        ? "Beyond building software, our core mission is education. Through our specialized training programs, we empower young talents in Haiti and equip them with global-standard engineering skills. We bridge the gap between passion and professional excellence."
        : "Au-delà du développement logiciel, l'éducation est au cœur de notre mission. À travers nos programmes de formation spécialisés, nous formons de jeunes talents haïtiens aux standards d'ingénierie mondiaux. Nous créons un pont entre la passion et l'excellence professionnelle."
    },
    {
      icon: <Sparkle className="w-5 h-5 text-yellow-400" />,
      title: isEn ? "Quality" : "Qualité",
      desc: isEn 
        ? "Clean code architecture, pixel-perfect design assets, and peak response rates." 
        : "Code propre, design pixel-perfect, performance maximale.",
      fullDesc: isEn 
        ? "Quality is non-negotiable. We adhere to top-tier architecture paradigms, ensuring clean, maintainable code. Our designs are pixel-perfect, and our applications are fine-tuned for performance, ensuring the best possible experience for end-users."
        : "La qualité est non négociable. Nous adhérons aux meilleurs paradigmes d'architecture, garantissant un code propre et maintenable. Nos designs sont pixel-perfect et nos applications sont optimisées pour la performance afin d'offrir la meilleure expérience utilisateur."
    },
    {
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      title: isEn ? "Impact" : "Impact",
      desc: isEn 
        ? "Every project we deliver contributes directly to transforming Haiti's ecosystem." 
        : "Chaque projet contribue à transformer Haïti.",
      fullDesc: isEn 
        ? "We don't just write code; we aim to make a difference. Every piece of software or service we deploy has a direct goal of elevating Haiti's tech ecosystem, creating jobs, enabling digital transformation, and putting Haitian tech on the global map."
        : "Nous ne nous contentons pas d'écrire du code ; notre but est de faire la différence. Chaque projet vise directement à élever l'écosystème technologique d'Haïti, à créer des emplois, à faciliter la transformation numérique et à placer la tech haïtienne sur la carte mondiale."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Required for the gradient icon strokes */}
      <svg className="absolute pointer-events-none opacity-0 w-0 h-0" aria-hidden="true">
        <defs>
          {/* Web Design - Vibrant Cyan to Bright Blue */}
          <linearGradient id="gradient-web" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#06b6d4" offset="0%" />
            <stop stopColor="#2563eb" offset="100%" />
          </linearGradient>
          
          {/* Mobile App - Rose Pink to Electric Purple */}
          <linearGradient id="gradient-app" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#f43f5e" offset="0%" />
            <stop stopColor="#9333ea" offset="100%" />
          </linearGradient>
          
          {/* AI & Automation - Lime Green to Teal/Emerald */}
          <linearGradient id="gradient-ai" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#a3e635" offset="0%" />
            <stop stopColor="#059669" offset="100%" />
          </linearGradient>
          
          {/* Game Dev - Sunny Amber to Vivid Red */}
          <linearGradient id="gradient-game" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#f59e0b" offset="0%" />
            <stop stopColor="#dc2626" offset="100%" />
          </linearGradient>
        </defs>
      </svg>
      {/* Localized glows removed in favor of global Layout glow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section 1: Nos Services */}
        <div className="space-y-16">
          <SectionHeading
            overline={isEn ? "WHAT WE BUILD" : "CE QUE NOUS CONSTRUISONS"}
            title={t("navbar.services")}
            description={isEn 
              ? "Select one of our specialities to explore our custom solutions and power up your organization." 
              : "Sélectionnez une de nos expertises pour découvrir nos solutions sur mesure et propulser votre activité."}
            align="left"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 max-w-5xl mx-auto gap-3 sm:gap-6 lg:gap-8"
          >
            {services.map((svc, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
              >
                <div className="relative h-full">
                  <AnimatedGlassCard className="p-4 sm:p-8" showEnergyOutline={false}>
                    {/* Icon */}
                    <div className="relative z-10 mb-4 sm:mb-6 bg-white/5 p-3 sm:p-4 rounded-xl w-max border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/50">
                      <div className="w-6 h-6 sm:w-8 sm:h-8">
                        {svc.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 space-y-2 sm:space-y-3 flex-grow">
                      <h3 className="font-display text-sm sm:text-lg lg:text-xl font-bold text-white tracking-wide">
                        {svc.title}
                      </h3>
                      <p className="text-slate-400 text-[10px] sm:text-xs lg:text-sm leading-relaxed hidden sm:block">
                        {svc.desc}
                      </p>
                    </div>

                    {/* Action Link */}
                    <div className="relative z-10 mt-4 sm:mt-8 flex justify-start md:justify-center lg:justify-start">
                      <Link
                        to={svc.path}
                        className="inline-flex items-center justify-center px-3 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#002f6c]/20 to-[#c8102e]/20 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:from-[#002f6c]/40 hover:to-[#c8102e]/40 text-white text-[10px] sm:text-sm font-medium transition-all duration-300 w-full sm:w-max"
                      >
                        <span className="truncate">{t("navbar.engage_us")}</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </AnimatedGlassCard>
                  <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#002f6c] to-[#c8102e] z-35 rounded-r-3xl" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Section 2: Pourquoi Haitian Dev */}
        <div className="space-y-16 mt-32">
          <SectionHeading
            overline={isEn ? "OUR PHILOSOPHY" : "NOTRE PHILOSOPHIE"}
            title={isEn ? "Why Haitian Dev?" : "Pourquoi Haitian Dev"}
            description={isEn 
              ? "We bridge strict international technological systems and local social commitments." 
              : "Nous allions rigueur technique internationale et fort impact social local."}
            align="center"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            {values.map((val, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                onClick={() => setSelectedFeature(idx)}
                className="cursor-pointer"
              >
                <AnimatedGlassCard className="p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xl h-full flex flex-col hover:bg-white/5 transition-colors" hoverable={false}>
                  <div className="p-2 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative z-10 transition-transform group-hover:scale-110">
                    <div className="scale-75 sm:scale-100">
                      {val.icon}
                    </div>
                  </div>
                  <h3 className="font-display text-xs sm:text-base font-bold text-white relative z-10">{val.title}</h3>
                  <p className="text-zinc-400 text-[10px] sm:text-xs lg:text-sm leading-relaxed hidden sm:block relative z-10">{val.desc}</p>
                </AnimatedGlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* Feature Details Modal */}
      <AnimatePresence>
        {selectedFeature !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fancy Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-red-500" />
              
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      {values[selectedFeature].icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                      {values[selectedFeature].title}
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
                    {values[selectedFeature].desc}
                  </p>
                  <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                    {values[selectedFeature].fullDesc}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
