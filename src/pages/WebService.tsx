import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { 
  Globe, 
  Code, 
  Cpu, 
  Layers, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  Search, 
  Sparkles,
  ArrowRight,
  Terminal,
  Database
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getDetailedServiceSchema } from "../utils/seoSchemas";

export const WebService: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const techStack = [
    { name: "React", desc: "Interactive interfaces", icon: <Code className="w-5 h-5 text-cyan-400" /> },
    { name: "Next.js", desc: "Production grade framework", icon: <Layers className="w-5 h-5 text-white" /> },
    { name: "TypeScript", desc: "Strict type safety engine", icon: <Terminal className="w-5 h-5 text-blue-400" /> },
    { name: "Tailwind CSS", desc: "Utility-first design styling", icon: <Sparkles className="w-5 h-5 text-teal-400" /> },
    { name: "Node.js & Express", desc: "Scalable runtime backend", icon: <Cpu className="w-5 h-5 text-emerald-400" /> },
    { name: "PostgreSQL", desc: "Relational database model", icon: <Database className="w-5 h-5 text-sky-400" /> },
    { name: "MonCash API", desc: "Integrated local payment gateway", icon: <CreditCard className="w-5 h-5 text-red-500" /> },
    { name: "SEO & Speed Optimization", desc: "Ultra-performing loads", icon: <Zap className="w-5 h-5 text-amber-500" /> }
  ];

  const valueProps = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: isEn ? "Extreme Speed & 3G Friendliness" : "Vitesse Extrême & Compatibilité 3G",
      desc: isEn 
        ? "We optimize every image and bundle size under 200KB per route. Perfect for Haiti's standard cellular networks."
        : "Nous optimisons chaque image et réduisons la taille des fichiers sous les 200KB. Idéal pour les réseaux mobiles haïtiens."
    },
    {
      icon: <CreditCard className="w-6 h-6 text-red-500" />,
      title: isEn ? "MonCash & Local Fintech Masters" : "Passerelles MonCash & Fintech Locales",
      desc: isEn 
        ? "Automate your revenue securely inside Haiti. Seamless connection with Digicel MonCash and Natcash systems."
        : "Automatisez vos revenus de manière sécurisée en Haïti. Intégration directe des systèmes Digicel MonCash et Natcash."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: isEn ? "Resilient High-Uptime Hosting" : "Hébergement Résilient Haute Disponibilité",
      desc: isEn 
        ? "Our cloud architectures run on globally redundant CDNs, surviving any local power or internet micro-cuts."
        : "Nos architectures cloud tournent sur des CDN redondés à l'international, insensibles aux coupures locales ou d'électricité."
    },
    {
      icon: <Search className="w-6 h-6 text-emerald-450" />,
      title: isEn ? "Elite Search Engine SEO Rank" : "SEO & Référencement de Premier Ordre",
      desc: isEn 
        ? "Get found organically by customers anywhere in the world with standard-compliant rich text layouts."
        : "Soyez visible organiquement par des clients du monde entier grâce à un balइजage sémantique irréprochable."
    }
  ];

  return (
    <div className="py-20 bg-zinc-950 relative overflow-hidden dot-grid">
      <SEO
        title={isEn ? "Elite Web Development Services — HaitianDev" : "Développement Web de Pointe — HaitianDev"}
        description={isEn 
          ? "Deploy high-performance web applications built on React, Next.js, and TypeScript. Experience extreme speed and perfect visual quality." 
          : "Déployez des applications web ultra-performantes conçues en React, Next.js et TypeScript. Alliez vitesse extrême et référencement web d'élite."}
        schema={getDetailedServiceSchema(
          isEn ? "Web Development Services" : "Développement Web de Pointe",
          isEn 
            ? "High-performance custom web app development with React, Next.js, and TypeScript."
            : "Création d'applications et de portails web sur-mesure de haute performance.",
          "/services/web-design"
        )}
      />
      {/* Background spotlights */}
      <div className="absolute top-[15%] left-[-20%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-900/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-32">
        
        {/* SECTION 1: HERO DU SERVICE */}
        <section className="relative text-center pt-8 sm:pt-16 max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-blue-950/40 border border-blue-900/30 px-3.5 py-1 rounded-full text-xs font-mono text-blue-400"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
            <span>{isEn ? "HIGHT-TIER SOFTWARE ARCHITECTURE" : "INGÉNIERIE LOGICIELLE HAUT DE GAMME"}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-black bg-gradient-to-r from-[#002f6c] to-[#c8102e] bg-clip-text text-transparent tracking-tight leading-[1.1]"
          >
            {isEn ? "Web Development" : "Développement Web"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {isEn 
              ? "We create modern high-tier web applications, custom e-commerce experiences with MonCash, and secure scalable SaaS platforms designed to load instantly anywhere."
              : "Nous concevons des applications Web modernes haut de gamme, des e-commerces d'élite intégrant MonCash, et des plateformes SaaS hautement performantes conçues pour s'afficher en un clin d'œil."}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4"
          >
            <Link to="/services?select=web-design">
              <button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold rounded-full px-8 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.03] active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-widest cursor-pointer">
                {isEn ? "Build my project blueprint" : "Concevoir mon devis interactif"}
              </button>
            </Link>
          </motion.div>
        </section>

        {/* SECTION 2: PRÉSENTATION DU SERVICE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider">
                {isEn ? "Premium Quality Foundations" : "Bâtir sur des fondations d'exception"}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isEn ? "Stunning design paired with modern performance" : "Le design de prestige allié aux meilleures technologies"}
              </h2>
            </div>

            <div className="text-zinc-400 text-sm sm:text-base space-y-4 leading-relaxed font-sans">
              <p>
                {isEn 
                  ? "At HaitianDev, custom web development isn't about slapping generic templates together. We handcraft modular, semantic code architectures tailored exclusively to your conversion goals. Whether you require a corporate catalog, severe enterprise workflows, or a lightning-fast SaaS hub, we code from scratch to secure absolute elegance."
                  : "Chez HaitianDev, le développement de sites internet hauts de gamme s'affranchit des canevas génériques et répétitifs. Nous concevons une architecture modulaire, sémantique et optimisée sur-mesure pour chacun de vos objectifs commerciaux. Qu'il s'agisse d'un e-commerce complexe, d'un portail corporate d'élite ou de flux d'affaires centralisés."}
              </p>
              <p>
                {isEn 
                  ? "We place network reality at the center of our engineering. We know that internet in Haiti can be slow and expensive. Therefore, we compile ultra-optimized, compressed pages that display instantly under a second even on 3.5G connections, without sacrificing modern motion graphics, custom UI layouts, or security."
                  : "Nous plaçons l'intégration des réalités locales au cœur de notre ingénierie informatique. Sachant que l'accès réseau en Haïti peut s'avérer lent et coûteux, nous veillons à packager des applications ultra-légères. Votre site internet se charge ainsi en moins d'une seconde, même en connexion 3G dégradée, tout en conservant une fluidité visuelle et une sécurité absolue."}
              </p>
              <p>
                {isEn 
                  ? "Through rigorous API connections, we plug MonCash, Natcash, Sogexpress, and international systems like Stripe. Secure your revenue flow automatically with advanced real-time receipts, auto-generated PDF invoices, and military-grade bank encryption."
                  : "Grâce à des intégrations d'API robustes, nous connectons vos services avec Digicel MonCash, Natcom Natcash et les réseaux bancaires internationaux (Stripe). Automatisez vos ventes avec des flux de webhooks redondés, des reçus de paiement automatiques par SMS et une étanchéité de données de niveau bancaire."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card variant="glow-blue" hoverable={false} className="p-1 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-red-600/10 z-0" />
              <img 
                src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80" 
                alt="Elite Web Development Laptop Coding" 
                className="w-full h-[300px] sm:h-[450px] object-cover rounded-[22px] relative z-10 opacity-90 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </Card>
          </div>
        </section>

        {/* SECTION 3: LANGAGES, OUTILS ET TECHNOLOGIES UTILISÉS */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-bold text-blue-500 uppercase tracking-wider block">
              {isEn ? "THE MODERN STACK" : "NOTRE ARSENAL TECHNIQUE"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEn ? "Languages, tools and frameworks we leverage" : "Technologies, outils et langages maîtrisés"}
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm">
              {isEn 
                ? "We refuse outdated tech. We exclusively write clean, typing-secure software for elite scale."
                : "Nous refusons l'obsolescence. Nous écrivons du code typé, moderne et éprouvé pour résister à la charge."}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {techStack.map((tech, idx) => (
              <Card 
                key={tech.name} 
                variant="glass" 
                className="p-4 sm:p-6 flex flex-col space-y-3 hover:border-red-500/25"
                custom={{ delay: idx * 0.1 }}
              >
                <div className="p-2 sm:p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl w-fit">
                  {tech.icon}
                </div>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-white mb-1">
                    {tech.name}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-normal">
                    {tech.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 4: POURQUOI CHOISIR HAITIANDEV POUR CE SERVICE */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider block">
              {isEn ? "THE HAITIANDEV DIFFERENCE" : "L'ENGAGEMENT DE QUALITÉ"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEn ? "Why trust us with your digital assets" : "Pourquoi confier votre site internet à HaitianDev"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {valueProps.map((prop, idx) => (
              <div 
                key={idx} 
                className="flex space-x-4 p-6 sm:p-8 bg-zinc-900/10 border border-zinc-900 rounded-3xl relative overflow-hidden hover:border-zinc-800 transition-all duration-300"
              >
                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl h-fit">
                  {prop.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-white text-base sm:text-lg">
                    {prop.title}
                  </h3>
                  <p className="text-zinc-450 leading-relaxed text-xs sm:text-sm">
                    {prop.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: APPEL À L'ACTION FINAL */}
        <section className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 sm:p-12 text-center space-y-8">
            {/* Asymmetrical elegant brand-colored static line matching our custom design */}
            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#002f6c] to-[#c8102e] z-35 rounded-r-3xl" />
            
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="font-mono text-xs font-bold text-blue-500 uppercase tracking-widest block">
                {isEn ? "READY TO DOMINATE THE WEB?" : "PRÊT À MARQUER LES ESPRITS ?"}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {isEn 
                  ? "Let us architect your elite high-conversion web system" 
                  : "Donnez vie à une application Web d'exception dès aujourd'hui"}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {isEn 
                  ? "Tell us about your requirements, configure your budget boundaries through our live blueprint generator, and get your custom quote within 24 hours."
                  : "Faites-nous part de vos besoins. Parcourez notre configurateur de cahier des charges et recevez un chiffrage technique détaillé en moins de 24 heures."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link to="/services?select=web-design">
                <button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold rounded-full px-8 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.03] active:scale-95 transition-all text-xs tracking-wider uppercase cursor-pointer">
                  {isEn ? "Configure My Specifications" : "Lancer le configurateur"}
                </button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="md" className="rounded-full px-8 py-3.5 text-xs tracking-wider uppercase cursor-pointer">
                  {isEn ? "Browse portfolio" : "Explorer nos réalisations"}
                </Button>
              </Link>
            </div>
            
            <p className="text-[11px] font-mono text-zinc-600">
              {isEn ? "Lead response time: < 24 Hours | Average build: 3-5 Weeks" : "Temps de réponse moyen : < 24 Heures | Délai moyen : 3-5 Semaines"}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
