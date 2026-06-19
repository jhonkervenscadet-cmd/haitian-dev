import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Compass, Target, Layers, Code, Rocket, TrendingUp, CheckCircle, ArrowDown, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { PROCESS_DATA } from "../data/staticData";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";

export const ProcessPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [activeStep, setActiveStep] = useState<number>(0);

  const iconMap: { [key: string]: any } = {
    Compass: <Compass className="w-6 h-6 text-blue-400" />,
    Target: <Target className="w-6 h-6 text-red-500" />,
    Layers: <Layers className="w-6 h-6 text-yellow-400" />,
    Code: <Code className="w-6 h-6 text-purple-400" />,
    Rocket: <Rocket className="w-6 h-6 text-emerald-400" />,
    TrendingUp: <TrendingUp className="w-6 h-6 text-pink-400" />
  };

  const getTranslatedProcessStep = (item: any, idx: number) => {
    if (!isEn) return item;

    const englishSteps = [
      {
        title: "Exploration & Blueprint",
        description: "Defining constraints, targets, and technological requirements.",
        details: [
          "1-on-1 strategic workshops",
          "Technical constraints mapping",
          "Cost audit & viability planning",
          "Creation of interactive layout briefs"
        ]
      },
      {
        title: "UX Archetype Design",
        description: "Visual systems, fonts pairings, tracking & styling guidelines.",
        details: [
          "Interactive display typography rules",
          "Fidelity pixel-perfect grids",
          "High-contrast color selections",
          "Fluid motion animation pacing"
        ]
      },
      {
        title: "Core Mechanics Development",
        description: "Responsive engines, localized databases, offline synchronizations.",
        details: [
          "Server-side proxy API layers",
          "Secure local caching models",
          "3G performance optimizations",
          "Clean functional hook structures"
        ]
      },
      {
        title: "Dynamic Integrations",
        description: "Secure MonCash systems, AI models, high reliability webhooks.",
        details: [
          "Standardized payment checkouts",
          "Voice speech synthesis pipelines",
          "Automated alerts delivery",
          "Robust double-verified rules"
        ]
      },
      {
        title: "Alpha Testing & Optimizations",
        description: "Loading timers diagnostic, device layout responsive checks.",
        details: [
          "A11y strict accessibility checks",
          "Performant bundle footprint scaling",
          "Variable network load audits",
          "Code quality automated linters"
        ]
      },
      {
        title: "Live Production Launch",
        description: "Scale-to-zero server orchestration, global domain routing.",
        details: [
          "Secure server certificate lockets",
          "Database migrations & schemes tests",
          "Analytics metric logs tracking",
          "Executive handover of code repositories"
        ]
      }
    ];

    return englishSteps[idx] || item;
  };

  return (
    <div className="py-16 bg-zinc-950 relative overflow-hidden dot-grid min-h-[90vh]">
      <SEO
        title={isEn ? "Our Custom Software Delivery Process — HaitianDev" : "Notre Processus de Développement Logiciel — HaitianDev"}
        description={isEn 
          ? "Uncover our elite 6-step roadmap from initial blueprint up to live deployment. Learn how we deliver production-grade systems." 
          : "Découvrez notre méthodologie rigoureuse en 6 étapes : planification, conception UX, codage propre, tests automatisés et livraison d'élite."}
        schema={getOrganizationSchema()}
      />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-950/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
          <Link to="/" className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-500 hover:text-white transition-colors">
            <span>{isEn ? "← Home" : "← Accueil"}</span>
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pb-2 uppercase tracking-tight">
            {isEn ? "OUR PROCESS" : "NOTRE PROCESSUS"}
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {isEn 
              ? "A vertical, circuit-style timeline of every step we take from idea to global launch. An infallible technical journey."
              : "A vertical, circuit-style timeline of every step we take from idea to global launch. Un cheminement technique infaillible."}
          </p>
        </div>

        {/* Vertical circuit timeline layout */}
        <div className="relative ml-4 md:ml-32 md:pl-12 space-y-12">
          {/* Vertical Background Line */}
          <div className="absolute left-0 top-6 bottom-0 w-[2px] bg-zinc-900 rounded-full overflow-hidden">
            {/* Filled Progress Line */}
            <div 
              className="absolute top-0 left-0 w-full transition-all duration-700 ease-in-out bg-gradient-to-b from-blue-500 to-red-500"
              style={{ height: PROCESS_DATA.length > 1 ? `${(activeStep / (PROCESS_DATA.length - 1)) * 100}%` : '0%' }}
            />
            {/* Animated Data Flow */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-[30%] opacity-50 block z-10"
              style={{ background: 'linear-gradient(to bottom, transparent, #3b82f6, #ef4444, transparent)' }}
              animate={{ top: ['-30%', '130%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            />
          </div>
          {PROCESS_DATA.map((item, idx) => {
            const isSelected = activeStep === idx;
            const trans = getTranslatedProcessStep(item, idx);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Floating chronological node */}
                <div
                  onClick={() => setActiveStep(idx)}
                  className={`absolute -left-[17px] md:-left-[53px] top-6 w-8 h-8 -mt-4 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 z-15 ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-500 to-red-500 border-transparent shadow-[0_0_14px_rgba(59,130,246,0.6)] text-white font-bold text-xs scale-110"
                      : "bg-zinc-950 border-zinc-800 text-zinc-600 hover:border-zinc-500"
                  }`}
                >
                  <span className="font-mono text-xs font-bold">{item.step}</span>
                </div>

                {/* Desktop step title marker */}
                <div className="hidden md:block absolute -left-44 top-1.5 w-32 text-right">
                  <span className="font-mono text-xs font-bold text-zinc-700 tracking-wider">
                    {isEn ? `PHASE ${item.step}` : `PHASE ${item.step}`}
                  </span>
                </div>

                {/* Main Card */}
                <Card
                  onClick={() => setActiveStep(idx)}
                  className={`bg-zinc-900/15 border text-left cursor-pointer p-6 sm:p-8 transition-all ${
                    isSelected
                      ? "border-zinc-700 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
                      : "border-zinc-900/80 hover:border-zinc-850"
                  }`}
                  hoverable={false}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg shrink-0">
                        {iconMap[item.icon]}
                      </div>
                      <div>
                        <h3 className={`font-display text-lg font-bold transition-all ${isSelected ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400" : "text-white"}`}>
                          {trans.title}
                        </h3>
                        <p className="text-zinc-500 text-xs sm:text-sm font-sans mt-0.5">{trans.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bullet sub-items displayed dynamic only if selected or always open */}
                  <div className={`mt-6 space-y-3.5 border-t border-zinc-900 pt-5 transition-all duration-300 ${isSelected ? "opacity-100 block" : "opacity-45 block"}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                      {trans.details.map((detail: string, dIdx: number) => (
                        <div key={dIdx} className="flex items-start space-x-2.5 text-zinc-400 font-sans">
                          <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ${isSelected ? "text-red-400" : "text-zinc-700"}`} />
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center space-y-4">
          <p className="text-zinc-500 text-xs font-mono">
            {isEn ? "END OF THE INTERACTIVE PIPELINE" : "FIN DU PIPELINE INTERACTIF"}
          </p>
          <Link to="/services">
            <Button variant="secondary" size="md">
              {isEn ? "Initiate Co-Development" : "Démarrer notre collaboration"}
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
