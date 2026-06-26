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

        {/* Trustpilot Verified Showcase */}
        <div className="mt-24 space-y-8">
          <div className="text-center space-y-3 mb-10">
            <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest block">
              {isEn ? "Trust & Recognition" : "Confiance & Reconnaissance"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {isEn ? "Verified on Trustpilot" : "Avis Vérifiés sur Trustpilot"}
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto font-sans">
              {isEn 
                ? "Our commitment to software engineering excellence and client satisfaction, verified by real global reviews."
                : "Notre engagement envers l'excellence en ingénierie logicielle et la satisfaction client, certifié par des avis authentiques."}
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-4xl bg-linear-to-b from-zinc-900/40 via-zinc-950/60 to-black border border-zinc-800/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden group">
              {/* Decorative gradient glowing spots behind the content */}
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-300 group-hover:opacity-80" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-red-600/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-300 group-hover:opacity-80" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                {/* Brand rating column */}
                <div className="md:col-span-5 text-center md:text-left space-y-4 border-b md:border-b-0 md:border-r border-zinc-800/60 pb-6 md:pb-0 md:pr-8">
                  {/* Trustpilot Custom Star Logo */}
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-white">
                    <span className="text-[#00b67a] font-display font-extrabold text-2xl tracking-tight flex items-center gap-1.5">
                      <svg viewBox="0 0 100 100" className="w-7 h-7 fill-current text-[#00b67a]" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="50,5 64,38 98,38 70,59 81,92 50,72 19,92 30,59 2,38 36,38" />
                        <polygon points="50,5 50,72 19,92 30,59 2,38 36,38" className="opacity-80 fill-white" />
                      </svg>
                      Trustpilot
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center md:justify-start space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="p-1 bg-[#00b67a] rounded-xs text-white">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </span>
                      ))}
                    </div>
                    <div className="text-zinc-400 font-mono text-xs uppercase tracking-wider mt-2 block">
                      {isEn ? "Rating: 4.9 / 5 • Excellent" : "Note : 4.9 / 5 • Excellent"}
                    </div>
                  </div>

                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <svg className="w-3.5 h-3.5 mr-1.5 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {isEn ? "Verified Profile" : "Profil Vérifié"}
                    </span>
                  </div>
                </div>

                {/* Core trust value proposition */}
                <div className="md:col-span-7 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-3 text-center md:text-left">
                    <blockquote className="text-lg font-medium text-white italic">
                      {isEn 
                        ? "\"Their high-fidelity delivery, outstanding technical mastery, and elite engineering talent has truly transformed our digital products.\""
                        : "\"Leur haut niveau de finition, leur maîtrise technologique exceptionnelle et leur vivier d'ingénieurs d'élite ont véritablement transformé nos produits numériques.\""}
                    </blockquote>
                    <cite className="block text-xs font-mono text-zinc-500 uppercase tracking-widest not-italic">
                      — {isEn ? "Haitian D.E.V. Client Reviews" : "Avis Clients Haitian D.E.V."}
                    </cite>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center pt-2">
                    <a 
                      href="https://www.trustpilot.com/review/haitiandev.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 text-white font-bold text-sm uppercase tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-blue-900/20 hover:shadow-red-900/30 w-full sm:w-auto"
                    >
                      <span>{isEn ? "View us on Trustpilot" : "Consulter nos avis"}</span>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M5 13c0-5.02 4.08-9.1 9.1-9.1C18.2 3.9 21 6.4 21 10.1c0 3.7-2.8 6.2-6.9 6.2H12v3.8c0 .5-.4.9-.9.9H5V13zm7.1 1.3c2.7 0 4.4-1.5 4.4-3.8 0-2.3-1.7-3.8-4.4-3.8H7.1v7.6h5z" className="hidden" />
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                      </svg>
                    </a>
                    
                    <a 
                      href="https://www.trustpilot.com/review/haitiandev.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors py-2 px-3 hover:bg-zinc-900/60 rounded-lg"
                    >
                      {isEn ? "Write a Review" : "Laisser un Avis"} &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
