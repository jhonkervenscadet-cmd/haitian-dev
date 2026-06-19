import React, { useEffect, useState } from "react";
import "./../lib/firebase"; // Ensure firebase is initialized
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Mail, User, ShieldCheck, CheckCircle2, ChevronRight, CornerDownRight, X, Folder, Calendar, Building2, Check, Star, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { Hero } from "../components/sections/Hero";
import { StatsSection } from "../components/sections/StatsSection";
import { Features } from "../components/sections/Features";
import { ProcessSection } from "../components/sections/ProcessSection";
import { Partners } from "../components/sections/Partners";
import { Testimonials } from "../components/sections/Testimonials";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SectionHeading } from "../components/ui/SectionHeading";
import { AnimatedGlassCard } from "../components/ui/AnimatedGlassCard";
import { PROJECTS_DATA, ServiceItem, SERVICES_DATA, ProjectItem } from "../data/staticData";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";
import { loadCollection, subscribeToCollection, saveCollectionItem } from "../utils/firebaseSync";

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

export const Home: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  // Selected project state for modal
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    try {
      // Find service label from static data if select value is provided
      const serviceMatch = SERVICES_DATA.find(s => s.id === formData.service || s.slug === formData.service);
      const serviceLabel = serviceMatch ? serviceMatch.title : (formData.service || "Contact Général");

      const newDevis = {
        id: `devis_${Date.now()}`,
        clientName: formData.name,
        email: formData.email,
        company: "",
        specs: formData.message,
        estimatedBudget: "Non spécifié",
        desiredDeadline: "Asap",
        serviceType: serviceLabel,
        status: "Nouveau / En attente" as const,
        createdAt: new Date().toISOString()
      };

      // Save to Firestore
      await saveCollectionItem("devis", "haitian_dev_devis_local", newDevis, []);

      // Mirror to localStorage for legacy components
      const existingLegacy = JSON.parse(localStorage.getItem("haitian_dev_devis") || "[]");
      localStorage.setItem("haitian_dev_devis", JSON.stringify([...existingLegacy, newDevis]));

      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormData({ name: "", email: "", service: "", message: "" });
    } catch (err) {
      console.error("Failed to record quote in Firestore:", err);
      setIsSubmitting(false);
    }
  };

  const [dbProjects, setDbProjects] = useState<any[]>([]);

  useEffect(() => {
    const initialDbProjects = PROJECTS_DATA.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      year: p.year || "2025",
      client: p.client || "Haitian D.E.V.",
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
      client: p.client || original?.client || "Haitian D.E.V.",
      year: p.year || original?.year || "2025"
    };
  };

  const uiProjects = dbProjects.length > 0
    ? dbProjects.map(mapFirebaseProjectToUi)
    : [];

  // Only take first 4 projects requested for Home (MWA, KVAIA, GST, EPWeb)
  const homeProjects = uiProjects.slice(0, 4);

  return (
    <div className="relative">
      <SEO
        title={isEn ? "Haitian D.E.V. — Elite Web, Mobile & AI Studio in Haiti" : "Haitian D.E.V. — Agence Tech & Intelligence Artificielle Haïti"}
        description={isEn 
          ? "Haitian D.E.V. connects Haiti to elite technology. Premium web/mobile apps, custom AI integration, software engineering training & digital transformation." 
          : "Haitian D.E.V. propulse Haïti vers l'élite technologique. Applications web/mobiles sur-mesure, intégration d'IA, et de formations d'excellence en ingénierie logicielle."}
        schema={getOrganizationSchema()}
      />
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 1.5 Stats Section */}
      <StatsSection />

      {/* 2. Core Features (Services & Pourquoi Haitian Dev) */}
      <Features />

      {/* 3. Team Process timeline */}
      <ProcessSection />

      {/* 3.5 Partners */}
      <Partners />

      {/* 4. Recent Projects Grid */}
      <section className="py-24 relative bg-transparent">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="mb-16">
            <SectionHeading
              overline={isEn ? "ACHIEVEMENTS" : "RÉALISATIONS"}
              title={isEn ? "Recent Projects" : "Projets Récents"}
              align="center"
              className="border-none pb-0 text-center"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {homeProjects.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-600 font-display italic text-sm">
                {isEn ? "No active projects displayed currently." : "Aucun projet actif affiché pour le moment."}
              </div>
            ) : homeProjects.map((proj, idx) => {
              const displayTitle = t(`data.projects.${proj.id}.title`) || proj.title;
              const displaySubtitle = t(`data.projects.${proj.id}.subtitle`) || proj.subtitle;
              const displayDesc = t(`data.projects.${proj.id}.description`) || proj.description;

              return (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onClick={() => setSelectedProject(proj)}
                  className="cursor-pointer group relative"
                >
                  {/* Custom Card Layout - No rotating outline animation, asymmetric right border */}
                  <div className="relative w-full h-full bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-zinc-900/80 flex flex-col justify-between transition-all duration-300 hover:border-zinc-800 hover:shadow-[0_8px_30px_rgba(0,47,108,0.15)] pb-6">
                    
                    {/* Fixed Static Right Edge Line (Asymmetric, brand colored gradient) */}
                    <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#002f6c] to-[#c8102e] z-30 rounded-r-3xl" />

                    {/* Card Section Header with Integrated Graphic Image */}
                    <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-t-3xl">
                      <img 
                        src={proj.image && (proj.image.startsWith("http://") || proj.image.startsWith("https://")) ? proj.image : getProjectImage(proj.id)} 
                        alt={displayTitle} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-black/20" />
                      
                      {/* Floating category badge on Card Image */}
                      <span className="absolute top-3 left-3 font-mono text-[9px] sm:text-xs font-bold text-blue-400 bg-zinc-950/80 backdrop-blur-sm border border-blue-900/40 px-2.5 py-0.5 rounded-full">
                        {proj.category}
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
                        <span>{isEn ? "Descriptive sheet" : "Fiche descriptive"}</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons under the grid: "Accéder au store" (en dégradé) & "Voir tout le portfolio" */}
          {!authLoading && !currentUser && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16">
              <Link to="/services">
                <button className="px-8 py-3.5 rounded-full text-center text-xs sm:text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] text-white transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer">
                  <span>{isEn ? "Access the store" : "Accéder au store"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              
              <Link to="/portfolio">
                <button className="px-8 py-3.5 rounded-full text-center text-xs sm:text-sm font-bold uppercase tracking-widest border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer">
                  <span>{isEn ? "View all portfolio" : "Voir tout le portfolio"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          )}

        </div>

        {/* Dynamic Project Details Modal Overlay */}
        <AnimatePresence>
          {selectedProject && (() => {
            const displayModalTitle = t(`data.projects.${selectedProject.id}.title`) || selectedProject.title;
            const displayModalSubtitle = t(`data.projects.${selectedProject.id}.subtitle`) || selectedProject.subtitle;
            const displayModalDesc = t(`data.projects.${selectedProject.id}.description`) || selectedProject.description;

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
                      alt={displayModalTitle} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/30" />
                    
                    {/* Floating category badge on Modal Image */}
                    <span className="absolute bottom-4 left-4 font-mono text-[10px] sm:text-xs font-bold text-blue-400 bg-zinc-900/90 backdrop-blur-md border border-blue-900/40 px-3 py-1 rounded-full shadow-lg">
                      {selectedProject.category}
                    </span>
                  </div>

                  {/* Header info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-xs font-mono text-zinc-500 border-b border-zinc-900 pb-3">
                      <span className="text-blue-400 font-bold">[{selectedProject.code}]</span>
                      <span>•</span>
                      <Folder className="w-3.5 h-3.5" />
                      <span>Haitian D.E.V. Platform</span>
                      <span>•</span>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{selectedProject.year || "2025"}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">{displayModalTitle}</h2>
                      <p className="text-sm text-zinc-400 font-mono italic">{displayModalSubtitle}</p>
                    </div>
                  </div>

                  {/* Technical Performance statistics panel */}
                  {selectedProject.stats && (
                    <div className="space-y-2">
                      <span className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                        {isEn ? "Performance metrics" : "Statistiques de performance"}
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

                  {/* Details description */}
                  <div className="space-y-3 font-sans">
                    <span className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                      {isEn ? "Overview and results" : "Présentation et résultats"}
                    </span>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {displayModalDesc}
                    </p>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {isEn 
                        ? "The product was successfully launched with top-tier network optimizations, specifically engineered to remain reliable and secure even in variable connectivity situations across Haiti."
                        : "Le produit a été propulsé avec d'excellentes optimisations réseau, spécifiquement conçues pour rester performant et sécurisé dans les configurations à connectivité variable d'Haïti (friendly Digicel & Natcom)."}
                    </p>
                  </div>

                  {/* Client info and status badge */}
                  <div className="border-t border-zinc-900 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-500">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-zinc-600" />
                      <span>Client: <strong className="text-zinc-350 font-bold">{selectedProject.client || "Haitian D.E.V. Consultant"}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-emerald-500 bg-emerald-950/20 px-3 py-1 rounded-full border border-emerald-900/30 w-fit">
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEn ? "Live in Production" : "En Production"}</span>
                    </div>
                  </div>

                  {/* Modal Action Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                      }}
                      className="w-full sm:w-auto px-8 py-3 rounded-full text-center text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] text-white transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>{isEn ? "Access project" : "Accéder au projet"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>
      </section>

      {/* 5. Testimonial section ("Ils nous font confiance") */}
      <Testimonials />

      {/* 6. Contact Form ("Entrons en contact") */}
      <section id="contact" className="py-24 relative bg-transparent dot-grid border-t border-white/5">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Contact left info */}
            <div className="lg:col-span-5 space-y-6">
              <SectionHeading
                overline={isEn ? "GET IN TOUCH" : "ENTRONS EN CONTACT"}
                title={isEn ? "Contact Us" : "Contact"}
                description={isEn 
                  ? "Let's discuss your next project. Whether you want to build a local payment application, integrate Creole voice AI, or launch an elite SaaS platform, our engineering team is ready to deliver." 
                  : "Discutons de votre prochain projet. Que vous souhaitiez concevoir une application de paiement locale, intégrer de l'IA vocale créole ou lancer un produit SaaS d'élite, notre studio est prêt à relever le défi."}
                align="left"
              />

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center space-x-3 text-zinc-400 text-sm">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a href="mailto:contact@haitiandev.org" className="hover:text-blue-400 transition-colors duration-200">
                    contact@haitiandev.org
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-zinc-400 text-sm">
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-100/70">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Delmas 33, Port-au-Prince, Haïti</span>
                </div>
                <div className="flex items-start space-x-3 text-zinc-400 text-sm">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col space-y-1 font-mono">
                    <a href="tel:+50937133267" className="hover:text-emerald-400 transition-colors duration-200">
                      +509 37 13 3267
                    </a>
                    <a href="tel:+15818095689" className="hover:text-emerald-400 transition-colors duration-200">
                      +1 581 809 5689
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact right form */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 sm:p-10">
                {/* Fixed Static Right Edge Line (Asymmetric, brand colored gradient) */}
                <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#002f6c] to-[#c8102e] z-30 rounded-r-3xl" />
                <AnimatePresence mode="wait">
                  {formSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 space-y-4"
                    >
                      <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                      <h3 className="font-display text-xl font-bold text-white">
                        {isEn ? "Thank you for your message!" : "Merci pour votre message !"}
                      </h3>
                      <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                        {isEn 
                          ? "Our engineering team will analyze your request and get back to you within 24 business hours."
                          : "Notre équipe d'ingénieurs analysera votre demande et communiquera avec vous sous 24 heures ouvrées."}
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setFormSubmitted(false)} className="mt-4">
                        {isEn ? "Send another message" : "Envoyer un autre message"}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleFormSubmit}
                      className="space-y-6 relative z-10"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                            {isEn ? "Full Name" : "Nom Complet"}
                          </label>
                          <input
                            type="text"
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={isEn ? "Alexander Hamilton" : "Jean-Jacques Dessalines"}
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                            {isEn ? "Email Address" : "Adresse Email"}
                          </label>
                          <input
                            type="email"
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="client@domain.com"
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                            {isEn ? "Desired Service" : "Service Désiré"}
                          </label>
                          <select
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                          >
                            <option value="">
                              {isEn ? "Select a service (Optional)" : "Sélectionner un service (Optionnel)"}
                            </option>
                            <option value="web-dev">
                              {isEn ? "Web Development (Next.js / Cloud)" : "Développement Web (Next.js / Cloud)"}
                            </option>
                            <option value="mobile-dev">
                              {isEn ? "Mobile Applications (iOS / Android)" : "Applications Mobiles (iOS / Android)"}
                            </option>
                            <option value="ai-sol">
                              {isEn ? "AI Solutions & Automation" : "Solutions IA & Automatisation"}
                            </option>
                            <option value="chatbot-auto">
                              {isEn ? "Kreyòl & WhatsApp Chatbots" : "Chatbots Kreyòl & WhatsApp"}
                            </option>
                            <option value="games">
                              {isEn ? "Web & Mobile Games" : "Jeux Web & Mobiles"}
                            </option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                            {isEn ? "Project Details (Message)" : "Détails du Projet (Message)"}
                          </label>
                          <textarea
                            required
                            rows={4}
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder={isEn 
                              ? "Describe your project, deadlines, expectations..." 
                              : "Décrivez votre projet, vos objectifs, et vos jalons temporels..."}
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 resize-none"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="secondary"
                        size="md"
                        disabled={isSubmitting}
                        className="w-full relative overflow-hidden"
                      >
                        {isSubmitting 
                          ? (isEn ? "Submitting inquiry..." : "Transmission en cours...") 
                          : (isEn ? "Submit my inquiry" : "Transmettre ma demande")}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
