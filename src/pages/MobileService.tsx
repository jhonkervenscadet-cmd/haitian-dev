import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { 
  Smartphone, 
  Code, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  CloudLightning,
  QrCode,
  Sparkles,
  ArrowRight,
  Database,
  Grid
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getDetailedServiceSchema } from "../utils/seoSchemas";

export const MobileService: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const techStack = [
    { name: "Flutter & Dart", desc: "Expressive cross-platform framework", icon: <Grid className="w-5 h-5 text-sky-400" /> },
    { name: "React Native", desc: "Native-feeling interactive apps", icon: <Code className="w-5 h-5 text-blue-400" /> },
    { name: "iOS / Swift", desc: "Sleek Apple ecosystem performance", icon: <Smartphone className="w-5 h-5 text-white" /> },
    { name: "Android / Kotlin", desc: "Premium standalone native releases", icon: <Cpu className="w-5 h-5 text-emerald-450" /> },
    { name: "SQLite & Local DB", desc: "Offline-first resilient data model", icon: <Database className="w-5 h-5 text-violet-400" /> },
    { name: "Firebase Service", desc: "Live databases & secure push notifications", icon: <CloudLightning className="w-5 h-5 text-amber-500" /> },
    { name: "SMS Backup Alerts", desc: "Emergency offline cellular notifications", icon: <QrCode className="w-5 h-5 text-pink-400" /> },
    { name: "Uptime Security", desc: "Biometric secure login shielding", icon: <ShieldCheck className="w-5 h-5 text-teal-400" /> }
  ];

  const valueProps = [
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: isEn ? "High-Velocity 120 FPS Rendering" : "Animations Fluides à 120 FPS",
      desc: isEn 
        ? "We target maximum fluid performance. No lagging layouts or unoptimized loads. Clean native-feeling tactile touches."
        : "Nous visons des performances maximales. Finies les interfaces qui manquent de réactivité. Touche tactile fluide native."
    },
    {
      icon: <Database className="w-6 h-6 text-purple-400" />,
      title: isEn ? "Offline-First Core Local Syncs" : "Moteur Hors-Ligne 'Offline-First'",
      desc: isEn 
        ? "Your users can keep working even during active signal dropouts. Automatic data merging as soon as cell signal restores."
        : "Vos utilisateurs continuent de travailler sans réseau. Synchronisation automatique des données dès le retour de la connexion."
    },
    {
      icon: <QrCode className="w-6 h-6 text-emerald-400" />,
      title: isEn ? "Advanced Hardware & SDK Plugs" : "Exploitation Native des Capteurs",
      desc: isEn 
        ? "Full control over biometric secure logins, location-tracking GPS coordinates, cameras, and NFC sensors."
        : "Valorisation complète des capteurs natifs : empreinte digitale, reconnaissance faciale, coordonnées GPS et caméras."
    },
    {
      icon: <CloudLightning className="w-6 h-6 text-amber-500" />,
      title: isEn ? "Dual Store Publishing & Signing" : "Déploiement Clé-en-Main sur les Stores",
      desc: isEn 
        ? "We guide you from internal alpha testing up to compiling standalone APK release bundles and securing store validations."
        : "HaitianDev s'occupe de tout : compilation des paquets de production (APK, IPA), signature cryptée et publication."
    }
  ];

  return (
    <div className="py-20 bg-zinc-950 relative overflow-hidden dot-grid">
      <SEO
        title={isEn ? "Premium Mobile App Development — HaitianDev" : "Développement d'Applications Mobiles — HaitianDev"}
        description={isEn 
          ? "Build high performance iOS & Android apps using React Native, Flutter, Swift, and Kotlin. Seamless native integrations and offline support." 
          : "Créez des applications iOS et Android d'exception avec React Native, Flutter, Swift et Kotlin. Intégration MonCash/Natcash et mode hors-ligne."}
        schema={getDetailedServiceSchema(
          isEn ? "Mobile App Development Services" : "Développement d'Applications Mobiles Élite",
          isEn 
            ? "High-performance iOS and Android application engineering with cross-platform and native environments."
            : "Conception, développement et déploiement d'applications mobiles performantes sur App Store et Google Play.",
          "/services/app-dev"
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
            className="inline-flex items-center space-x-2 bg-red-950/40 border border-red-900/30 px-3.5 py-1 rounded-full text-xs font-mono text-red-400"
          >
            <Smartphone className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>{isEn ? "NATIVE & HYBRID MOBILE SYSTEMS" : "INGÉNIERIE MOBILE NATIVE & HYBRIDE"}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-black bg-gradient-to-r from-[#002f6c] to-[#c8102e] bg-clip-text text-transparent tracking-tight leading-[1.1]"
          >
            {isEn ? "Mobile Applications" : "Applications Mobiles"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {isEn 
              ? "We engineer premium iOS and Android applications utilizing React Native and Flutter. Outfitted with high-speed 120 FPS micro-interactions and smart offline-first capabilities."
              : "Nous architecturons des applications mobiles d'exception pour iOS et Android sur Flutter et React Native, dotées d'une réactivité tactile absolue et d'un mode hors-ligne intelligent."}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4"
          >
            <Link to="/services?select=app-dev">
              <button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold rounded-full px-8 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.03] active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-widest cursor-pointer">
                {isEn ? "Configure My Mobile App Specs" : "Lancer mon cahier des charges"}
              </button>
            </Link>
          </motion.div>
        </section>

        {/* SECTION 2: PRÉSENTATION DU SERVICE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold text-blue-500 uppercase tracking-wider">
                {isEn ? "TACTILE MOBILE LUXURY" : "LE LUXE TACTILE EN MAIN"}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isEn ? "Elite performance tailored for demanding environments" : "Une réactivité maximale adaptée aux défis réseaux mobiles"}
              </h2>
            </div>

            <div className="text-zinc-400 text-sm sm:text-base space-y-4 leading-relaxed font-sans">
              <p>
                {isEn 
                  ? "At HaitianDev, mobile application development leverages advanced cross-platform architectures to deploy beautiful interfaces simultaneously to iOS and Android. By choosing React Native or Flutter, we cut your production costs in half while guaranteeing a performance layer that matches native Swift and Kotlin guidelines."
                  : "Chez HaitianDev, le développement d'applications mobiles réunit le meilleur des écosystèmes iOS et Android. En employant des technologies hybrides performantes comme Flutter ou React Native, nous divisons vos temps et coûts de développement par deux, tout en assurant une fluidité visuelle rigoureusement comparable aux codes natifs Swift et Kotlin."}
              </p>
              <p>
                {isEn 
                  ? "Given Haiti's unique challenges, we make 'Offline-First' a fundamental design requirement, not an afterthought. Our mobile builds come integrated with compressed local databases (SQLite/WatermelonDB) to keep the app working offline. Tasks and edits are stored locally and merge to the cloud seamlessly behind the scenes once cellular coverage is restored."
                  : "Face aux variations d'alimentation et de réception réseau locales, nous concevons nos applications mobiles selon un principe stricte d'Offline-First. Les informations vitales se logent dans une base sécurisée cryptée locale (SQLite). Vos utilisateurs continuent à saisir leurs formulaires ou de visualiser leurs tableaux de ventes sans connexion, et la base fusionne de manière transparente dès le retour du signal."}
              </p>
              <p>
                {isEn 
                  ? "We enrich our apps with elite mobile hardware integrations. From scanning barcodes & QR codes instantly, logging live GPS route coordinates, protecting users with secure biometric FaceID/fingerprint checks, to triggering cellular SMS notification templates if the user has absolutely no data coverage."
                  : "Nous enrichissons nos applications mobiles de fonctionnalités nativisées d'élite. Qu'il s'agisse de capturer des codes-barres ou codes QR à la volée, de géo-localiser des livraisons, de protéger l'accès par biométrie, ou de relancer l'utilisateur par notification SMS de secours en cas de défaut temporaire de forfait internet."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card variant="glow-red" hoverable={false} className="p-1 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-blue-600/10 z-0" />
              <img 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80" 
                alt="Elite Mobile App Development UI Design Smartphone" 
                className="w-full h-[300px] sm:h-[450px] object-cover rounded-[22px] relative z-10 opacity-90 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </Card>
          </div>
        </section>

        {/* SECTION 3: LANGAGES, OUTILS ET TECHNOLOGIES UTILISÉS */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider block">
              {isEn ? "THE TECH ARSENAL" : "COMPÉTENCES ET TECHNOLOGIES MOBILES"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEn ? "Frameworks, databases and deployment pipelines" : "Outils et solutions de développement d'applications"}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {techStack.map((tech) => (
              <Card key={tech.name} variant="glass" className="p-4 sm:p-6 flex flex-col space-y-3 hover:border-red-500/25">
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
            <span className="font-mono text-xs font-bold text-blue-500 uppercase tracking-wider block">
              {isEn ? "MOBILE BENCHMARKS" : "EXCELLENCE INGENIERIE MOBILE"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEn ? "Engineered for real-world reliability" : "Conçu pour une fiabilité sans faille sur le terrain"}
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
                  <p className="text-zinc-455 leading-relaxed text-xs sm:text-sm">
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
            {/* Elegant side linear glow line */}
            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#002f6c] to-[#c8102e] z-35 rounded-r-3xl" />
            
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest block">
                {isEn ? "BRING YOUR APP TO LIFE" : "VOTRE APP DANS LES STORES"}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {isEn 
                  ? "Let us build a stunning native mobile experience" 
                  : "Déployons ensemble une application mobile de classe mondiale"}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {isEn 
                  ? "Define your features, select budget tiers with our live draft brief builder, and connect directly with our chief mobile engineers."
                  : "Configurez l'ensemble de vos fonctionnalités, définissez vos budgets cibles sur notre configurateur interactif et collaborez avec nos meilleurs ingénieurs mobiles."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link to="/services?select=app-dev">
                <button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold rounded-full px-8 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.03] active:scale-95 transition-all text-xs tracking-wider uppercase cursor-pointer">
                  {isEn ? "Begin Technical Specification" : "Concevoir mon brief mobile"}
                </button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="md" className="rounded-full px-8 py-3.5 text-xs tracking-wider uppercase cursor-pointer">
                  {isEn ? "See mobile portfolio" : "Découvrir nos créations"}
                </Button>
              </Link>
            </div>
            
            <p className="text-[11px] font-mono text-zinc-650">
              {isEn ? "Lead response time: < 24 Hours | Standalone builds in 4-6 Weeks" : "Délai d'analyse : < 24 Heures | Livraison moyenne de l'application : 4-6 Semaines"}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
