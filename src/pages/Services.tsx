import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  Smartphone,
  Sparkles,
  Gamepad2,
  CreditCard,
  MessageSquareCode,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Sparkle,
  FileCheck2,
  CheckSquare,
  Square,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import { saveCollectionItem } from "../utils/firebaseSync";
import { SERVICES_DATA, ServiceItem } from "../data/staticData";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getServicesSchema } from "../utils/seoSchemas";

// Firebase & Client auto-account registration imports
import { onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, User as FirebaseUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseEnabled } from "../lib/firebase";

export const Services: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const { serviceId } = useParams<{ serviceId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Map service ID to index or state
  const getInitialActiveService = (): string => {
    const searchParams = new URLSearchParams(location.search);
    const qService = searchParams.get("select") || searchParams.get("service");
    const targetId = serviceId || qService;
    if (!targetId) return "";
    // Match slug or id
    const found = SERVICES_DATA.find((s) => s.slug === targetId || s.id === targetId);
    return found ? found.id : "";
  };

  // Funnel States
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    company: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [funnelComplete, setFunnelComplete] = useState<boolean>(false);

  // Client Authentication & Account Creation States
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // Track Firebase Auth state to auto fill or conditionally show register fields
  useEffect(() => {
    if (isFirebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        if (user) {
          setContactInfo((prev) => ({
            ...prev,
            email: user.email || prev.email,
            name: user.displayName || prev.name || ""
          }));
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Sync initial state if route changes
  useEffect(() => {
    const active = getInitialActiveService();
    setSelectedService(active);
    if (active) {
      setStep(2);
      setTimeout(() => {
        const funnelElement = document.querySelector(".glass-panel");
        if (funnelElement) {
          funnelElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      setStep(1);
    }
  }, [serviceId, location.search]);

  const activeServiceObj = SERVICES_DATA.find((s) => s.id === selectedService);

  // Handlers
  const handleSelectService = (id: string) => {
    setSelectedService(id);
    setSelectedFeatures([]);
    setStep(2);
    // Silent navigate to match route
    const found = SERVICES_DATA.find((s) => s.id === id);
    if (found) {
      navigate(`/services/${found.slug}`, { replace: true });
    }
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFunnelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.name || !contactInfo.email) return;
    setAuthError("");

    // Validate password if user is not authenticated
    if (isFirebaseEnabled && auth && !currentUser) {
      if (!password) {
        setAuthError(isEn ? "Please configure a password for your secure client space." : "Veuillez configurer un mot de passe pour votre espace client.");
        return;
      }
      if (password.length < 6) {
        setAuthError(isEn ? "The password must be at least 6 characters." : "Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
      if (password !== confirmPassword) {
        setAuthError(isEn ? "Passwords do not match." : "Les mots de passe ne correspondent pas de manière identique.");
        return;
      }
    }

    setIsSubmitting(true);
    let createdUser: FirebaseUser | null = null;

    try {
      // 1. If not authenticated, auto-create client account
      if (isFirebaseEnabled && auth && !currentUser) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, contactInfo.email, password);
          createdUser = userCredential.user;

          // Send confirmation / verification email
          await sendEmailVerification(createdUser);

          // Save profile to Firestore 'users' collection
          if (db) {
            await setDoc(doc(db, "users", createdUser.uid), {
              id: createdUser.uid,
              fullName: contactInfo.name,
              email: contactInfo.email,
              role: "Client",
              accessStatus: "Pending",
              companyName: contactInfo.company || ""
            });
          }
        } catch (authErr: any) {
          console.error("Firebase auto-registration error:", authErr);
          if (authErr && authErr.code === "auth/email-already-in-use") {
            setAuthError(isEn
              ? "This email address is already bound to an account. Please sign in or use another email."
              : "Cette adresse e-mail est déjà associée à un compte. Veuillez vous connecter ou utiliser un autre e-mail.");
          } else {
            setAuthError(authErr.message || String(authErr));
          }
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Build the quote (devis)
      const activeServiceTitle = SERVICES_DATA.find(s => s.id === selectedService)?.title || "Service Custom";
      
      const newDevis = {
        id: `devis_${Date.now()}`,
        clientName: contactInfo.name,
        email: contactInfo.email,
        clientEmail: contactInfo.email, // double-secured key compatibility for rules and queries
        company: contactInfo.company || "",
        specs: `Features: ${selectedFeatures.join(', ') || 'Standard'}\nPhone: ${contactInfo.phone || 'N/A'}${createdUser ? '\nAccount: Auto-created Client space (Verification sent)' : ''}`,
        estimatedBudget: budget || "À définir",
        desiredDeadline: timeline || "Flexible",
        serviceType: activeServiceTitle,
        status: "Nouveau / En attente",
        createdAt: new Date().toISOString()
      };

      // Save to Firestore 'devis' collection as requested
      await saveCollectionItem("devis", "haitian_dev_devis_local", newDevis, []);
      
      // Mirror to local storage for local backup/legacy fallbacks
      const existingLegacy = JSON.parse(localStorage.getItem("haitian_dev_devis") || "[]");
      localStorage.setItem("haitian_dev_devis", JSON.stringify([...existingLegacy, newDevis]));
      
      setIsSubmitting(false);
      setFunnelComplete(true);
    } catch (err: any) {
      console.error("Firestore failed to record funnel quote:", err);
      setAuthError(err.message || String(err));
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setSelectedService("");
    setSelectedFeatures([]);
    setBudget("");
    setTimeline("");
    setContactInfo({ name: "", email: "", company: "", phone: "" });
    setFunnelComplete(false);
    setPassword("");
    setConfirmPassword("");
    setAuthError("");
    navigate("/services", { replace: true });
  };

  // Icon Map for Services list
  const iconMap: { [key: string]: any } = {
    Globe: <Globe className="w-8 h-8 text-blue-400" />,
    Smartphone: <Smartphone className="w-8 h-8 text-red-500" />,
    Sparkles: <Sparkles className="w-8 h-8 text-yellow-400" />,
    Gamepad2: <Gamepad2 className="w-8 h-8 text-pink-400" />,
    CreditCard: <CreditCard className="w-8 h-8 text-emerald-400" />
  };

  // French presets
  const frFeaturesPreset: { [key: string]: string[] } = {
    "web-design": [
      "Landing Page Corporate d'élite",
      "E-commerce avec checkout MonCash",
      "Plateforme SaaS et base de données sécurisée",
      "Interface d'administration & Analytics",
      "Système multilingue (Kreyòl, FR, EN)",
      "Optimisation bande passante / Mode 3G ultra-léger"
    ],
    "app-dev": [
      "Application Android uniquement (APK)",
      "Application iOS & Android multiplateforme",
      "Mode offline-first avec synchronisation locale",
      "Système de notifications push SMS",
      "Intégration d'appareil photo / géolocalisation",
      "Authentification biométrique sécurisée"
    ],
    "ai-automation": [
      "Transcription audio-vers-texte en créole",
      "Analyse intelligente de documents comptables",
      "Bot conversationnel d'IA avec reconnaissance de la voix",
      "Séquençage workflow automatisé d'entreprise",
      "Tableau d'analyse de données prévisionnelles"
    ],
    "game-dev": [
      "Mini-jeu promotionnel WebGL pour votre site web",
      "Serious Game éducatif pour mobiles",
      "Expérience 3D immersive sur navigateur",
      "Option de tableaux de score interconnectés"
    ]
  };

  // English presets
  const enFeaturesPreset: { [key: string]: string[] } = {
    "web-design": [
      "Corporate Landing Page d'élite",
      "E-commerce with MonCash payment integration",
      "SaaS active backend & secure transactional DB",
      "Full admin UI dashboards & user metrics",
      "Bilingual localized stack (Kreyòl, FR, EN)",
      "Bandwidth compression/ultra-light 3G speed limits"
    ],
    "app-dev": [
      "Native Android build (standalone APK release)",
      "Cross-platform hybrid iOS & Android apps",
      "Offline-first core engine and SQLite sync",
      "Reliable SMS notification alerts backup system",
      "Camera integration & tracking geolocation",
      "Biometric fingerprint secure auth workflows"
    ],
    "ai-automation": [
      "Audio Speech-to-text live Creole transcription",
      "Document scanning analytical models",
      "AI Voice assistant integration",
      "Autonomous automated task automation maps",
      "Predictive data overview tables dashboard"
    ],
    "game-dev": [
      "High impact WebGL promotional marketing games",
      "Interactive training Serious Games",
      "Fast 3D immersive layouts with WebGL",
      "Integrated dynamic leaderboards connectivity"
    ]
  };

  const featuresPreset = isEn ? enFeaturesPreset : frFeaturesPreset;

  const budgetOptions = [
    { label: isEn ? "Under $2,000" : "Moins de $2,000", value: "<2k" },
    { label: "$2,000 - $5,000", value: "2k-5k" },
    { label: "$5,000 - $15,000", value: "5k-15k" },
    { label: isEn ? "Above $15,000" : "Plus de $15,000", value: ">15k" }
  ];

  const timelineOptions = [
    { label: isEn ? "Less than 1 month" : "Moins d'un mois", value: "fast" },
    { label: isEn ? "1 to 3 months" : "1 à 3 mois", value: "medium" },
    { label: isEn ? "3 to 6 months" : "3 à 6 mois", value: "extended" },
    { label: isEn ? "No clear deadline" : "Je ne suis pas pressé", value: "flexible" }
  ];

  const activeServiceTitle = activeServiceObj
    ? (t(`data.services.${activeServiceObj.id}.title`) || activeServiceObj.title)
    : selectedService;

  return (
    <div className="py-16 relative bg-zinc-950 dot-grid min-h-[85vh]">
      <SEO
        title={isEn ? "Elite Software Services Configurator — HaitianDev" : "Configurateur de Services Logiciels Élite — HaitianDev"}
        description={isEn 
          ? "Configure your custom software engineering project. Pick your features, define your budget, and get an elite web, mobile, or AI service spec sheet." 
          : "Configurez votre projet logiciel sur-mesure. Choisissez vos fonctionnalités, définissez votre budget et pilotez votre brief technique Web, Mobile ou d'IA."}
        schema={getServicesSchema()}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-900/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-red-900/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page title area */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-blue-500 uppercase tracking-widest block">
            {isEn ? "Configure your project specs" : "Configurez votre projet"}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pb-2 uppercase tracking-tight">SERVICES</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {isEn 
              ? "Pick a service and start a tailored project brief in minutes. Choose an expertise to configure its technical settings and draft your elite specifications." 
              : "Choisissez une expertise afin de configurer ses paramètres techniques et concevoir votre cahier des charges d'élite."}
          </p>
        </div>

        {/* FUNNEL WORKFLOW */}
        <div className="max-w-4xl mx-auto bg-zinc-900/20 border border-zinc-900 rounded-3xl p-6 sm:p-10 shadow-2xl glass-panel relative overflow-hidden">
          
          {/* Header indicator bubbles */}
          {!funnelComplete && (
            <div className="flex items-center justify-between border-b border-zinc-900/50 pb-8 mb-8 text-xs font-mono text-zinc-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
              <div className="flex items-center space-x-2 shrink-0">
                <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] uppercase font-bold ${step >= 1 ? "bg-gradient-to-r from-blue-500 to-red-500 text-white" : "bg-zinc-900 text-zinc-600"}`}>1</span>
                <span>{isEn ? "Specialty" : "Spécialité"}</span>
              </div>
              <div className="w-4 sm:w-16 h-px bg-zinc-900 mx-2 shrink-0" />
              <div className="flex items-center space-x-2 shrink-0">
                <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] uppercase font-bold ${step >= 2 ? "bg-gradient-to-r from-blue-500 to-red-500 text-white" : "bg-zinc-900 text-zinc-600"}`}>2</span>
                <span>{isEn ? "Features" : "Fonctionnalités"}</span>
              </div>
              <div className="w-4 sm:w-16 h-px bg-zinc-900 mx-2 shrink-0" />
              <div className="flex items-center space-x-2 shrink-0">
                <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] uppercase font-bold ${step >= 3 ? "bg-gradient-to-r from-blue-500 to-red-500 text-white" : "bg-zinc-900 text-zinc-600"}`}>3</span>
                <span>{isEn ? "Budget & Time" : "Budget & Temps"}</span>
              </div>
              <div className="w-4 sm:w-16 h-px bg-zinc-900 mx-2 shrink-0" />
              <div className="flex items-center space-x-2 shrink-0">
                <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] uppercase font-bold ${step >= 4 ? "bg-gradient-to-r from-blue-500 to-red-500 text-white" : "bg-zinc-900 text-zinc-600"}`}>4</span>
                <span>Validation</span>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {funnelComplete ? (
              /* Success screen generating the project brief */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <FileCheck2 className="w-16 h-16 text-emerald-500 mx-auto animate-pulse" />
                  <h2 className="font-display text-2xl font-extrabold text-white">
                    {isEn ? "Technical Brief Ready!" : "Cahier des charges conçu !"}
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    {isEn 
                      ? "Your custom technical proposal has been successfully compiled and sent to our executive lead developers." 
                      : "Votre proposition technique interactive a été générée avec succès et transmise aux ingénieurs cadres d'Haitian Dev."}
                  </p>
                </div>

                {/* Simulated generated blueprint brief summary */}
                <div className="p-6 sm:p-8 bg-zinc-950/70 border border-zinc-900 rounded-2xl relative space-y-6">
                  {/* Digital Stamp watermark */}
                  <div className="absolute top-4 right-6 text-[10px] font-mono text-zinc-700 uppercase tracking-widest border border-zinc-900 px-2 py-0.5 rounded">
                    PROPOSAL_ID: HD-{Math.floor(1000 + Math.random() * 9000)}
                  </div>

                  <h3 className="font-display text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2 border-b border-zinc-900 pb-2">
                    {isEn ? "BLUEPRINT PROJECT SUMMARY" : "RÉSUMÉ DU CAHIER DES CHARGES"}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-zinc-600 block">{isEn ? "SELECTION" : "SÉLECTION"}</span>
                      <span className="text-zinc-300 font-bold">{activeServiceTitle}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block">{isEn ? "SENDER" : "EXPÉDITEUR"}</span>
                      <span className="text-zinc-300 font-bold">{contactInfo.name} ({contactInfo.company || (isEn ? "Individual" : "Personnel")})</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block">{isEn ? "BUDGET ALLOCATION" : "ENVELOPPE BUDGETAIRE"}</span>
                      <span className="text-zinc-300 font-bold">
                        {budgetOptions.find((b) => b.value === budget)?.label || (isEn ? "To be defined" : "À définir")}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block">{isEn ? "TIMEFRAME HORIZON" : "HORIZON TEMPOREL"}</span>
                      <span className="text-zinc-300 font-bold">
                        {timelineOptions.find((t) => t.value === timeline)?.label || (isEn ? "To be defined" : "À définir")}
                      </span>
                    </div>
                  </div>

                  {selectedFeatures.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-zinc-900">
                      <span className="text-xs font-mono text-zinc-600">
                        {isEn ? "TARGET FEATURES METRICS:" : "FONCTIONNALITÉS JALONNÉES:"}
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedFeatures.map((f, fIdx) => (
                          <li key={fIdx} className="flex items-center space-x-2 text-xs text-zinc-400">
                            <CheckSquare className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-zinc-900/35 p-3.5 rounded border border-zinc-850 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>Contact: {contactInfo.email} {contactInfo.phone && `| ${contactInfo.phone}`}</span>
                    <span className="text-emerald-500">Uptime validation: OK</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/">
                    <Button variant="outline" size="sm">
                      {isEn ? "Back to home" : "Retour à l'accueil"}
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={handleRestart}>
                    {isEn ? "Design another brief" : "Rédiger un autre brief"}
                  </Button>
                </div>
              </motion.div>
            ) : step === 1 ? (
              /* Step 1: Select Service */
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2 mb-2">
                  <h3 className="font-display text-lg font-extrabold text-white">
                    {isEn ? "Step 1: Choose your specialty" : "Étape 1 : Choisissez votre spécialité"}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {isEn 
                      ? "What type of modern, high-tier software experience do you want us to invent?" 
                      : "Quel type d'expérience numérique moderne souhaitez-vous concevoir avec Haitian Dev ?"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SERVICES_DATA.map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => handleSelectService(svc.id)}
                      className={`p-6 rounded-2xl border text-left cursor-pointer transition-all ${
                        selectedService === svc.id
                          ? "bg-blue-950/20 border-blue-600/90 shadow-[0_0_15px_rgba(0,47,108,0.2)]"
                          : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-850">
                          {iconMap[svc.icon] || <Globe className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-white text-sm">
                            {t(`data.services.${svc.id}.title`) || svc.title}
                          </h4>
                          <p className="text-zinc-500 text-xs mt-1">
                            {t(`data.services.${svc.id}.description`) || svc.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : step === 2 ? (
              /* Step 2: Selected features */
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-blue-400 bg-blue-950/40 border border-blue-900/50 px-2 py-0.5 rounded uppercase">
                      {isEn ? "Configuring: " : "Configuration : "} {activeServiceTitle}
                    </span>
                    <h3 className="font-display text-lg font-extrabold text-white pt-2">
                      {isEn ? "Step 2: Check target features" : "Étape 2 : Cochez les fonctionnalités visées"}
                    </h3>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setStep(1)} className="px-2.5 py-1 text-xs cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> {isEn ? "Change service" : "Changer de service"}
                  </Button>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                  {isEn 
                    ? "Check the specific interactive and architectural goals you want to integrate into this brief." 
                    : "Cochez les briques techniques et les exigences que vous désirez implémenter dans ce brief."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(featuresPreset[selectedService] || featuresPreset["web-design"]).map((feat, idx) => {
                    const isSelected = selectedFeatures.includes(feat);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleFeature(feat)}
                        className={`p-4 rounded-xl border text-left cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-red-500/5 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.1)] text-white"
                            : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-850"
                        }`}
                      >
                        <span className="text-xs sm:text-sm leading-snug">{feat}</span>
                        {isSelected ? (
                          <CheckCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0 ml-2" />
                        ) : (
                          <div className="w-4.5 h-4.5 rounded-full border border-zinc-800 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
                  <Button variant="ghost" size="sm" onClick={handlePrevStep} className="cursor-pointer">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {isEn ? "Back" : "Retour"}
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleNextStep} className="cursor-pointer">
                    {isEn ? "Next" : "Suivant"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ) : step === 3 ? (
              /* Step 3: Budget and timeframe selections */
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2 mb-2">
                  <h3 className="font-display text-lg font-extrabold text-white">
                    {isEn ? "Step 3: Budget & Timeframe" : "Étape 3 : Budget & Calendrier"}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {isEn 
                      ? "Choose indicative pricing boundaries and target deployment deadlines." 
                      : "Définissez vos enveloppes de coûts indicatives et vos contraintes d'agenda."}
                  </p>
                </div>

                {/* Budget selection block */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                    {isEn ? "Estimated funding boundaries (USD)" : "Allocation budget indicatif (USD)"}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {budgetOptions.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => setBudget(opt.value)}
                        className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                          budget === opt.value
                            ? "bg-red-950/20 border-red-500 text-white"
                            : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-850 text-zinc-400"
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold block">{opt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline selection block */}
                <div className="space-y-3 pt-4">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                    {isEn ? "Target deployment roadmap timeline" : "Calendrier attendu pour la mise en service"}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timelineOptions.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => setTimeline(opt.value)}
                        className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                          timeline === opt.value
                            ? "bg-red-950/20 border-red-500 text-white"
                            : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-850 text-zinc-400"
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold block">{opt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
                  <Button variant="ghost" size="sm" onClick={handlePrevStep} className="cursor-pointer">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {isEn ? "Back" : "Retour"}
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleNextStep} disabled={!budget || !timeline} className="cursor-pointer">
                    {isEn ? "Next" : "Suivant"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Step 4: Contact validation and brief compiling */
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2 mb-2">
                  <h3 className="font-display text-lg font-extrabold text-white">
                    {isEn ? "Step 4: Contact Details" : "Étape 4 : Validation du Devis"}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {isEn 
                      ? "Submit your contact credentials to register your custom brief and lock in executive planning." 
                      : "Saisissez vos informations de contact afin que nous puissions valider le jalon technique et vous envoyer la proposition chiffrée."}
                  </p>
                </div>

                <form onSubmit={handleFunnelSubmit} className="space-y-5">
                  {/* Connected User Notification if present */}
                  {currentUser && (
                    <div className="bg-emerald-555/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-3.5 text-left animate-fadeIn mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-white block mb-0.5 font-sans">
                          {isEn ? "Linked to Active Session" : "Associé à votre session active"}
                        </span>
                        <p className="text-zinc-500 font-mono">
                          {isEn 
                            ? `This quote request is associated with your account: ${currentUser.email}` 
                            : `Cette demande de devis sera enregistrée sous votre compte client : ${currentUser.email}`}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-zinc-500 font-bold">
                        {isEn ? "Your Full Name" : "Votre Nom Complet"}
                      </label>
                      <input
                        type="text"
                        required
                        name="name"
                        value={contactInfo.name}
                        onChange={handleContactChange}
                        placeholder={isEn ? "Alexander Dessalines" : "Jean-Jacques"}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-zinc-500 font-bold">
                        {isEn ? "Professional Email Address" : "Adresse Email Professionnelle"}
                      </label>
                      <input
                        type="email"
                        required
                        name="email"
                        value={contactInfo.email}
                        onChange={handleContactChange}
                        placeholder="client@enterprise.com"
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                        disabled={!!currentUser}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-zinc-500 font-bold">
                        {isEn ? "Company Name (Optional)" : "Nom de l'entreprise (Optionnel)"}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={contactInfo.company}
                        onChange={handleContactChange}
                        placeholder="Sankofa S.A."
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-zinc-500 font-bold">
                        {isEn ? "Phone Number (WhatsApp)" : "Numéro de Téléphone (WhatsApp)"}
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={contactInfo.phone}
                        onChange={handleContactChange}
                        placeholder="+509 3737-1234"
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Password Setup Section if there's no logged-in user */}
                  {!currentUser && (
                    <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-5 md:p-6 space-y-4 relative overflow-hidden group text-left animate-fadeIn">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
                      
                      <div className="flex items-center gap-2.5">
                        <KeyRound className="w-4 h-4 text-blue-500" />
                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          {isEn ? "Configure Secure Access Password" : "Configuration d'un mot de passe d'accès"}
                        </h4>
                      </div>
                      
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                        {isEn 
                          ? "Configure a password so that HaitianDev can automatically create your secure client space. You will receive an validation/confirmation link on your email address." 
                          : "Configurez un mot de passe afin qu'un compte client sécurisé soit automatiquement créé pour vous. Vous recevrez également un e-mail de validation pour confirmer l'accès."}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5 relative">
                          <label className="block text-[10px] font-mono uppercase text-zinc-500 font-bold">
                            {isEn ? "Password (min 6 chars)" : "Mot de passe (min 6 car.)"}
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="•••••••••"
                              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-3 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5 relative">
                          <label className="block text-[10px] font-mono uppercase text-zinc-500 font-bold">
                            {isEn ? "Confirm Password" : "Confirmation du mot de passe"}
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="•••••••••"
                              className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-3 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                            >
                              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-blue-500/5 border border-blue-500/10 rounded-xl px-4 py-2.5 text-[11px] text-blue-400 font-mono">
                        <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>{isEn ? "Security Layer: SSL, GDPR & HaitianDev d'élite vault" : "Couche Sécurité : Chiffrement SSL, GDPR & Coffre HaitianDev d'élite"}</span>
                      </div>
                    </div>
                  )}

                  {authError && (
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex items-center gap-3 text-left animate-fadeIn">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 animate-bounce" />
                      <span className="text-xs text-red-400 font-mono">{authError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-900 mt-6 font-mono">
                    <Button type="button" variant="ghost" size="sm" onClick={handlePrevStep} className="cursor-pointer">
                      <ArrowLeft className="w-4 h-4 mr-2" /> {isEn ? "Back" : "Retour"}
                    </Button>
                    <Button type="submit" variant="secondary" size="sm" disabled={isSubmitting} className="cursor-pointer">
                      {isSubmitting 
                        ? (isEn ? "Compiling tech brief..." : "Compilation du brief...") 
                        : (isEn ? "Generate & Send" : "Générer & Transmettre")}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
