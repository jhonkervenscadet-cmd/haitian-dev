import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Hexagon, Triangle, Box, Circle, Target, Layers, 
  Activity, Users, Star, Shield, Zap, Sparkles, Building, 
  Rocket, Code2, Cloud, ArrowRight, Search, CheckCircle2,
  Mail, MessageSquare, Briefcase, ExternalLink, Award, Share2
} from 'lucide-react';
import { loadCollection, subscribeToCollection, saveCollectionItem } from "../utils/firebaseSync";

// Safe mapping of Lucide icons
const ICONS_MAP: Record<string, any> = {
  Globe, Hexagon, Triangle, Box, Circle, Target, Layers, Activity, Users, Star, Shield, Zap, Sparkles, Building, Rocket, Code2, Cloud
};

const defaultPartnersData = [
  { id: '1', name: 'TechNova', icon: 'Globe', color: 'text-blue-500', description_fr: 'Leader en solutions cloud durables et infrastructures distribuées.', description_en: 'Leader in sustainable cloud solutions and distributed infrastructures.', sector_fr: 'Technologie Cloud', sector_en: 'Cloud Tech', websiteUrl: 'https://technova.ht' },
  { id: '2', name: 'AcmeCorp', icon: 'Hexagon', color: 'text-red-500', description_fr: 'Spécialisé dans le hardware de pointe et l\'IoT intelligent pour les villes connectées.', description_en: 'Specializing in edge hardware and smart IoT for connected cities.', sector_fr: 'IoT & Hardware', sector_en: 'IoT & Hardware', websiteUrl: 'https://acme.ht' },
  { id: '3', name: 'Nexus', icon: 'Triangle', color: 'text-emerald-500', description_fr: 'Accélérateur d\'innovation numérique et de transformation agile pour les entreprises.', description_en: 'Accelerator of digital innovation and agile business transformation.', sector_fr: 'Innovation Hub', sector_en: 'Innovation Hub', websiteUrl: 'https://nexus.ht' },
  { id: '4', name: 'Stellar', icon: 'Box', color: 'text-purple-500', description_fr: 'Solutions d\'intelligence artificielle et d\'automatisation des données d\'entreprise.', description_en: 'AI and enterprise data automation solutions.', sector_fr: 'Data & IA', sector_en: 'Data & AI', websiteUrl: 'https://stellar.ht' },
  { id: '5', name: 'Orbit', icon: 'Circle', color: 'text-orange-500', description_fr: 'Réseau de communication ultra-rapide et services de télécommunications sécurisés.', description_en: 'Ultra-fast communication network and secure telecommunications services.', sector_fr: 'Télécoms', sector_en: 'Telecoms', websiteUrl: 'https://orbit.ht' },
  { id: '6', name: 'Apex', icon: 'Target', color: 'text-cyan-500', description_fr: 'Cabinet d\'audit en cybersécurité et de protection des données sensibles.', description_en: 'Cybersecurity audit and sensitive data protection firm.', sector_fr: 'Cybersécurité', sector_en: 'Cybersecurity', websiteUrl: 'https://apex.ht' },
];

export const PartnersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [partners, setPartners] = useState<any[]>(() => {
    const raw = localStorage.getItem("haitiandev_partners");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return defaultPartnersData;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  
  // Partnership Form States
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const initLoad = async () => {
      const data = await loadCollection<any>("partners", "haitiandev_partners", defaultPartnersData);
      setPartners(data);
    };
    initLoad();

    const unsubscribe = subscribeToCollection<any>("partners", "haitiandev_partners", (data) => {
      setPartners(data);
    }, defaultPartnersData);

    return () => {
      unsubscribe();
    };
  }, []);

  // Filter unique partners
  const uniquePartners = Array.from(new Map(partners.map((p: any) => [String(p.id), p])).values());

  // Get all unique sectors
  const sectors = ['All', ...Array.from(new Set(uniquePartners.map((p: any) => isEn ? (p.sector_en || p.sector_fr || 'Technology') : (p.sector_fr || p.sector_en || 'Technologie'))))];

  // Filter partners based on search and sector dropdown
  const filteredPartners = uniquePartners.filter((partner: any) => {
    const partnerName = partner.name.toLowerCase();
    const sector = (isEn ? (partner.sector_en || partner.sector_fr) : (partner.sector_fr || partner.sector_en)) || '';
    const desc = (isEn ? (partner.description_en || partner.description_fr) : (partner.description_fr || partner.description_en)) || '';
    
    const matchesSearch = partnerName.includes(searchTerm.toLowerCase()) || desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || sector === selectedSector;
    
    return matchesSearch && matchesSector;
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email || !formData.contactName) return;

    setIsSubmitting(true);
    try {
      const newRequest = {
        id: `partner_req_${Date.now()}`,
        ...formData,
        status: 'Nouveau',
        createdAt: new Date().toISOString()
      };
      
      // Save partnership requests into Firestore 'partner_requests' collection
      await saveCollectionItem("partner_requests", "haitiandev_partner_requests", newRequest, []);
      setSubmitSuccess(true);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error("Error submitting partnership request", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 relative overflow-hidden font-sans">
      {/* Visual background atmospheric elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-zinc-900/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Header Section */}
      <section className="relative pt-32 pb-20 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-950/40 to-red-950/40 border border-zinc-800 rounded-full px-4 py-1.5"
          >
            <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-300">
              {isEn ? "Ecosystem & Synergy" : "Écosystème & Synergie"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight"
          >
            {isEn ? "Sustaining Excellence through " : "Soutenir l'Excellence par des "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-red-500">
              {isEn ? "Strategic Alliances" : "Alliances Stratégiques"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto font-sans leading-relaxed"
          >
            {isEn 
              ? "We collaborate with industry leaders, cutting-edge technology hubs, and forward-thinking enterprises to empower the tech ecosystem in Haiti and globally." 
              : "Nous collaborons avec les leaders de l'industrie, les hubs d'innovation technologique et les entreprises visionnaires pour propulser l'écosystème numérique en Haïti et dans le monde."}
          </motion.p>
        </div>
      </section>

      {/* Main Partners Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Advanced Filter and Search Controls */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4 backdrop-blur-md">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
            <input 
              type="text"
              placeholder={isEn ? "Search partners..." : "Rechercher un partenaire..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-900 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-600 transition-all duration-200 font-sans"
            />
          </div>

          {/* Categories Tab */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                  selectedSector === sector
                    ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                    : "bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-900"
                }`}
              >
                {sector === 'All' ? (isEn ? 'All Sectors' : 'Tous les Secteurs') : sector}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <AnimatePresence mode="popLayout">
          {filteredPartners.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPartners.map((partner: any, index: number) => {
                const Icon = ICONS_MAP[partner.icon] || Globe;
                const description = isEn 
                  ? (partner.description_en || partner.description_fr || 'Valued technology alliance and co-innovation partner.')
                  : (partner.description_fr || partner.description_en || 'Partenaire de confiance pour la co-innovation technologique.');
                const sector = isEn 
                  ? (partner.sector_en || partner.sector_fr || 'Technology')
                  : (partner.sector_fr || partner.sector_en || 'Technologie');

                return (
                  <motion.div
                    key={`p-card-${partner.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -15 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative bg-zinc-950/40 border border-zinc-900/80 rounded-3xl p-6 sm:p-8 hover:bg-zinc-950 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between min-h-[300px] overflow-hidden"
                  >
                    {/* Corner gradient lights */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/5 to-transparent rounded-tr-3xl transition-opacity duration-300 opacity-30 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-600/5 to-transparent rounded-bl-3xl transition-opacity duration-300 opacity-30 group-hover:opacity-100" />

                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800 group-hover:border-zinc-700 transition-colors duration-300">
                            {partner.logoUrl ? (
                              <img 
                                src={partner.logoUrl} 
                                alt={partner.name} 
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 object-contain filter brightness-100"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Icon className={`w-8 h-8 ${partner.color || 'text-blue-500'}`} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-red-400 transition-all duration-300">
                              {partner.name}
                            </h3>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1 block">
                              {sector}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-sans">
                        {description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-900/60 flex items-center justify-between mt-auto">
                      {partner.websiteUrl ? (
                        <a 
                          href={partner.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span>{isEn ? "Visit Website" : "Visiter le site"}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs font-mono text-zinc-600">
                          {isEn ? "Verified Partner" : "Partenaire Agréé"}
                        </span>
                      )}
                      <div className="flex space-x-2">
                        <Shield className="w-4 h-4 text-zinc-700" />
                        <CheckCircle2 className="w-4 h-4 text-red-500/80" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-3xl"
            >
              <Building className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 font-sans">
                {isEn ? "No partners found matching your filters." : "Aucun partenaire ne correspond à vos critères."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Why Partner with Us Section */}
      <section className="py-24 border-t border-zinc-900 bg-gradient-to-b from-zinc-950/20 to-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest block">
              {isEn ? "Strategic Synergy" : "Synergie Stratégique"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {isEn ? "Why Partner with HaitianDev?" : "Pourquoi devenir Partenaire ?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/20 border border-zinc-900/80 p-8 rounded-3xl space-y-4 hover:border-zinc-800 transition-colors">
              <div className="p-3 bg-blue-600/10 rounded-2xl w-fit text-blue-500">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                {isEn ? "Technology Synergy" : "Synergie Technologique"}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                {isEn 
                  ? "Access state-of-the-art architectures, engineering co-development, and early validation of next-gen web & cloud frameworks."
                  : "Accédez à des architectures à la pointe de l'art, du co-développement d'ingénierie et une validation précoce des frameworks web & cloud."}
              </p>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-900/80 p-8 rounded-3xl space-y-4 hover:border-zinc-800 transition-colors">
              <div className="p-3 bg-red-600/10 rounded-2xl w-fit text-red-500">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                {isEn ? "Elite Talent Funnel" : "Vivier de Talents d'Élite"}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                {isEn 
                  ? "Connect with our top graduates from Haiti’s premiere software engineering academy to fulfill critical technical roles."
                  : "Connectez-vous avec nos meilleurs diplômés de l'académie de génie logiciel d'élite en Haïti pour combler vos rôles techniques clés."}
              </p>
            </div>

            <div className="bg-zinc-900/20 border border-zinc-900/80 p-8 rounded-3xl space-y-4 hover:border-zinc-800 transition-colors">
              <div className="p-3 bg-purple-600/10 rounded-2xl w-fit text-purple-500">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                {isEn ? "Socio-Economic Impact" : "Impact Socio-Économique"}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                {isEn 
                  ? "Create direct digital trade-lanes and high-paying professional career paths for talent inside Haiti's boundaries."
                  : "Créez des opportunités commerciales numériques directes et des parcours de carrière hautement qualifiés pour les talents en Haïti."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Partner Section Form */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle gradient glowing accent */}
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-bl from-red-600/10 to-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center space-y-4 mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {isEn ? "Initiate an Alliance" : "Initier un Partenariat"}
            </h2>
            <p className="text-zinc-400 text-sm font-sans">
              {isEn 
                ? "Send us a brief overview of your business context. Our corporate relationships team will get back to you within 48 business hours."
                : "Envoyez-nous un aperçu rapide de vos objectifs. Notre équipe de relations d'affaires vous recontactera sous 48 heures ouvrables."}
            </p>
          </div>

          {submitSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                {isEn ? "Request Successfully Sent!" : "Demande de partenariat envoyée !"}
              </h3>
              <p className="text-zinc-400 text-sm font-sans max-w-md mx-auto">
                {isEn 
                  ? "Thank you for reaching out. We are excited about the prospect of co-creating technical and economic value together."
                  : "Merci de nous avoir contactés. Nous sommes ravis à l'idée de co-créer de la valeur technique et économique ensemble."}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    {isEn ? "Company Name *" : "Nom de l'entreprise *"}
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleFormChange}
                    className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors font-sans"
                    placeholder="Ex: Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    {isEn ? "Contact Person *" : "Nom du contact *"}
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    required
                    value={formData.contactName}
                    onChange={handleFormChange}
                    className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-600 transition-colors font-sans"
                    placeholder="Ex: John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    {isEn ? "Corporate Email *" : "E-mail d'affaires *"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors font-sans"
                    placeholder="john@acme.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    {isEn ? "Telephone" : "Téléphone"}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-600 transition-colors font-sans"
                    placeholder="+509 XXXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  {isEn ? "Collaboration Overview *" : "Présentation de la collaboration *"}
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleFormChange}
                  className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors font-sans"
                  placeholder={isEn ? "Briefly explain how you wish to collaborate..." : "Expliquez brièvement comment vous souhaitez collaborer..."}
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00209F] to-[#D21034] text-white font-bold text-sm uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer inline-flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>{isEn ? "Submitting..." : "Transmission..."}</span>
                  ) : (
                    <>
                      <span>{isEn ? "Submit Request" : "Envoyer la Demande"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
