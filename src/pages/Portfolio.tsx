import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { Filter, Calendar, Folder, Building2, Cpu, Sparkles, X, ChevronRight, Check } from "lucide-react";
import { PROJECTS_DATA, ProjectItem } from "../data/staticData";
import { loadCollection, subscribeToCollection } from "../utils/firebaseSync";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";

// Lookup of high quality landscape images on Unsplash for each project tech category
const getProjectImage = (id: string) => {
  switch (id) {
    case "mwa-fintech":
      return "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800";
    case "kreyol-voice-ai":
      return "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800";
    case "global-shipping-tracker":
      return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
    case "e-infotronique-portal":
      return "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800";
    case "restaurant-cloud-system":
      return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800";
    case "hr-management-tool":
      return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800";
    case "haiti-news-hub":
      return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800";
    case "edukreyol-lms":
      return "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800";
    case "pay-lakay-gateway":
      return "https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=800";
    case "agritech-dashboard":
      return "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=800";
    default:
      return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800";
  }
};

const getTranslatedStatLabel = (label: string, isEn: boolean) => {
  if (!isEn) return label;
  const map: { [key: string]: string } = {
    "Temps de chargement": "Load Time",
    "Taux de satisfaction": "Satisfaction Rate",
    "Sécurité": "Security",
    "Précision BLEU": "BLEU Accuracy",
    "Temps de latence": "Latency",
    "Vocabulaire local": "Local Vocabulary",
    "Précision GPS": "GPS Accuracy",
    "Actualisation": "Refresh interval",
    "Conteneurs suivis": "Containers tracked",
    "Étudiants actifs": "Active Students",
    "Uptime serveur": "Server Uptime",
    "Taille totale du bundle": "Total Bundle Size",
    "Transactions journalières": "Daily Transactions",
    "Réduction des pertes": "Loss Reduction",
    "Prise en main": "Onboarding Time",
    "Équipe trackée": "Tracked Staff",
    "Gain administratif": "Admin Time Saved",
    "Mode hors-ligne": "Offline Mode",
    "Visites uniques": "Unique Visits",
    "Poids de page": "Page Weight",
    "Vitesse d'affichage": "Render Speed",
    "Leçons gratuites": "Free Lessons",
    "Écoles équipées": "Schools Equipped",
    "Langue": "Language",
    "Succès d'API": "API Success Rate",
    "Intégration": "Integration Code",
    "Devises": "Currencies",
    "Fermes connectées": "Connected Farms",
    "Rendement de café": "Coffee Yield Increase",
    "Capteurs autonomes": "Autonomous Sensors"
  };
  return map[label] || label;
};

export const Portfolio: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  // Filtering states
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const [dbProjects, setDbProjects] = useState<any[]>([]);

  useEffect(() => {
    const initialDbProjects = PROJECTS_DATA.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      year: p.year || "2025",
      client: p.client || "Haitian Dev",
      shortDesc: p.description,
      imageUrl: p.image && (p.image.startsWith("http://") || p.image.startsWith("https://")) 
        ? p.image 
        : getProjectImage(p.id),
      actionUrl: (p as any).demoUrl || "https://haitiandev.org"
    }));

    const initLoad = async () => {
      const data = await loadCollection<any>("projects", "haitiandev_projects", []);
      setDbProjects(data);
    };
    initLoad();

    const unsubscribe = subscribeToCollection<any>("projects", "haitiandev_projects", (data) => {
      setDbProjects(data);
    }, []);

    return () => {
      unsubscribe();
    };
  }, []);

  const mapFirebaseProjectToUi = (p: any): ProjectItem => {
    const original = PROJECTS_DATA.find((o) => o.id === p.id);
    return {
      id: p.id ?? "",
      title: p.title ?? "",
      code: p.title?.replace(/[^a-zA-Z]/g, "").slice(0, 10).toUpperCase() || original?.code || "PROJ",
      subtitle: p.shortDesc || original?.subtitle || "",
      category: p.category as any,
      description: p.shortDesc || original?.description || "",
      image: p.imageUrl || p.image || original?.image || "",
      stats: p.stats || original?.stats || [
        { label: "Temps de chargement", value: "< 1.5s" },
        { label: "Taux de satisfaction", value: "98%" },
        { label: "Sécurité", value: "Optimisé" }
      ],
      client: p.client || original?.client || "Haitian Dev",
      year: p.year || original?.year || "2025",
      actionUrl: p.actionUrl || original?.actionUrl || "https://haitiandev.org"
    };
  };

  const uiProjects = dbProjects.length > 0
    ? dbProjects.map(mapFirebaseProjectToUi)
    : [];

  const filterOptions = [
    { id: "All", label: isEn ? "All" : "Tous" },
    { id: "Fintech", label: "Fintech" },
    { id: "AI", label: isEn ? "AI" : "IA" },
    { id: "Logistics", label: isEn ? "Logistics" : "Logistique" },
    { id: "SaaS", label: "SaaS" },
    { id: "Education", label: isEn ? "Education" : "Éducation" },
    { id: "Media", label: isEn ? "Media" : "Médias" }
  ];

  const filteredProjects = activeFilter === "All"
    ? uiProjects
    : uiProjects.filter((proj) => {
        if (activeFilter === "AI" && (proj.category || "").toLowerCase() === "ia") return true;
        return (proj.category || "").toLowerCase() === (activeFilter || "").toLowerCase();
      });

  return (
    <div className="py-16 bg-zinc-950 relative overflow-hidden dot-grid min-h-[90vh]">
      <SEO
        title={isEn ? "Elite Software Engineering Portfolio — HaitianDev" : "Portfolio d'Ingénierie Logicielle d'Élite — HaitianDev"}
        description={isEn 
          ? "Browse our recent custom applications. Discover high performance Web systems, Creole AI integrations, and secure Fintech solutions." 
          : "Découvrez notre portfolio de projets logiciels d'élite. Applications web haute performance, intégrations d'IA en créole et fintech sécurisées."}
        schema={getOrganizationSchema()}
      />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-955/10 blur-3xl text-zinc-600 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <Link to="/" className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-500 hover:text-white transition-colors">
            <span>{isEn ? "← Home" : "← Accueil"}</span>
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pb-2 uppercase tracking-tight">
            PORTFOLIO
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {isEn 
              ? "Discover our elite works optimized for deep impact. A selection of robust, high-performance technology products we have deployed."
              : "Découvrez nos travaux d'élites optimisés pour l'impact. Une sélection de produits technologiques performants et robustes que nous avons déployés."}
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <div className="flex items-center space-x-2 text-zinc-500 mr-2 border-r border-zinc-900 pr-4 text-xs font-mono">
            <Filter className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest hidden sm:inline">
              {isEn ? "Filter by:" : "Filtrer par:"}
            </span>
          </div>
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`px-4 py-2 rounded-lg font-display text-xs font-medium cursor-pointer transition-all duration-200 border ${
                activeFilter === opt.id
                  ? "bg-gradient-to-r from-[#002f6c] to-[#c8102e] border-[#002f6c] text-white shadow-[0_4px_12px_rgba(0,47,108,0.3)]"
                  : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Projects Grid Container with Exit/Entry spacing */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <motion.div 
                className="col-span-full py-20 text-center text-zinc-500 font-display italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isEn ? "No projects found matching your selection." : "Aucun projet trouvé correspondant à votre sélection."}
              </motion.div>
            ) : filteredProjects.map((proj, idx) => {
              const displayTitle = proj.title || t(`data.projects.${proj.id}.title`);
              const displaySubtitle = proj.subtitle || t(`data.projects.${proj.id}.subtitle`);
              const displayDesc = proj.description || t(`data.projects.${proj.id}.description`);
              const categoryBadge = proj.category === "AI" && !isEn ? "IA" : proj.category;

              return (
                <motion.div
                  layout
                  key={proj.id}
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => setSelectedProject(proj)}
                  className="cursor-pointer group relative"
                >
                  {/* Custom Card Layout to avoid rotating outline animation & enforce asymmetric right colored line */}
                  <div className="relative w-full h-full bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-zinc-900/80 flex flex-col justify-between transition-all duration-300 hover:border-zinc-850 hover:shadow-[0_8px_30px_rgba(0,47,108,0.15)] pb-6">
                    
                    {/* Fixed Static Right Edge Line (Asymmetric, brand colored gradient) */}
                    <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#002f6c] to-[#c8102e] z-30 rounded-r-3xl" />

                    {/* Card Section Header with Integrated Graphic Image */}
                    <div className="relative w-full h-44 sm:h-48 overflow-hidden rounded-t-3xl">
                      <img 
                        src={proj.image && (proj.image.startsWith("http://") || proj.image.startsWith("https://")) ? proj.image : getProjectImage(proj.id)} 
                        alt={displayTitle} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-black/20" />
                      
                      {/* Floating category badge on Card Image */}
                      <span className="absolute top-3 left-3 font-mono text-[9px] sm:text-xs font-bold text-blue-400 bg-zinc-950/80 backdrop-blur-sm border border-blue-900/40 px-2.5 py-0.5 rounded-full">
                        {categoryBadge}
                      </span>
                    </div>

                    {/* Card Main text */}
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] sm:text-xs font-bold text-zinc-400">
                          [{proj.code}]
                        </span>
                        <span className="font-mono text-[8px] sm:text-[10px] text-zinc-500">{proj.year || "2025"}</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-display text-sm sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                          {displayTitle}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-zinc-500 font-mono italic">{displaySubtitle}</p>
                      </div>

                      <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed line-clamp-3 font-sans">{displayDesc}</p>
                    </div>

                    {/* Highlights Footer Area */}
                    <div className="px-4 sm:px-6 pt-3 mt-auto border-t border-zinc-900/50 flex items-center justify-between text-zinc-500 text-[10px] sm:text-xs">
                      <span className="font-mono truncate max-w-[140px]">
                        Client: <strong className="text-zinc-450 font-medium">{proj.client || "Consultant"}</strong>
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-blue-500 group-hover:text-blue-400 flex items-center space-x-1 shrink-0">
                        <span>{isEn ? "Details sheet" : "Fiche descriptive"}</span>
                        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic Project Details Modal Overlay */}
        <AnimatePresence>
          {selectedProject && (() => {
            const displayTitleM = selectedProject.title || t(`data.projects.${selectedProject.id}.title`);
            const displaySubtitleM = selectedProject.subtitle || t(`data.projects.${selectedProject.id}.subtitle`);
            const displayDescM = selectedProject.description || t(`data.projects.${selectedProject.id}.description`);
            const categoryBadgeM = selectedProject.category === "IA" && isEn ? "AI" : selectedProject.category;

            return (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className="relative max-w-2xl w-full bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white cursor-pointer z-50"
                    aria-label={isEn ? "Close" : "Fermer"}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Header Image within Modal */}
                  <div className="relative w-full h-44 sm:h-60 overflow-hidden rounded-2xl">
                    <img 
                      src={selectedProject.image && (selectedProject.image.startsWith("http://") || selectedProject.image.startsWith("https://")) ? selectedProject.image : getProjectImage(selectedProject.id)} 
                      alt={displayTitleM} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/30" />
                    
                    {/* Floating category badge on Modal Image */}
                    <span className="absolute bottom-4 left-4 font-mono text-[10px] sm:text-xs font-bold text-blue-400 bg-zinc-900/90 backdrop-blur-md border border-blue-900/40 px-3 py-1 rounded-full shadow-lg">
                      {categoryBadgeM}
                    </span>
                  </div>

                  {/* Header info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-xs font-mono text-zinc-500 border-b border-zinc-905 pb-3">
                      <span className="text-blue-400 font-bold">[{selectedProject.code}]</span>
                      <span>•</span>
                      <Folder className="w-3.5 h-3.5" />
                      <span>{categoryBadgeM}</span>
                      <span>•</span>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{selectedProject.year || "2025"}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">{displayTitleM}</h2>
                      <p className="text-sm text-zinc-400 font-mono italic">{displaySubtitleM}</p>
                    </div>
                  </div>

                  {/* Technical Performance statistics panel */}
                  {selectedProject.stats && (
                    <div className="space-y-2">
                      <span className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                        {isEn ? "Performance statistics" : "Statistiques de performance"}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedProject.stats.map((st, idx) => (
                          <div key={idx} className="bg-zinc-900/50 border border-zinc-900/80 p-4 rounded-2xl text-center flex flex-col justify-center space-y-1">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                              {getTranslatedStatLabel(st.label, isEn)}
                            </span>
                            <span className="text-base font-mono font-black text-white block">{st.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}



                  {/* Metadata details line */}
                  <div className="border-t border-zinc-900 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-500">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-zinc-650" />
                      <span>Client: <strong className="text-zinc-350 font-bold">{selectedProject.client || "Haitian Dev Consultant"}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-emerald-500 bg-emerald-950/20 px-3 py-1 rounded-full border border-emerald-900/30 w-fit">
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEn ? "Live in Production" : "En Production"}</span>
                    </div>
                  </div>

                  {/* Action button in the modal */}
                  <div className="pt-2 flex justify-end">
                    <a
                      href={selectedProject.actionUrl || "https://haitiandev.org"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setSelectedProject(null)}
                      className="w-full sm:w-auto px-8 py-3 rounded-full text-center text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] text-white transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>{isEn ? "Access project" : "Accéder au projet"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>

                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
};
