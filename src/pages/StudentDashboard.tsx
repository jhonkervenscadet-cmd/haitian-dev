import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  Settings, 
  LogOut, 
  Search, 
  Star, 
  Home, 
  UserCheck, 
  MessageSquare, 
  Loader2, 
  X, 
  Check, 
  ChevronRight, 
  FileText, 
  Eye, 
  ExternalLink 
} from "lucide-react";
import { db, isFirebaseEnabled, auth } from "../lib/firebase";
import { onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { BLOG_DATA, DOCS_DATA, FormationItem } from "../data/staticData";
import { loadCollection, subscribeToCollection, saveCollectionItem } from "../utils/firebaseSync";
import { normalizeArticle } from "../utils/normalizeArticle";

const TABS = [
  { id: "learning", label: "Espace Éducatif", icon: BookOpen },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "assignments", label: "Mes Devoirs", icon: GraduationCap },
  { id: "sessions", label: "Prochaines Sessions", icon: Clock },
  { id: "settings", label: "Paramètres", icon: Settings },
];

const DEFAULT_FORMATIONS: FormationItem[] = [
  {
    id: "f1",
    titre: "Architecture Logicielle Full-Stack Élite",
    formateur: "Dr. Jean-Marie Altema",
    dateDebut: "2026-09-01",
    duree: "6 Mois",
    niveau: "AVANCÉ",
    organisme: "École Supérieure d'Infotronique d'Haïti (ESIH)",
    lienInscription: "",
    urlImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "f2",
    titre: "Intelligence Artificielle & Traitement Automatique du Kreyòl (NLP/TTS)",
    formateur: "Prof. Davidson Jean-Pierre",
    dateDebut: "2026-10-15",
    duree: "4 Mois",
    niveau: "INTERMÉDIAIRE",
    organisme: "HaitianDev Academy & ESIH",
    lienInscription: "",
    urlImage: "https://images.unsplash.com/photo-1677442136019-21780ecad99a?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "f3",
    titre: "Fintech & API Intégration MonCash / Natcash",
    formateur: "Ing. Stevenson Pierre",
    dateDebut: "2026-11-10",
    duree: "3 Mois",
    niveau: "DÉBUTANT",
    organisme: "École Supérieure d'Infotronique d'Haïti (ESIH)",
    lienInscription: "",
    urlImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80"
  }
];

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("learning");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const navigate = useNavigate();

  // Load and listen to authenticated student profile
  const [studentInfo, setStudentInfo] = useState(() => {
    const savedUserRaw = localStorage.getItem("haitiandev_user");
    if (savedUserRaw) {
      const savedUser = JSON.parse(savedUserRaw);
      return {
        name: savedUser.name || "Stevenson",
        email: savedUser.email || "stevenson@gmail.com"
      };
    }
    return {
      name: "Stevenson",
      email: "stevenson@gmail.com"
    };
  });

  // Database bound states
  const [formations, setFormations] = useState<FormationItem[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [learningLoading, setLearningLoading] = useState(true);

  // Apprentissage Sub-tabs
  const [learningSubTab, setLearningSubTab] = useState<"formations" | "articles" | "docs">("formations");
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive details overlays
  const [enrollingFormation, setEnrollingFormation] = useState<FormationItem | null>(null);
  const [enrollMotivation, setEnrollMotivation] = useState("");
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  // Settings states
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState({ text: "", type: "" });

  // Sync profile details if auth status changes
  React.useEffect(() => {
    if (!isFirebaseEnabled) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setStudentInfo({
          name: usr.displayName || usr.email?.split("@")[0] || "Stevenson",
          email: usr.email || "stevenson@gmail.com"
        });
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Fetch messages directed to the logged-in student
  React.useEffect(() => {
    const fetchLocalMessages = () => {
      const savedMessagesRaw = localStorage.getItem("haitiandev_support_messages_local");
      if (savedMessagesRaw) {
        try {
          const cached = JSON.parse(savedMessagesRaw) || [];
          const filtered = cached.filter((m: any) => 
            (m.recipientEmail && m.recipientEmail.toLowerCase() === studentInfo.email.toLowerCase()) || 
            (m.email && m.email.toLowerCase() === studentInfo.email.toLowerCase())
          );
          filtered.sort((a: any, b: any) => {
            const timeA = new Date(a.timestamp || 0).getTime();
            const timeB = new Date(b.timestamp || 0).getTime();
            return timeB - timeA;
          });
          setMessages(filtered);
        } catch (e) {
          console.error("Local messages parse error:", e);
        }
      }
      setMessagesLoading(false);
    };

    if (!isFirebaseEnabled || !db) {
      fetchLocalMessages();
      // Listen for updates also on the local storage messages
      window.addEventListener("haitian_messages_updated", fetchLocalMessages);
      return () => {
        window.removeEventListener("haitian_messages_updated", fetchLocalMessages);
      };
    }

    const q = query(
      collection(db, "messages"),
      where("recipientEmail", "==", studentInfo.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort in-memory by timestamp descending
      fetchedMessages.sort((a: any, b: any) => {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      });

      setMessages(fetchedMessages);
      setMessagesLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      fetchLocalMessages();
    });

    return () => unsubscribe();
  }, [studentInfo.email, isFirebaseEnabled, db]);

  // Sync dynamic collections: formations, articles, docs, registrations (devis)
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const forms = await loadCollection<any>("formations", "haitiandev_formations_local", DEFAULT_FORMATIONS);
        setFormations(forms);

        const arts = await loadCollection<any>("articles", "haitiandev_articles_local", BLOG_DATA);
        setArticles(arts.map(normalizeArticle));

        const dc = await loadCollection<any>("docs", "haitiandev_docs_local", DOCS_DATA);
        setDocs(dc);

        setLearningLoading(false);
      } catch (err) {
        console.error("Error loading curriculum databases:", err);
        setLearningLoading(false);
      }
    };
    loadData();

    // Subscribe to updates real-time
    const unsubscribeFormations = subscribeToCollection<any>("formations", "haitiandev_formations_local", (data) => {
      setFormations(data);
    }, DEFAULT_FORMATIONS);

    const unsubscribeArticles = subscribeToCollection<any>("articles", "haitiandev_articles_local", (data) => {
      setArticles(data.map(normalizeArticle));
    }, BLOG_DATA);

    const unsubscribeDocs = subscribeToCollection<any>("documents", "haitiandev_documents_local", (data) => {
      setDocs(data.map((d: any) => ({
        ...d,
        description: d.description || d.summary || ""
      })));
    }, []);

    const unsubscribeEnrollments = subscribeToCollection<any>("devis", "haitian_dev_devis_local", (data) => {
      const filtered = data.filter((d: any) => d.email === studentInfo.email);
      setEnrollments(filtered);
    }, []);

    return () => {
      unsubscribeFormations();
      unsubscribeArticles();
      unsubscribeDocs();
      unsubscribeEnrollments();
    };
  }, [studentInfo.email]);

  // Handle Password Reset by Email
  const handleSendPasswordResetEmail = async () => {
    if (!studentInfo?.email || !auth) {
      setSettingsMessage({ text: "Erreur: Utilisateur non authentifié ou email manquant.", type: "error" });
      return;
    }
    
    setPasswordUpdateLoading(true);
    setSettingsMessage({ text: "", type: "" });
    try {
      await sendPasswordResetEmail(auth, studentInfo.email);
      setSettingsMessage({ text: "Un email de réinitialisation a été envoyé à votre adresse.", type: "success" });
    } catch (err: any) {
      console.error("Error sending password reset email:", err);
      // More explicit error mapping to help users
      let errMsg = err.message;
      if (err.code === "auth/user-not-found") {
          errMsg = "Compte non trouvé pour cet email.";
      }
      setSettingsMessage({ text: `Erreur: ${errMsg}`, type: "error" });
    } finally {
      setPasswordUpdateLoading(false);
    }
  };

  // Handle Enrollment Action
  const handleEnroll = async (formation: FormationItem) => {
    try {
      const newEnrollment = {
        id: `enroll_${Date.now()}`,
        clientName: studentInfo.name,
        email: studentInfo.email,
        company: "Student",
        specs: `Motivation : ${enrollMotivation || "Aucune motivation spécifique rédigée."}\nCourse : ${formation.titre}`,
        estimatedBudget: "Programme de Formation Académique",
        desiredDeadline: "Immediate",
        serviceType: `Formation: ${formation.titre}`,
        status: "Nouveau / En attente",
        createdAt: new Date().toISOString()
      };

      const updated = await saveCollectionItem("devis", "haitian_dev_devis_local", newEnrollment, enrollments);
      setEnrollments(updated);

      setEnrolledSuccess(true);
      setTimeout(() => {
        setEnrolledSuccess(false);
        setEnrollingFormation(null);
        setEnrollMotivation("");
      }, 2500);
    } catch (err) {
      console.error("Error saving lead student enrollment:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white pt-20 lg:pt-12 pb-12 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-red-600 p-[1px]">
              <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center text-[10px] font-black italic tracking-tighter">
                JD
              </div>
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-200">Dashboard Étudiant</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-white/5 rounded-xl border border-white/10 text-white"
          >
            {isMobileMenuOpen ? <LogOut className="w-5 h-5 rotate-180" /> : <div className="space-y-1.5"><div className="w-5 h-0.5 bg-white" /><div className="w-5 h-0.5 bg-white" /></div>}
          </button>
        </div>

        {/* Mobile Slide-out Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden"
              />
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0c0c12] z-[120] lg:hidden p-8 border-r border-white/5 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-12">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-red-600 p-[1px]">
                    <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center text-sm font-black italic tracking-tighter">
                      JD
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold text-white tracking-tight">John Doe</h2>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Premium Student</p>
                  </div>
                </div>

                <nav className="space-y-2 flex-grow">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium transition-all
                          ${activeTab === tab.id 
                            ? "bg-white text-black shadow-lg" 
                            : "text-zinc-500 hover:text-white hover:bg-white/5"}
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => navigate("/")}
                    className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium text-zinc-500 hover:text-white hover:bg-white/5 transition-all mt-4 border border-white/5"
                  >
                    <Home className="w-4 h-4" />
                    Retour à l'accueil
                  </button>
                </nav>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all">
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Sidebar Navigation - Desktop only */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="bg-[#0c0c12] border border-white/5 rounded-3xl p-6 sticky top-28 overflow-hidden">
            <button 
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all mb-4 border border-white/5"
            >
              <Home className="w-3.5 h-3.5" />
              Retour à Home
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4 group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 p-[1px]">
                  <div className="w-full h-full bg-black rounded-[15px] flex items-center justify-center text-2xl font-black italic tracking-tighter">
                    JD
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#0c0c12] rounded-full shadow-lg shadow-emerald-500/20" title="En ligne" />
              </div>
              <h2 className="font-bold text-lg tracking-tight">John Doe</h2>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Étudiant Premium</p>
            </div>
            
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
                      ${activeTab === tab.id 
                        ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] scale-[1.02]" 
                        : "text-zinc-500 hover:text-white hover:bg-white/5"}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>

        </div>

        {/* Main Content Area */}
        <div className="flex-grow space-y-8">
          {/* Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Cours Terminés", value: "4", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { label: "Heures Passées", value: "128h", icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
              { label: "Projets Validés", value: "12", icon: Star, color: "text-amber-400", bg: "bg-amber-400/10" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0c0c12] border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 hover:border-white/10 transition-all">
                <div className={`p-3 md:p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black tracking-tight">{stat.value}</div>
                  <div className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {activeTab === "learning" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-left"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">Votre Espace Apprentissage</h2>
                <div className="relative group w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder={
                      learningSubTab === "formations" 
                        ? "Chercher une formation..." 
                        : learningSubTab === "articles" 
                          ? "Chercher un article..." 
                          : "Chercher un guide..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-blue-500/50 transition-all w-full font-sans tracking-tight"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Learning sub-navigation */}
              <div className="flex border-b border-white/5 gap-2 relative">
                {[
                  { id: "formations", label: "🏫 Formations d'Élite", count: formations.length },
                  { id: "articles", label: "✍️ Articles Tech", count: articles.length },
                  { id: "docs", label: "📖 Guides & Docs", count: docs.length }
                ].map((slab) => (
                  <button
                    key={slab.id}
                    onClick={() => {
                      setLearningSubTab(slab.id as any);
                      setSearchQuery("");
                    }}
                    className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider relative transition-all ${
                      learningSubTab === slab.id 
                        ? "text-[#00E5FF]" 
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <span>{slab.label} <span className="opacity-40 font-sans font-normal">({slab.count})</span></span>
                    {learningSubTab === slab.id && (
                      <motion.div 
                        layoutId="learningActiveSubLine" 
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_8px_rgba(0,229,255,0.6)]" 
                      />
                    )}
                  </button>
                ))}
              </div>

              {learningLoading ? (
                <div className="bg-[#0c0c12] border border-white/5 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                  <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest animate-pulse">Synchronisation des bases de connaissances...</p>
                </div>
              ) : (
                <div>
                  {/* Formations list */}
                  {learningSubTab === "formations" && (
                    <div>
                      {formations.filter(f => 
                        (f.titre || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (f.formateur || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (f.organisme || "").toLowerCase().includes(searchQuery.toLowerCase())
                      ).length === 0 ? (
                        <div className="bg-[#0c0c12] border border-white/5 rounded-3xl p-12 text-center text-zinc-500">
                          Aucune formation correspondante n'a été trouvée.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {formations.filter(f => 
                            (f.titre || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (f.formateur || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (f.organisme || "").toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((f) => {
                            const registration = enrollments.find(e => e.serviceType === `Formation: ${f.titre}`);
                            return (
                              <div key={f.id} className="bg-[#0c0c12] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all flex flex-col group relative">
                                <div className="h-44 relative overflow-hidden">
                                  <img 
                                    src={f.urlImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"} 
                                    alt={f.titre} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-transparent to-transparent" />
                                  
                                  {/* Level Badge */}
                                  <div className="absolute top-4 left-4">
                                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-[#00E5FF]">
                                      {f.niveau}
                                    </span>
                                  </div>
                                  
                                  {/* Status Badge */}
                                  {registration && (
                                    <div className="absolute top-4 right-4">
                                      <span className={`px-2.5 py-1 backdrop-blur-md rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider border ${
                                        registration.status === "Terminé" || registration.status === "Validé" || registration.status === "Actif"
                                          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                                          : "bg-blue-500/20 border-blue-500/30 text-blue-400"
                                      }`}>
                                        {registration.status === "Nouveau / En attente" ? "En attente" : registration.status}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="p-6 flex-grow flex flex-col justify-between space-y-4 text-left">
                                  <div className="space-y-1.5">
                                    <h4 className="text-base font-bold text-white tracking-tight line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">{f.titre}</h4>
                                    <p className="text-[11px] text-zinc-500 font-mono">Instructeur : <span className="text-zinc-300">{f.formateur}</span></p>
                                  </div>
                                  
                                  <div className="pt-4 border-t border-white/5 space-y-1.5 text-xs text-zinc-400 font-sans">
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Durée :</span>
                                      <span className="text-zinc-300 font-semibold">{f.duree}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Commence le :</span>
                                      <span className="text-zinc-300 font-semibold">{f.dateDebut}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Organisme :</span>
                                      <span className="text-zinc-300 font-semibold">{f.organisme}</span>
                                    </div>
                                  </div>
                                  
                                  {registration ? (
                                    <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-center">
                                      <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                                        <Check className="w-4 h-4" /> Inscription Enregistrée
                                      </p>
                                      <p className="text-[10px] text-zinc-500 mt-1 font-mono">Statut académique : {registration.status === "Nouveau / En attente" ? "En cours de validation" : registration.status}</p>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => setEnrollingFormation(f)}
                                      className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
                                    >
                                      S'inscrire à ce programme <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Articles list */}
                  {learningSubTab === "articles" && (
                    <div>
                      {articles.filter(a => 
                        (a.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (a.summary || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (a.category || "").toLowerCase().includes(searchQuery.toLowerCase())
                      ).length === 0 ? (
                        <div className="bg-[#0c0c12] border border-white/5 rounded-3xl p-12 text-center text-zinc-500">
                          Aucun article correspondant n'a été trouvé.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {articles.filter(a => 
                            (a.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (a.summary || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (a.category || "").toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((art) => (
                            <div 
                              key={art.id} 
                              className="bg-[#0c0c12] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all flex flex-col justify-between group cursor-pointer text-left" 
                              onClick={() => setSelectedArticle(art)}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider">
                                    {art.category}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-600">{art.readTime || "5 min"} de lecture</span>
                                </div>
                                
                                <h4 className="text-base font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors duration-250 leading-snug line-clamp-2">{art.title}</h4>
                                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-sans">{art.summary}</p>
                              </div>
                              
                              <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-400 select-none">
                                    {(art.author?.name || "HD")[0]}
                                  </div>
                                  <span className="text-[10px] text-zinc-400 font-medium">{art.author?.name || "HaitianDev Team"}</span>
                                </div>
                                
                                <span className="text-[10px] text-blue-400 font-mono flex items-center gap-1 group-hover:underline">
                                  Lire l'article <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Docs list */}
                  {learningSubTab === "docs" && (
                    <div>
                      {docs.filter(d => 
                        (d.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (d.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (d.description || "").toLowerCase().includes(searchQuery.toLowerCase())
                      ).length === 0 ? (
                        <div className="bg-[#0c0c12] border border-white/5 rounded-3xl p-12 text-center text-zinc-500">
                          Aucune ressource de documentation trouvée.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {docs.filter(d => 
                            (d.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (d.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (d.description || "").toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((doc) => (
                            <div 
                              key={doc.id} 
                              className="bg-[#0c0c12] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex items-start gap-4 cursor-pointer group text-left" 
                              onClick={() => setSelectedDoc(doc)}
                            >
                              <div className="p-3 bg-blue-600/5 border border-blue-500/10 rounded-xl text-blue-400 group-hover:bg-[#00E5FF]/10 group-hover:text-[#00E5FF] transition-colors">
                                <FileText className="w-5 h-5" />
                              </div>
                              
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <span className="text-[9px] font-mono text-[#00E5FF] uppercase tracking-wider">{doc.category}</span>
                                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-all tracking-tight truncate">{doc.title}</h4>
                                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-sans">{doc.description}</p>
                                <span className="inline-block text-[10px] text-blue-500 group-hover:underline pt-1 font-mono">
                                  Ouvrir le guide &rarr;
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "assignments" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0c0c12] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 lg:p-16 text-center"
            >
              <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                <GraduationCap className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Aucun devoir en attente</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
                Félicitations ! Vous avez complété tous vos devoirs assignés pour cette semaine académique.
              </p>
            </motion.div>
          )}

          {activeTab === "sessions" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {[
                { time: "Demain, 18:00", title: "Q&A: Architecture React", platform: "Zoom", status: "Confirmé" },
                { time: "Vendredi, 15:30", title: "Atelier: Backend avec Express", platform: "Google Meet", status: "Prévu" },
              ].map((session, i) => (
                <div key={i} className="bg-[#0c0c12] border border-white/5 rounded-2xl md:rounded-[2rem] p-5 md:p-7 lg:p-8 flex flex-col sm:flex-row justify-between items-center group hover:bg-white/[0.03] transition-all gap-4 md:gap-6">
                  <div className="flex items-center gap-4 md:gap-8 w-full sm:w-auto">
                    <div className="text-center sm:min-w-[90px] md:min-w-[100px] bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
                      <div className="text-blue-500 font-black text-xs md:text-sm tracking-tight">{session.time.split(',')[0]}</div>
                      <div className="text-[9px] md:text-[10px] text-zinc-500 font-mono uppercase mt-1 tracking-widest">{session.time.split(',')[1]}</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-base md:text-lg tracking-tight">{session.title}</h4>
                      <p className="text-[10px] md:text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Plateforme : {session.platform}</p>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-blue-600 rounded-xl text-[10px] md:text-xs font-bold hover:bg-blue-50 transition-colors hover:text-black shrink-0">
                    Rejoindre
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold border-l-4 border-blue-600 pl-4">Boîte de Réception</h2>
              </div>

              {messagesLoading ? (
                <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                  <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Chargement de vos messages académiques...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-20 text-center">
                  <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 text-sm">Vous n'avez pas de nouveaux messages des instructeurs.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="bg-[#0c0c12] border border-white/5 rounded-2xl md:rounded-[2rem] p-6 md:p-8 hover:border-white/10 transition-all space-y-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Instructeur : {msg.senderName}</div>
                            <h4 className="text-base font-bold text-white">{msg.subject}</h4>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 self-end md:self-center">{new Date(msg.timestamp).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' })}</div>
                      </div>
                      <p className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed pl-2 border-l border-white/5 mt-2">
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <h2 className="text-xl font-bold border-l-4 border-blue-600 pl-4">Paramètres du Compte</h2>
              </div>

              {settingsMessage.text && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-2xl border ${settingsMessage.type === "success" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-red-500/5 border-red-500/20 text-red-400"} text-sm font-mono flex items-center gap-3`}
                >
                  <div className={`w-2 h-2 rounded-full ${settingsMessage.type === "success" ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                  {settingsMessage.text}
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Public Info */}
                <div className="p-5 md:p-7 lg:p-8 rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-[#0c0c12] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h3 className="text-base md:text-lg font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-blue-500" />
                    <span>Profil Public</span>
                  </h3>
 
                  <form className="space-y-4 md:space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Profil mis à jour !"); }}>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center mb-6 md:mb-8">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 p-[1px] shrink-0">
                        <div className="w-full h-full bg-black rounded-[15px] flex items-center justify-center text-xl md:text-2xl font-black italic tracking-tighter">
                          JD
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <button type="button" className="text-[9px] md:text-[10px] bg-white/5 hover:bg-white/10 px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl font-black uppercase tracking-widest text-white transition-all border border-white/5">
                          Changer l'avatar
                        </button>
                        <p className="text-[9px] md:text-[10px] text-zinc-600 font-mono uppercase tracking-widest text-center sm:text-left">JPG, PNG ou GIF • Max 2MB</p>
                      </div>
                    </div>
 
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-1">Nom Complet</label>
                      <input 
                        type="text" 
                        defaultValue={studentInfo.name} 
                        onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-sans" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-1">Adresse Email</label>
                      <input 
                        type="email" 
                        value={studentInfo.email} 
                        readOnly 
                        className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-xs md:text-sm text-zinc-500 focus:outline-none cursor-not-allowed opacity-60 font-sans" 
                      />
                      <p className="text-[8px] md:text-[9px] text-blue-500/60 font-mono uppercase tracking-tighter ml-1">Contactez le support pour modifier votre email.</p>
                    </div>
 
                    <button type="submit" className="w-full py-3 md:py-4 bg-white/5 hover:bg-white text-zinc-400 hover:text-black rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all mt-4 border border-white/5">
                      Enregistrer
                    </button>
                  </form>
                </div>
 
                {/* Security */}
                <div className="p-5 md:p-7 lg:p-8 rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-[#0c0c12] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h3 className="text-base md:text-lg font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    <span>Sécurité & Accès</span>
                  </h3>
 
                  <form className="space-y-4 md:space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Mot de passe mis à jour !"); }}>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-1">Mot de passe actuel</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-xs md:text-sm text-white focus:outline-none focus:border-red-600/50 transition-all font-mono" 
                      />
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <label className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-1 text-red-500/70">Nouveau mot de passe</label>
                      <input 
                        type="password" 
                        placeholder="Nouveau mot de passe" 
                        className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-xs md:text-sm text-white focus:outline-none focus:border-red-600/50 transition-all font-mono" 
                      />
                    </div>
 
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-1">Confirmer le mot de passe</label>
                      <input 
                        type="password" 
                        placeholder="Répétez" 
                        className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-xs md:text-sm text-white focus:outline-none focus:border-red-600/50 transition-all font-mono" 
                      />
                    </div>
 
                    <button type="submit" disabled={passwordUpdateLoading} className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all mt-4 hover:brightness-110 shadow-lg shadow-blue-900/20">
                      Mettre à jour
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSendPasswordResetEmail}
                      disabled={passwordUpdateLoading}
                      className="w-full py-3 md:py-4 bg-white/5 border border-white/10 hover:bg-white text-zinc-400 hover:text-black rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all mt-2 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {passwordUpdateLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Réinitialiser par email"}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Interactive Overlay: Academic Course Registration */}
      <AnimatePresence>
        {enrollingFormation && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c12] border border-white/10 rounded-3xl max-w-md w-full p-6 md:p-8 flex flex-col outline-none shadow-2xl relative"
            >
              <button 
                onClick={() => setEnrollingFormation(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              {enrolledSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight font-mono">Demande enregistrée !</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Votre candidature pour le programme <strong className="text-white">{enrollingFormation.titre}</strong> a été soumise avec succès. L'administration va l'examiner et prendre contact avec vous.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div>
                    <span className="text-[9px] font-mono text-[#00E5FF] uppercase tracking-wider">{enrollingFormation.niveau}</span>
                    <h3 className="text-lg font-black text-white tracking-tight">Inscription de l'étudiant</h3>
                    <p className="text-xs text-zinc-500 mt-1">Vous postulez au programme : <span className="text-zinc-300 font-medium">{enrollingFormation.titre}</span></p>
                  </div>
                  
                  <div className="space-y-4 font-sans mt-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-wider text-zinc-500">Nom Complet</label>
                      <input 
                        type="text" 
                        value={studentInfo.name} 
                        readOnly
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-500 font-medium cursor-not-allowed opacity-65 font-sans"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-wider text-zinc-500">Adresse Email d'Étudiant</label>
                      <input 
                        type="text" 
                        value={studentInfo.email} 
                        readOnly
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-500 font-medium cursor-not-allowed opacity-65 font-sans"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Quel est votre motivation / projet professionnel ?</label>
                      <textarea 
                        rows={4}
                        value={enrollMotivation}
                        onChange={(e) => setEnrollMotivation(e.target.value)}
                        placeholder="Pourquoi souhaitez-vous suivre cette formation ?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-all font-sans resize-none"
                      />
                    </div>
                    
                    <button 
                      onClick={() => handleEnroll(enrollingFormation)}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer mt-2"
                    >
                      Soumettre ma candidature
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Overlay: Article Details Reader */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c12] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col outline-none overflow-hidden relative shadow-2xl"
            >
              <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start">
                <div className="space-y-2 text-left pr-8">
                  <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">{selectedArticle.title}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono">Par {selectedArticle.author?.name || "HaitianDev Team"} • {selectedArticle.readTime || "5 min"} de lecture</p>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto space-y-4 text-zinc-300 text-sm leading-relaxed scrollbar-thin text-left font-sans flex-1">
                {(selectedArticle.content || "").split('\n\n').map((para: string, idx: number) => {
                  if (para.startsWith('```')) {
                    const code = para.replace(/```[a-z]*/g, '').trim();
                    return (
                      <pre key={idx} className="bg-black border border-white/5 rounded-xl p-4 font-mono text-xs text-blue-400 overflow-x-auto my-3">
                        <code>{code}</code>
                      </pre>
                    );
                  }
                  return <p key={idx}>{para}</p>;
                })}
              </div>
              
              <div className="p-4 md:p-6 bg-[#06060c] border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Overlay: Documentation Details Reader */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c12] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col outline-none overflow-hidden relative shadow-2xl"
            >
              <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start">
                <div className="space-y-1 text-left pr-8">
                  <span className="text-[9px] font-mono text-[#00E5FF] uppercase tracking-wider">{selectedDoc.category}</span>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">{selectedDoc.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-sans">{selectedDoc.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-zinc-300 text-sm leading-relaxed scrollbar-thin text-left font-sans flex-1">
                {selectedDoc.sections && selectedDoc.sections.map((sec: any, idx: number) => (
                  <div key={idx} className="space-y-3">
                    <h5 className="text-base font-bold text-white border-l-2 border-blue-500 pl-3">{sec.title}</h5>
                    <div className="text-zinc-400 text-xs sm:text-sm pl-3 space-y-2">
                      {(sec.content || "").split('\n\n').map((para: string, pIdx: number) => {
                        if (para.startsWith('```')) {
                          const code = para.replace(/```[a-z]*/g, '').trim();
                          return (
                            <pre key={pIdx} className="bg-black border border-white/5 rounded-xl p-4 font-mono text-[11px] text-[#00E5FF] overflow-x-auto my-3">
                              <code>{code}</code>
                            </pre>
                          );
                        }
                        return <p key={pIdx}>{para}</p>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 md:p-6 bg-[#06060c] border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
