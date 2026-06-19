import React from "react";
import { Link } from "react-router-dom";
import { Compass, Target, Layers, Code, Rocket, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { PROCESS_DATA } from "../../data/staticData";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";
import { AnimatedGlassCard } from "../ui/AnimatedGlassCard";

export const ProcessSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const iconMap: { [key: string]: any } = {
    Compass: <Compass className="w-5 h-5 text-blue-400" />,
    Target: <Target className="w-5 h-5 text-red-500" />,
    Layers: <Layers className="w-5 h-5 text-yellow-400" />,
    Code: <Code className="w-5 h-5 text-purple-400" />,
    Rocket: <Rocket className="w-5 h-5 text-emerald-400" />,
    TrendingUp: <TrendingUp className="w-5 h-5 text-pink-400" />
  };

  // English details translation mapper
  const enDetails: { [key: string]: string[] } = {
    "01": [
      "Initial reply in under 24 business hours",
      "In-depth scoping and ideation sessions",
      "Attentive to your specific target business objectives",
      "Comprehensive competitive and system audits"
    ],
    "02": [
      "Selecting the optimal software architecture",
      "Professional database and indexing design",
      "Low-bandwidth smart specifications (Digicel/Natcom friendly)",
      "Accurate milestones and sprint schedules"
    ],
    "03": [
      "Pixel-perfect responsive Figma interactive mockups",
      "High fidelity clickable interactive user prototypes",
      "Comprehensive mobile usability testing",
      "Brand identity alignment validation"
    ],
    "04": [
      "Implementation in strict, expert TypeScript",
      "1 to 2-week active agile development sprints",
      "Automated code checks & pull request validations",
      "Regular demo sessions on production-like test server"
    ],
    "05": [
      "Thorough automated and manual security reviews",
      "SEO, FCP and LCP load speed fine-tuning",
      "Global CDN edge delivery for minimal latency in Haiti",
      "Tailored administrative workshop for your staff training"
    ],
    "06": [
      "7-day active technical system maintenance",
      "Analytical monitoring of terminal user patterns",
      "Proactive responsive performance and data improvements",
      "Incremental shipping of new requested feature contracts"
    ]
  };

  return (
    <section className="py-24 relative bg-transparent dot-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          overline={isEn ? "OUR CODE PROTOCOLS" : t("process.overline")}
          title={isEn ? "ENGINEERING PROCESS" : t("process.title")}
          description={isEn 
            ? "From initial discovery phase to global launch, uncover our step-by-step rigorous methodology designed for excellence." 
            : "De l'idéation initiale au déploiement mondial, découvrez le jalon-circuit d'étapes rigoureuses que nous suivons pour garantir l'excellence."}
          align="center"
        />

        {/* Timeline Layout */}
        <div className="relative mt-20 max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-[2px] bg-zinc-800/80 -translate-x-1/2 rounded-full overflow-hidden">
            {/* Animated Data Flow */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-60"
              animate={{ top: ['-50%', '150%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            />
          </div>

          <div className="space-y-4 md:space-y-0 relative z-10 w-full">
            {PROCESS_DATA.slice(0, 3).map((item, idx) => {
              const isEvenStep = idx % 2 !== 0; // index 1 -> step 02 (Even step)
              const nodeColor = isEvenStep ? '#c8102e' : '#002f6c'; // Red for even, Blue for odd.
              const pulseClass = isEvenStep ? 'bg-red-500/20' : 'bg-blue-500/20';
              const dotClass = isEvenStep ? 'bg-[#c8102e]' : 'bg-[#002f6c]';

              const alignmentClasses = isEvenStep 
                ? 'md:ml-auto md:pl-16 md:pr-0' // Right side on desktop
                : 'md:mr-auto md:pr-16 md:pl-0'; // Left side on desktop

              // Translate title & description or fallback
              const i18nStepKey = parseInt(item.step).toString();
              const displayTitle = t(`process.steps.${i18nStepKey}.title`) || item.title;
              const displayDesc = t(`process.steps.${i18nStepKey}.desc`) || item.description;
              const displayDetails = isEn && enDetails[item.step] ? enDetails[item.step] : item.details;

              return (
                <div key={idx} className="relative flex flex-col md:flex-row w-full min-h-[200px]">
                  
                  {/* Node on central line */}
                  <div className="absolute left-[31px] md:left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                    {/* Pulse effect */}
                    <motion.div
                      animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className={`absolute w-12 h-12 rounded-full ${pulseClass}`}
                    />
                    <div 
                      className={`w-4 h-4 rounded-full ${dotClass} shadow-[0_0_15px_currentColor] border-2 border-slate-900 relative z-10`} 
                      style={{ color: nodeColor }} 
                    />
                  </div>

                  {/* Card Container */}
                  <div className={`w-full md:w-1/2 flex flex-col pl-[80px] pr-4 py-8 md:py-12 ${alignmentClasses}`}>
                    <motion.div 
                      initial={{ opacity: 0, x: isEvenStep ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="w-full h-full"
                    >
                      <AnimatedGlassCard className="p-6 md:p-8">
                        {/* Floating ID badge */}
                        <div className="absolute top-4 sm:top-6 right-4 sm:right-8 font-mono text-2xl sm:text-4xl font-extrabold text-white/5 mix-blend-overlay group-hover:text-blue-900/35 transition-colors">
                          {item.step}
                        </div>

                        {/* Icon and title */}
                        <div className="space-y-4 sm:space-y-6">
                          <div className={`p-2 sm:p-3 ${isEvenStep ? 'bg-red-500/10 border-red-500/20 group-hover:bg-red-500/20' : 'bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20'} border rounded-xl inline-block text-zinc-400 transition-all`}>
                            <div className="scale-75 sm:scale-100">
                              {iconMap[item.icon] || <Code className="w-5 h-5" />}
                            </div>
                          </div>

                          <div className="space-y-1 sm:space-y-2 relative z-10">
                            <h3 className={`font-display text-lg sm:text-xl font-bold text-white transition-colors ${isEvenStep ? 'group-hover:text-red-400' : 'group-hover:text-blue-400'}`}>
                              {displayTitle}
                            </h3>
                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                              {displayDesc}
                            </p>
                          </div>

                          {/* Bullets details */}
                          <ul className="space-y-2 border-t border-zinc-900/50 pt-4 relative z-10 flex-grow">
                            {displayDetails.slice(0, 3).map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-start space-x-2 text-[11px] sm:text-xs text-zinc-400">
                                <span className={`w-1.5 h-1.5 rounded-full ${isEvenStep ? 'bg-red-500' : 'bg-blue-500'} mt-1.5 shrink-0 shadow-[0_0_8px_currentColor]`} style={{ color: nodeColor }} />
                                <span className="font-sans leading-relaxed">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AnimatedGlassCard>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/process">
            <Button variant="outline" size="md" className="group">
              {isEn ? "View Complete Process Journey" : "Voir le circuit complet"}
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
