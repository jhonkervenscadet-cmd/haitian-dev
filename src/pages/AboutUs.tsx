import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Globe, Award, Heart, GraduationCap, ChevronRight, Users, BookOpen, ShieldAlert } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";

export const AboutUs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const corePillars = [
    {
      icon: <Award className="w-6 h-6 text-yellow-400" />,
      title: isEn ? "Visionary Innovation" : "Innovation Visionnaire",
      desc: isEn 
        ? "AI-first thinking, edge computing, immersive 3D — we ship what is next, refusing outdated generic templates." 
        : "IA-first thinking, edge computing, design 3D immersif — nous livrons la technologie de pointe en refusant les solutions génériques dépassées."
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-red-500" />,
      title: isEn ? "Educational Impact" : "Impact Éducatif",
      desc: isEn 
        ? "Through École Supérieure d'Infotronique, we train the next wave of Haitian developers and engineers with world-class curriculum." 
        : "À travers l'École Supérieure d'Infotronique, nous formons la prochaine élite de l'ingénierie haïtienne avec un cursus de classe mondiale."
    },
    {
      icon: <Heart className="w-6 h-6 text-blue-400" />,
      title: isEn ? "Local Roots" : "Racines Locales",
      desc: isEn 
        ? "Kreyòl-first interfaces, MonCash integrations, Haitian context baked into every code asset and layout we write." 
        : "Interfaces en créole, intégrations de paiements MonCash/Natcash et prise en compte du contexte national dans chaque ligne de code."
    },
    {
      icon: <Globe className="w-6 h-6 text-emerald-400" />,
      title: isEn ? "Global Standards" : "Standards Internationaux",
      desc: isEn 
        ? "Pixel-perfect design, highly performant bundle sizes, accessibility — international quality delivered from day one." 
        : "Design pixel-perfect, poids de page optimisés, accessibilité totale — une qualité internationale garantie dès le premier jour."
    }
  ];

  return (
    <div className="py-16 bg-zinc-950 relative overflow-hidden dot-grid">
      <SEO
        title={isEn ? "About HaitianDev — Premium Caribbean Technology Studio" : "À Propos de HaitianDev — Studio d'Ingénierie Technologique"}
        description={isEn
          ? "Learn about HaitianDev, an elite tech studio born in Haiti. We combine local roots with global quality standards to deliver world-class digital solutions."
          : "Découvrez HaitianDev, studio d'ingénierie technologique d'élite en Haïti. Nous fusionnons l'innovation locale et l'excellence logicielle internationale."}
        schema={getOrganizationSchema()}
      />
      {/* Light highlights removed per user request */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-20">
          <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-500 hover:text-white transition-colors">
            <span>{isEn ? "← Back to home" : "← Retour à l'accueil"}</span>
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pt-3 pb-2 uppercase">
            {isEn ? "ABOUT US" : "À PROPOS DE NOUS"}
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-sans pt-2">
            {isEn
              ? "Haitian Dev is a premium tech studio born in Haiti with a global ambition — connecting our island to world-class technology."
              : "Haitian Dev est un studio technologique d'élite né en Haïti avec une ambition mondiale — connecter notre île aux standards technologiques internationaux."}
          </p>
        </div>

        {/* Mission and Vision Bento layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between bg-zinc-900/15 border border-zinc-900 rounded-3xl p-8 sm:p-10 glass-panel"
          >
            <div className="space-y-6">
              <span className="font-mono text-xs font-bold text-blue-500 uppercase tracking-widest block">
                {isEn ? "Our Core Purpose" : "Notre Raison d'être"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                {isEn ? "Our Mission" : "Notre Mission"}
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans">
                {isEn
                  ? "Build Haiti's digital future. Empower local businesses with world-class software, train the next generation of engineers, and export Haitian creativity to global markets."
                  : "Bâtir l'avenir numérique d'Haïti. Propulser les entreprises locales grâce à des logiciels de classe mondiale, former la prochaine génération d'ingénieurs et exporter la créativité haïtienne vers les marchés internationaux."}
              </p>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                {isEn
                  ? "We are driven by the deep belief that technology is the most powerful catalyst for our nation's economic and intellectual development."
                  : "Nous sommes animés par la conviction profonde que la technologie représente le plus puissant vecteur de développement économique et intellectuel pour notre nation."}
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between bg-linear-to-b from-primary/5 to-zinc-950 border border-primary/20 rounded-3xl p-8 sm:p-10"
          >
            <div className="space-y-6">
              <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest block">
                {isEn ? "Targeting the Horizon" : "Cap sur l'horizon"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                {isEn ? "Our Vision" : "Notre Vision"}
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans">
                {isEn
                  ? "A Haiti where technology is not imported but invented — where Port-au-Prince stands shoulder to shoulder with San Francisco, Lagos, and Bangalore."
                  : "Un Haïti où la technologie n'est pas importée mais inventée — où Port-au-Prince se dresse fièrement aux côtés de San Francisco, Lagos et Bangalore."}
              </p>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                {isEn
                  ? "Our long-term goal is to raise national technical expertise so that Haiti's digital infrastructure is entirely designed locally, autonomously and sovereignly."
                  : "Notre objectif à long terme est d'élever les compétences techniques nationales pour que les infrastructures numériques d'Haïti soient entièrement façonnées localement de manière autonome et souveraine."}
              </p>
            </div>
          </motion.div>

        </div>

        {/* Pillars feature block */}
        <div className="space-y-12">
          <div className="text-center space-y-3 mb-16">
            <span className="font-mono text-xs font-bold text-blue-500 uppercase tracking-widest block">
              {isEn ? "Our Commitments" : "Nos Engagements"}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white">
              {isEn ? "How We Shape the Future" : "Comment Nous Façonnons l'Avenir"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {corePillars.map((pil, idx) => (
              <Card
                key={idx}
                className="bg-zinc-900/30 border-zinc-900 p-8 flex items-start space-x-6 hover:border-zinc-850"
                hoverable={true}
              >
                <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl text-zinc-400 flex-shrink-0">
                  {pil.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-white">{pil.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{pil.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-28 bg-linear-to-r from-blue-950/20 via-zinc-900/5 to-red-950/10 border border-zinc-900 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
            {isEn ? "Let's Discuss Your Project" : "Discuter de votre projet"}
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            {isEn
              ? "Bridging the gap between Haiti and global technology — one project at a time. Let our expert engineers bring your vision to life."
              : "Combler le fossé entre Haïti et l'international technologique — un projet à la fois. Laissez nos ingénieurs experts donner vie à votre vision."}
          </p>
          <div className="pt-2">
            <Link to="/services">
              <Button variant="secondary" size="md">
                {t("navbar.engage_us")}
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
