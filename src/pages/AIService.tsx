import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { 
  Sparkles, 
  Cpu, 
  Brain, 
  MessageSquare, 
  Settings, 
  ChevronRight, 
  Database, 
  Bot, 
  Network, 
  BarChart3,
  Search,
  ShieldCheck
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getDetailedServiceSchema } from "../utils/seoSchemas";

export const AIService: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const techStack = [
    { name: "Kreyòl LLM Models", desc: "Fine-tuned regional dialect understanding", icon: <Brain className="w-5 h-5 text-purple-400" /> },
    { name: "Python & PyTorch", desc: "Solid data science core learning", icon: <Cpu className="w-5 h-5 text-yellow-400" /> },
    { name: "Llama-3 & Mistral", desc: "Open-source fine-tuning architecture", icon: <Network className="w-5 h-5 text-sky-400" /> },
    { name: "Gemini & OpenAI API", desc: "Advanced cognitive reasoning interfaces", icon: <Sparkles className="w-5 h-5 text-cyan-400" /> },
    { name: "WhatsApp Cloud Bot", desc: "Autonomous CRM text answering", icon: <MessageSquare className="w-5 h-5 text-emerald-450" /> },
    { name: "Computer Vision & OCR", desc: "Automated scanner reads bills", icon: <Search className="w-5 h-5 text-pink-400" /> },
    { name: "Predictive Analytics", desc: "Smart forward analytics charts", icon: <BarChart3 className="w-5 h-5 text-amber-500" /> },
    { name: "NVIDIA Tensor Cloud", desc: "High-throughput model execution", icon: <Bot className="w-5 h-5 text-teal-400" /> }
  ];

  const valueProps = [
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: isEn ? "Haitian Creole-Native AI Fine-Tuning" : "Modèles Kreyòl-Natifs sur-Mesure",
      desc: isEn 
        ? "We train models tailored for the local language. Accurate speech transcription and natural local text customer support."
        : "Nous entraînons nos IA pour parler et comprendre le créole haïtien. Transcription vocale et agent de support local ultra-fidèle."
    },
    {
      icon: <Bot className="w-6 h-6 text-emerald-400" />,
      title: isEn ? "Autonomous WhatsApp Chatbots" : "Assistants Intelligents WhatsApp & Web",
      desc: isEn 
        ? "Deploy bots that access your company parameters, answer customer inquiries 24/7, and catalog orders automatically."
        : "Déployez des agents conversationnels connectés à vos bases d'affaires, gérant le support client et les commandes 24h/24."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: isEn ? "Secure Regulatory Data Boundaries" : "Confidentialité & Souveraineté des Données",
      desc: isEn 
        ? "We enforce strict security and host isolated local instances, keeping your company records completely insulated."
        : "Nous appliquons une étanchéité absolue de données et un hébergement découplé pour préserver la confidentialité de vos processus."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-500" />,
      title: isEn ? "Predictive Business Automation" : "Automatisation & Analyses Prévisionnelles",
      desc: isEn 
        ? "Automate scanning invoices, predicting store sales curves, and sorting repetitive emails on auto-pilot."
        : "Automatisez la saisie de factures, analysez vos projections de ventes et triez automatiquement vos emails fastidieux."
    }
  ];

  return (
    <div className="py-20 bg-zinc-950 relative overflow-hidden dot-grid">
      <SEO
        title={isEn ? "Elite AI Solutions & Automation — HaitianDev" : "Solutions IA & Automatisation Élite — HaitianDev"}
        description={isEn 
          ? "Implement intelligent systems, predictive analytics, custom LLM integrations, and robust process automation for your enterprise." 
          : "Implémentez des systèmes intelligents : modèles prédictifs, chatbots sur-mesure, intégrations de LLM et automatisation d'élite."}
        schema={getDetailedServiceSchema(
          isEn ? "Artificial Intelligence & Automation" : "Intelligence Artificielle & Automatisation Élite",
          isEn 
            ? "Enterprise intelligence engineering including custom LLM fine-tuning and robotic automation processes."
            : "Conception, développement et de déploiement d'agents autonomes, de fine-tuning de LLM et d'algorithmes prédictifs.",
          "/services/ai-automation"
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
            className="inline-flex items-center space-x-2 bg-purple-950/40 border border-purple-900/30 px-3.5 py-1 rounded-full text-xs font-mono text-purple-400"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>{isEn ? "ARTIFICIAL INTELLIGENCE & BUSINESS AUTOMATION" : "INTELLIGENCE ARTIFICIELLE & AUTOMATISATION"}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-black bg-gradient-to-r from-[#002f6c] to-[#c8102e] bg-clip-text text-transparent tracking-tight leading-[1.1]"
          >
            {isEn ? "AI Solutions" : "Solutions IA"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {isEn 
              ? "We construct intelligent, Creole-aware LLM agents, train localized machine learning models, and orchestrate autonomous systems that automate your core business workflows."
              : "Nous entraînons des modèles de langage (LLM) créoles sur-mesure, concevons des agents intelligents autonomes et automatisons l'intégralité de vos opérations d'entreprise."}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4"
          >
            <Link to="/services?select=ai-automation">
              <button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold rounded-full px-8 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.03] active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-widest cursor-pointer">
                {isEn ? "Draft My Artificial Intelligence Blueprint" : "Rédiger mon brief technique IA"}
              </button>
            </Link>
          </motion.div>
        </section>

        {/* SECTION 2: PRÉSENTATION DU SERVICE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
                {isEn ? "INTELLIGENT BUSINESS ARCHITECTURES" : "SOUVERAINETÉ ET COGNITION MACHINE"}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isEn ? "We look past the hype to construct real mathematical workflows" : "Dépasser les tendances éphémères pour créer de la valeur réelle"}
              </h2>
            </div>

            <div className="text-zinc-400 text-sm sm:text-base space-y-4 leading-relaxed font-sans">
              <p>
                {isEn 
                  ? "At HaitianDev, artificial intelligence isn't about slapping generic subscription wrappers on third-party products. We build real custom machine learning logic, data ingestion pipelines, and semantic vector stores. Whether you need predictive inventory modeling or autonomous customer support pipelines, we deploy stable engines that keep you ahead of competitors."
                  : "Chez HaitianDev, l'Intelligence Artificielle s'écarte des simples intermédiaires d'API étrangers et sans valeur ajoutée. Nous structurons de véritables réseaux de neurones, des filières d'assimilation de données locales (Data Ingestion) et des indexations vectorielles sémantiques. Qu'il s'agisse de modéliser des flux de ventes ou de créer des agents cognitifs."}
              </p>
              <p>
                {isEn 
                  ? "We are the absolute pioneers of Creole-native LLM Fine-Tuning. Standard western AI models have zero local data from Haiti, translating into robotic or incorrect expressions. By assembling massive local corpuses, we fine-tune open models like Llama-3 and Mistral. This ensures your chatbot reads, writes, and vocalizes natural, beautiful, context-aware Haitian Creole."
                  : "Nous sommes les pionniers incontestés du perfectionnement d'IA en créole haïtien (Creole LLM Fine-Tuning). Les modèles standard d'outre-mer pâtissent d'un manque criant de données nationales, générant un phrasé robotique ou hors-sujet. En combinant d'immenses bases sémantiques locales et du fine-tuning sur Llama-3 ou Mistral, nous entraînons des IA d'élite parlant un créole authentique."}
              </p>
              <p>
                {isEn 
                  ? "We connect smart AI agents straight with your company's workflows. Program automatic document scanning (OCR) to read PDF bills instantly, automate WhatsApp business inquiries with live databases, or setup proactive notification alerts that predict when client contracts need replenishment."
                  : "Nous raccordons ces intelligences en direct à votre système opérationnel. Automatisez la lecture scanner (OCR) de formulaires de stocks, gérez la prise de commandes par reconnaissance vocale sur WhatsApp, et dotez vos conseillers physiques de synthèses automatiques analysant directement les besoins de vos clients."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card variant="glow-blue" hoverable={false} className="p-1 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-650/10 via-transparent to-red-650/10 z-0" />
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80" 
                alt="Elite Artificial Intelligence Cognitive Nodes Workspace" 
                className="w-full h-[300px] sm:h-[450px] object-cover rounded-[22px] relative z-10 opacity-90 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </Card>
          </div>
        </section>

        {/* SECTION 3: LANGAGES, OUTILS ET TECHNOLOGIES UTILISÉS */}
        <section className="space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider block">
              {isEn ? "THE COGNITIVE EMBED" : "COMPÉTENCES ET TECHNOLOGIES COGNITIVES"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEn ? "Models, platforms and frameworks we orchestrate" : "Modèles, frameworks de calcul et structures connectés"}
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
              {isEn ? "WHY TRUST HAITIANDEV IA SYSTEMS" : "SÉCURITÉ ET EXPERTISE DE CONFORT"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEn ? "Advanced AI solutions that work for you" : "Une intelligence locale mise au service de votre croissance"}
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
            {/* Side-glow strip accentuating custom luxury design aesthetics */}
            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#002f6c] to-[#c8102e] z-35 rounded-r-3xl" />
            
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="font-mono text-xs font-bold text-purple-500 uppercase tracking-widest block">
                {isEn ? "EMBARK ON INTELLIGENT SCALE" : "AUTOMATISEZ DÈS MAINTENANT"}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {isEn 
                  ? "Architect an intelligent automation system today" 
                  : "Mettez la puissance des agents intelligents au service de votre marque"}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {isEn 
                  ? "Configure your target algorithms, select integrations with our interactive digital assistant, and map complete system structures."
                  : "Balisez vos objectifs d'automatisation, découvrez les possibilités d'intégration avec nos modèles, et concevez l'architecture technique idéale."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link to="/services?select=ai-automation">
                <button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white font-semibold rounded-full px-8 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.03] active:scale-95 transition-all text-xs tracking-wider uppercase cursor-pointer">
                  {isEn ? "Begin AI Blueprint specifications" : "Établir mes spécifications IA"}
                </button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="md" className="rounded-full px-8 py-3.5 text-xs tracking-wider uppercase cursor-pointer">
                  {isEn ? "Explore achievements" : "Voir nos réussites"}
                </Button>
              </Link>
            </div>
            
            <p className="text-[11px] font-mono text-zinc-650">
              {isEn ? "Lead response time: < 24 Hours | Prototype delivered in 3-5 Weeks" : "Délai d'étude : < 24 Heures | Prototype fonctionnel en 3-5 Semaines"}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
