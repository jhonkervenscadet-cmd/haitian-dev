import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { Expand, Sparkles, Sliders, LayoutGrid, Heart } from "lucide-react";
import { GALLERY_DATA, GalleryItem } from "../data/staticData";
import { Card } from "../components/ui/Card";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";

export const Gallery: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: "All", label: isEn ? "All" : "Tous" },
    { id: "UI/UX Design", label: "UI/UX Design" },
    { id: "Fintech", label: "Fintech" },
    { id: "Interactive Design", label: isEn ? "Interactive" : "Interactif" },
    { id: "Graphic Design", label: isEn ? "Graphic Design" : "Design Graphique" }
  ];

  const filteredItems = activeCategory === "All"
    ? GALLERY_DATA
    : GALLERY_DATA.filter((item) => (item.category || "").toLowerCase() === (activeCategory || "").toLowerCase());

  // High fidelity translations for hardcoded static records inside GALLERY_DATA
  const getTranslatedGalleryItem = (id: string, title: string, desc: string, category: string) => {
    let tTitle = title;
    let tDesc = desc;
    let tCat = category;

    if (!isEn) {
      // Categories
      if (category === "UI/UX Design") tCat = "Design UI/UX";
      if (category === "Interactive Design") tCat = "Design Interactif";
      if (category === "Graphic Design") tCat = "Design Graphique";
      if (category === "AI UI") tCat = "Interfaces d'IA";
      if (category === "Web3D") tCat = "Web 3D";
      if (category === "Tech UI") tCat = "Interfaces Techniques";

      // Item titles and descriptions
      switch (id) {
        case "gal-1":
          tTitle = "MonCash Réimaginé";
          tDesc = "Interface bancaire ultra-épurée explorant les contrastes sombres et néon.";
          break;
        case "gal-2":
          tTitle = "Console Vocale Kreyòl AI";
          tDesc = "Tableau de bord de traitement de la parole avec ondes de transcription en temps réel.";
          break;
        case "gal-3":
          tTitle = "Portail Mobile d'Apprentissage";
          tDesc = "Cartes de cours interactives enrichies de badges de scores progressifs.";
          break;
        case "gal-4":
          tTitle = "Interface Avion de Fret";
          tDesc = "Design sombre de suivi maritime et aérien avec tracés vectoriels luminescents.";
          break;
        case "gal-5":
          tTitle = "Concept de Carte Premium";
          tDesc = "Modélisation de carte de crédit isométrique aux détails métalliques.";
          break;
        case "gal-6":
          tTitle = "Analyseur de Revenus SaaS";
          tDesc = "Graphiques de facturation et de flux de trésorerie multidevises.";
          break;
        case "gal-7":
          tTitle = "Vue Physique WebGL 3D";
          tDesc = "Rendu de moteur physique tridimensionnel interactif fonctionnant dans le navigateur.";
          break;
        case "gal-8":
          tTitle = "Assistant WhatsApp Kreyòl";
          tDesc = "Composant de messagerie mobile avec bulles d'états et widgets de commande.";
          break;
      }
    }

    return { title: tTitle, desc: tDesc, category: tCat };
  };

  return (
    <div className="py-16 bg-zinc-950 relative overflow-hidden dot-grid min-h-[90vh]">
      <SEO
        title={isEn ? "UI/UX Design Showcase & UI Gallery — HaitianDev" : "Galerie Design UI/UX & Prototypes — HaitianDev"}
        description={isEn 
          ? "Explore our library of premium high-contrast digital prototypes, interactive user interfaces, and mobile payment mockups." 
          : "Explorez notre catalogue de prototypes d'interfaces interactives (UI/UX) premiums et de composants de paiements mobiles soignés."}
        schema={getOrganizationSchema()}
      />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-red-955/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <Link to="/" className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-500 hover:text-white transition-colors">
            <span>{isEn ? "← Home" : "← Accueil"}</span>
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pb-2 uppercase tracking-tight">
            {isEn ? "GALLERY" : "GALERIE"}
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {isEn 
              ? "A masonry showcase of UI design concepts, brand systems, 3D motion frames, and visual experiments." 
              : "Une galerie d'explorations d'interfaces, d'identités visuelles, de maquettes 3D et d'expérimentations graphiques."}
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-display text-xs font-semibold cursor-pointer transition-all border ${
                activeCategory === cat.id
                  ? "bg-white text-zinc-950 border-white"
                  : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid Masonry Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => {
              const trans = getTranslatedGalleryItem(item.id, item.title, item.desc, item.category);
              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setLightboxItem(item)}
                  className={`group relative overflow-hidden rounded-2xl border border-zinc-900 cursor-pointer ${item.aspect} bg-linear-to-b ${item.color} p-6 flex flex-col justify-between`}
                >
                  {/* Visual Glass Shimmer Overlay */}
                  <div className="absolute inset-0 bg-zinc-950/25 group-hover:bg-transparent transition-all duration-300" />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-85" />
                  
                  {/* Upper row: icon and group */}
                  <div className="relative z-10 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase bg-zinc-900/60 backdrop-blur-md border border-zinc-850 px-2 py-0.5 rounded">
                      {trans.category}
                    </span>
                    <Expand className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Lower row: details */}
                  <div className="relative z-10 space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {trans.title}
                    </h3>
                    <p className="text-zinc-300 text-xs line-clamp-1 group-hover:line-clamp-none transition-all font-sans leading-relaxed">
                      {trans.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Lightbox Overlay Detail */}
        <AnimatePresence>
          {lightboxItem && (() => {
            const transL = getTranslatedGalleryItem(lightboxItem.id, lightboxItem.title, lightboxItem.desc, lightboxItem.category);
            return (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md"
                onClick={() => setLightboxItem(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative max-w-xl w-full rounded-3xl overflow-hidden border border-zinc-800 bg-linear-to-br ${lightboxItem.color} p-8 sm:p-12 text-center shadow-2xl flex flex-col justify-between h-[360px]`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute inset-0 bg-zinc-950/45" />

                  <div className="relative z-10 space-y-4">
                    <span className="font-mono text-xs font-semibold text-blue-400 tracking-widest uppercase block bg-zinc-950/40 border border-zinc-900 py-1 px-3 rounded-full w-max mx-auto">
                      {transL.category}
                    </span>
                    
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                      {transL.title}
                    </h2>
                    
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans max-w-sm mx-auto">
                      {transL.desc}
                    </p>
                  </div>

                  <div className="relative z-10 pt-4 flex items-center justify-center space-x-1.5 text-xs font-mono text-zinc-500">
                    <span>Haitian Dev Design Archives</span>
                    <span>•</span>
                    <span>{isEn ? "Interactive Proof" : "Validation Interactive"}</span>
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
