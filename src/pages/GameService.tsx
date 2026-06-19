import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { 
  Gamepad2, 
  Cpu, 
  Coins, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  Database,
  Grid,
  Laptop
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getDetailedServiceSchema } from "../utils/seoSchemas";

export const GameService: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const techStack = [
    { name: "Unity & C#", desc: "Industry standard 2D & 3D game engine", icon: <Gamepad2 className="w-5 h-5 text-pink-400" /> },
    { name: "Unreal Engine 5", desc: "Photorealistic environment lighting", icon: <Layers className="w-5 h-5 text-white" /> },
    { name: "Godot Engine", desc: "Lightweight fully-indexed native setups", icon: <Cpu className="w-5 h-5 text-blue-400" /> },
    { name: "WebGL & WebGPU", desc: "No-install direct browser active play", icon: <Laptop className="w-5 h-5 text-cyan-400" /> },
    { name: "Blender 3D", desc: "Custom 3D meshes & character modeling", icon: <Sparkles className="w-5 h-5 text-teal-400" /> },
    { name: "Physics Engines", desc: "Rigorous interactive vector gravity", icon: <Flame className="w-5 h-5 text-red-500" /> },
    { name: "Social Leaderboards", desc: "Score competition databases", icon: <Database className="w-5 h-5 text-sky-400" /> },
    { name: "Cross-Platform", desc: "Deploy to Web, mobiles & desktop Stores", icon: <Grid className="w-5 h-5 text-purple-400" /> }
  ];

  const valueProps = [
    {
      icon: <Laptop className="w-6 h-6 text-pink-400" />,
      title: isEn ? "No-Install WebGL Immediate Play" : "Expériences WebGL sans Téléchargement",
      desc: isEn 
        ? "Engage your audience instantly. Our WebGL games load directly inside normal web browsers with supreme compression."
        : "Captez l'attention immédiatement. Nos jeux WebGL se chargent dans n'importe quel navigateur mobile sans aucune installation."
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-400" />,
      title: isEn ? "Viral Gamified Marketing" : "Gamification & Marketing Viral",
      desc: isEn 
        ? "Transform your brand assets into immersive viral challenges. Great for product launches and organic reach."
        : "Convertissez l'univers de votre marque en défi interactif à forte viralité. Parfait pour les lancements de produits."
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-blue-500" />,
      title: isEn ? "Serious Games & Digital Training" : "Serious Games & Éducation Numérique",
      desc: isEn 
        ? "Simplify complex regional processes, training students and workers through beautiful educational gamification."
        : "Simplifiez des apprentissages complexes en formant vos collaborateurs ou étudiants par le jeu et des défis interactifs."
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-450" />,
      title: isEn ? "Optimized Asset Bundles" : "Optimisation Graphique Multi-Supports",
      desc: isEn 
        ? "High performance graphics rendered with extremely small file packaging. Stable play on budget handheld devices."
        : "Des décors et éclairages soignés compressés avec rigueur. Performance stable même sur des smartphones entrée de gamme."
    }
  ];

  return (
    <div className="py-20 bg-zinc-950 relative overflow-hidden dot-grid">
      <SEO
        title={isEn ? "Immersive Game Development — HaitianDev" : "Création de Jeux Vidéo d'Élite — HaitianDev"}
        description={isEn 
          ? "Build breathtaking 2D & 3D game experiences across consoles, computers and mobile screens using Unity and Unreal Engine 5." 
          : "Donnez vie à vos projets de jeux vidéo 2D & 3D (PC, consoles, smartphones) avec Unity, Unreal Engine 5 et des graphismes d'élite."}
        schema={getDetailedServiceSchema(
          isEn ? "Game Development Services" : "Création de Jeux Vidéo d'Élite",
          isEn 
            ? "Professional multi-platform interactive software and immersive game engineering."
            : "Production complète d'expériences interactives, modélisation 3D, intégration sonore et programmation de gameloop.",
          "/services/game-dev"
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
            className="inline-flex items-center space-x-2 bg-pink-950/40 border border-pink-900/30 px-3.5 py-1 rounded-full text-xs font-mono text-pink-450"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
            <span>{isEn ? "INTERACTIVE & VIRTUAL 3D SYSTEMS" : "INGÉNIERIE JEU VIDÉO & 3D INTERACTIVE"}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-black bg-gradient-to-r from-[#002f6c] to-[#c8102e] bg-clip-text text-transparent tracking-tight leading-[1.1]"
          >
            {isEn ? "Game Development" : "Jeu Vidéo"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {isEn 
              ? "We architect immersive WebGL advertising games, specialized training Serious Games, and high-quality 2D/3D custom mobile games built with Unity and Godot."
              : "Nous créons des jeux publicitaires WebGL à fort engagement, des serious games d'entraînement technique et des expériences ludiques 2D & 3D mobiles sur Unity et Godot."}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4"
          >
            <Link to="/services?select=game-dev">
              <button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold rounded-full px-8 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.03] active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-widest cursor-pointer">
                {isEn ? "Configure My Interactive Game Blueprint" : "Rédiger mon cahier des charges ludique"}
              </button>
            </Link>
          </motion.div>
        </section>

        {/* SECTION 2: PRÉSENTATION DU SERVICE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold text-pink-400 uppercase tracking-wider">
                {isEn ? "IMMERSIVE DIGITAL MAGIC" : "CRÉATION ET ENGAGEMENT LUDIQUE"}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isEn ? "Building rich interactive mechanics that captivate audiences" : "Façonner des univers interactifs captivants sans friction d'accès"}
              </h2>
            </div>

            <div className="text-zinc-400 text-sm sm:text-base space-y-4 leading-relaxed font-sans">
              <p>
                {isEn 
                  ? "At HaitianDev, our game development studio covers full artistic and engineering pipelines to design immersive experiences. Using powerful editors like Unity and Godot, we build compelling gameplay mechanics. We specialize in high-impact WebGL solutions, allowing users to play directly inside standard web browser pages with zero plugins or installation required."
                  : "Chez HaitianDev, notre studio de création de jeux vidéo prend en charge l'intégralité de la chaîne artistique et logicielle. Grâce aux moteurs professionnels Unity, Godot et Unreal Engine 5, nous codons des mécaniques de jeu (Gameplay) innovantes et hautement réactives. Nous maîtrisons particulièrement l'architecture WebGL/WebGPU."}
              </p>
              <p>
                {isEn 
                  ? "We craft the entire creative vision in-house. From storyboard scripting, 3D modeling and texturing inside Blender, to programming rigorous real-time physics engines and atmospheric adaptive sound scores. Connect high-capacity scoreboards, multi-player connectivity, and global leaderboards to drive friendly and intense user competition."
                  : "Nous orchestrons toute la direction artistique en interne : écriture de storyboards interactifs, modélisation et texturisation de maillages 3D sur Blender, programmation de moteurs de physiques stables, et enveloppes sonores adaptatives. En intégrant des bases de classement et défis connectés, nous stimulons l'esprit de compétition de votre public."}
              </p>
              <p>
                {isEn 
                  ? "Beyond entertainment, we build advanced 'Serious Games'. Gamification is a world-class training tool. Translate complex manuals, agricultural best practices, or financial compliance protocols into play-and-learn journeys. It improves retention up to 80% compared with flat slides or dry paperwork templates."
                  : "Au-delà du simple divertissement, nous innovons dans les Serious Games et l'éducation ludique (Gamification). Transformez des manuels techniques denses, des consignes de sécurité, ou des processus méthodologiques complexes en parcours d'apprentissage par l'épreuve ludique. Cela décuple l'attention et multiplie la mémorisation par 5."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card variant="glow-blue" hoverable={false} className="p-1 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#002f6c]/10 via-transparent to-[#c8102e]/10 z-0" />
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" 
                alt="Elite Gaming Setup Coding Graphic Performance" 
                className="w-full h-[300px] sm:h-[450px] object-cover rounded-[22px] relative z-10 opacity-90 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </Card>
          </div>
        </section>

        {/* SECTION 3: LANGAGES, OUTILS ET TECHNOLOGIES UTILISÉS */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-bold text-pink-400 uppercase tracking-wider block">
              {isEn ? "THE GAMING STACK" : "MOTEURS ET SOLUTIONS TECHNIQUES"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEn ? "Tools and tech we use to render virtual worlds" : "Environnements loguels et intégrations de rendu"}
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
              {isEn ? "THE ENGAGEMENT PILLARS" : "EXCELLENCE INGENIERIE JEU VIDÉO"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEn ? "Engineered to deliver high visual impact" : "Créer l'impact visuel et ludique adapté aux performances"}
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
            {/* Elegant luxury side-glow line */}
            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#002f6c] to-[#c8102e] z-35 rounded-r-3xl" />
            
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="font-mono text-xs font-bold text-pink-400 uppercase tracking-widest block">
                {isEn ? "START BUILDING YOUR UNIVERSE" : "DONNEZ VIE À VOTRE EXPÉRIENCE"}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {isEn 
                  ? "Let us architect your custom gamified solution" 
                  : "Développons ensemble un jeu vidéo marquant et mémorable"}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {isEn 
                  ? "Draft your gameplay priorities, outline budget goals with our live configuration assistant, and start playtesting soon."
                  : "Balisez votre projet, établissez vos budgets idéaux sur notre configurateur live, et commencez bientôt vos phases d'essai."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link to="/services?select=game-dev">
                <button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold rounded-full px-8 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.03] active:scale-95 transition-all text-xs tracking-wider uppercase cursor-pointer">
                  {isEn ? "Open Interactive Game Planner" : "Lancer le configurateur de jeu"}
                </button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="md" className="rounded-full px-8 py-3.5 text-xs tracking-wider uppercase cursor-pointer">
                  {isEn ? "Explore digital designs" : "Parcourir notre portfolio"}
                </Button>
              </Link>
            </div>
            
            <p className="text-[11px] font-mono text-zinc-650">
              {isEn ? "Lead response time: < 24 Hours | Prototype ready in 4-6 Weeks" : "Délai de réponse : < 24 Heures | Prototype jouable sous 4-6 Semaines"}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
