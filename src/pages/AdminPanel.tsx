import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiveVisualEditor } from "../components/LiveVisualEditor";
import { defaultPartnersData } from "../components/sections/Partners";
import { fr } from "../i18n/fr";
import { en } from "../i18n/en";
import { 
  FolderGit2, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Trash2, 
  Share,
  AlertTriangle,
  Edit, 
  Plus, 
  UserCheck, 
  UserMinus, 
  Tag, 
  Layers, 
  Calendar, 
  Briefcase, 
  Type, 
  PlusCircle, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Home, 
  Settings, 
  Eye, 
  Check, 
  X,
  Clock,
  CreditCard,
  FileText,
  Bookmark,
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  Archive,
  RefreshCw,
  Sparkles,
  Megaphone,
  Star,
  BarChart3,
  TrendingUp,
  Mail,
  ArrowUpRight,
  Activity,
  Globe,
  Search,
  KeyRound,
  Upload,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { loadCollection, subscribeToCollection, saveCollectionItem, deleteCollectionItem } from "../utils/firebaseSync";
import { db, storage, auth } from "../lib/firebase";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { PROJECTS_DATA, FormationItem, BLOG_DATA } from "../data/staticData";
import { normalizeArticle } from "../utils/normalizeArticle";
import { RichTextEditor } from "../components/ui/RichTextEditor";

// Types definition for our local state
interface QuoteBrief {
  id: string;
  clientName: string;
  email: string;
  company: string;
  specs: string;
  estimatedBudget: string;
  desiredDeadline: string;
  serviceType: string;
  status: "Nouveau / En attente" | "Analyse en cours" | "Chiffrage / Proposition Prête" | "Accepté / Validé" | "Refusé / Annulé";
  createdAt: string;
}

const initialDevis: QuoteBrief[] = [
  {
    id: "devis-1",
    clientName: "Jean-Maxime Auguste",
    email: "jm.auguste@societegenerale.ht",
    company: "Société Générale S.A.",
    specs: "Landing Page Corporate d'élite, E-commerce avec checkout MonCash, Système multilingue (Kreyòl, FR, EN)",
    estimatedBudget: "2k-5k",
    desiredDeadline: "medium",
    serviceType: "Web Design & Site Vitrine",
    status: "Nouveau / En attente",
    createdAt: "2026-06-05T10:00:00Z"
  },
  {
    id: "devis-2",
    clientName: "Marie-Ketsia François",
    email: "ketsia@trans-cargo.com",
    company: "François & Fils Transport",
    specs: "Application iOS & Android multiplateforme, Mode offline-first avec synchronisation locale, Système de notifications push SMS",
    estimatedBudget: "5k-15k",
    desiredDeadline: "fast",
    serviceType: "Mobile App Development",
    status: "Analyse en cours",
    createdAt: "2026-06-03T14:30:00Z"
  },
  {
    id: "devis-3",
    clientName: "Pierre-Richard Celestin",
    email: "pr.celestin@universitelafayette.edu",
    company: "Université Lafayette d'Haïti",
    specs: "Transcription audio-vers-texte en créole, Bot conversationnel d'IA avec reconnaissance de la voix",
    estimatedBudget: "5k-15k",
    desiredDeadline: "extended",
    serviceType: "IA & Business Automation",
    status: "Accepté / Validé",
    createdAt: "2026-06-01T09:15:00Z"
  },
  {
    id: "devis-4",
    clientName: "Dr. Frantz Jean-Baptiste",
    email: "f.jeanbaptiste@hopilaksyon.org",
    company: "Hôpital de l'Action",
    specs: "Bonjour, nous aurions besoin d'un audit de sécurité complet sur nos infrastructures serveurs locales situées à Delmas 83. Merci.",
    estimatedBudget: "Non spécifié",
    desiredDeadline: "Asap",
    serviceType: "Audit & Sécurité IT",
    status: "Nouveau / En attente",
    createdAt: "2026-06-08T11:45:00Z"
  }
];

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  client: string;
  shortDesc: string;
  imageUrl: string;
  actionUrl: string;
}

interface Testimonial {
  id: string;
  name: string;
  roleCompany: string;
  quote: string;
  avatarUrl: string;
}

interface EducationItem {
  id: string;
  type: "Formation" | "Blog" | "Doc";
  title: string;
  author: string;
  date: string; // lastUpdated
  tags: string[]; // keywords
  content: string;
  bannerUrl: string;
  // Specialized fields for Formation
  difficulty?: string;
  duration?: string;
  certifyingBody?: string;
  registrationUrl?: string;
  // Specialized fields for Blog
  readingTime?: string;
  summary?: string;
  // Specialized fields for Doc
  version?: string;
  category?: string;
  targetAudience?: string; // audience
  documentUrl?: string;
  iconUrl?: string; // icone url
}

interface PopupItem {
  id: string;
  type: "info" | "warning" | "promo" | "success";
  criticalityLevel: "Basse" | "Moyenne" | "Haute" | "Critique";
  targetAudience: "Tous" | "Étudiant" | "Client" | "Admin";
  delaySeconds: number;
  title: string;
  content: string;
  buttonText: string;
  buttonUrl: string;
  isActive: boolean;
  createdAt: string;
  views: number;
  clicks: number;
}

interface BannerItem {
  id: string;
  styleVisualPreset: "info" | "warning" | "promo" | "success";
  emplacementBaniere: "above_navbar" | "above_footer";
  targetAudience: "Tous" | "Étudiant" | "Client" | "Admin";
  contenuMessage: string;
  texteCta: string;
  urlRedirection: string;
  isActive: boolean;
  createdAt: string;
}

interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role: string;
  accessStatus: string;
  companyName?: string;
}

interface SupportMessage {
  id: string;
  senderId?: string;
  senderName?: string;
  recipientId?: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientRole?: "Étudiant" | "Client" | "Admin";
  subject?: string;
  content?: string;
  timestamp?: string;
  
  // Champs requis par l’utilisateur
  destinataire: string;
  email: string;
  objet: string;
  message: string;
  statut: string;
}

const getAdminProjectImage = (id: string) => {
  switch (id) {
    case "mwa-fintech":
      return "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800";
    case "kreyol-voice-ai":
      return "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800";
    case "global-shipping-tracker":
      return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
    case "e-infotronique-portal":
      return "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800";
    case "restaurant-cloud-system":
      return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800";
    case "hr-management-tool":
      return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800";
    case "haiti-news-hub":
      return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800";
    case "edukreyol-lms":
      return "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800";
    case "pay-lakay-gateway":
      return "https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=800";
    case "agritech-dashboard":
      return "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=800";
    default:
      return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800";
  }
};

// Initial Static Data
const initialProjects: Project[] = PROJECTS_DATA.map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  year: p.year || "2025",
  client: p.client || "Haitian Dev",
  shortDesc: p.description,
  imageUrl: p.image && (p.image.startsWith("http://") || p.image.startsWith("https://")) 
    ? p.image 
    : getAdminProjectImage(p.id),
  actionUrl: (p as any).demoUrl || "https://haitiandev.org"
}));

const initialTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Frantz Desrosiers",
    roleCompany: "CEO @ AyitiPay",
    quote: "Leur dévouement technique et leur gestion des webhooks locaux est d'une fiabilité absolue.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    id: "2",
    name: "Mireille Laleau",
    roleCompany: "Product Director @ AgriTech",
    quote: "Ils ont transformé notre maquette Figma en un produit interactif parfait en un temps record.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80"
  }
];

const initialEducation: EducationItem[] = [
  {
    id: "1",
    type: "Formation",
    title: "Masterclass Intégration MonCash Avancée",
    author: "HaitianDev Academy",
    date: "2026-06-01",
    tags: ["Fintech", "Webhooks", "NodeJS"],
    content: "Dans ce cours d'élite, nous apprenons à gérer les signatures cryptographiques, les files d'attente Redis pour pallier les micro-coupures de réseau et le dispatch asynchrone des reçus de transaction.",
    bannerUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    type: "Blog",
    title: "L'État de l'Ingénierie Logicielle en Haïti en 2026",
    author: "Rodney Altidor",
    date: "2026-05-15",
    tags: ["Tech", "Haiti", "Carrière"],
    content: "Une analyse approfondie du marché du travail tech local décentralisé et de la transition massive vers l'hybride pour les studios d'élite caribéens.",
    bannerUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
  }
];

const initialAccounts: UserAccount[] = [
  { id: "1", fullName: "Marc-Arthur Saint-Jean", email: "marc.arthur@haitiandev.com", role: "Admin", accessStatus: "Active" },
  { id: "2", fullName: "Jean-Baptiste Valcourt", email: "jb.valcourt@haitiandev.com", role: "Admin", accessStatus: "Active" },
  { id: "3", fullName: "Ketsia Joseph", email: "ketsia.j@gmail.com", role: "Client", accessStatus: "Active", companyName: "K-Tech Haiti" },
  { id: "4", fullName: "Stevenson Pierre", email: "stevenson@gmail.com", role: "Étudiant", accessStatus: "Active" },
  { id: "5", fullName: "Esther Delva", email: "esther.d@gmail.com", role: "Client", accessStatus: "Suspended", companyName: "Haiti Tech Hub" },
  { id: "6", fullName: "Carl-Henry Jean", email: "carl.henry@gmail.com", role: "Étudiant", accessStatus: "Active" }
];

const initialMessages: SupportMessage[] = [
  {
    id: "m1",
    senderId: "admin",
    senderName: "Marc-Arthur Saint-Jean",
    recipientId: "4",
    recipientName: "Stevenson Pierre",
    recipientEmail: "stevenson@gmail.com",
    recipientRole: "Étudiant",
    subject: "Bienvenue sur HaitianDev !",
    content: "Bonjour Stevenson, ton inscription s'est bien déroulée. Tu as maintenant accès aux modules de formation d'élite. N'hésite pas à consulter la documentation !",
    timestamp: "2026-06-08T10:00:00Z",
    destinataire: "Stevenson Pierre",
    email: "stevenson@gmail.com",
    objet: "Bienvenue sur HaitianDev !",
    message: "Bonjour Stevenson, ton inscription s'est bien déroulée. Tu as maintenant accès aux modules de formation d'élite. N'hésite pas à consulter la documentation !",
    statut: "Envoyé"
  },
  {
    id: "m2",
    senderId: "admin",
    senderName: "Marc-Arthur Saint-Jean",
    recipientId: "3",
    recipientName: "Ketsia Joseph",
    recipientEmail: "ketsia.j@gmail.com",
    recipientRole: "Client",
    subject: "Suivi de votre Devis de Validation",
    content: "Bonjour Ketsia, j'ai bien reçu votre brief pour le projet K-Tech Haiti. Notre équipe d'élite commence l'évaluation technique et le prototypage.",
    timestamp: "2026-06-08T11:30:00Z",
    destinataire: "Ketsia Joseph",
    email: "ketsia.j@gmail.com",
    objet: "Suivi de votre Devis de Validation",
    message: "Bonjour Ketsia, j'ai bien reçu votre brief pour le projet K-Tech Haiti. Notre équipe d'élite commence l'évaluation technique et le prototypage.",
    statut: "Envoyé"
  }
];



export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const session = localStorage.getItem("haitiandev_admin_session");
    if (!session) {
      navigate("/admin-login");
      return;
    }

    // Verify Firebase Auth context is available
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
         // Auto-redirect to re-run the AdminLogin auto-provisioning
         localStorage.removeItem("haitiandev_admin_session");
         navigate("/admin-login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Safe helper for window.confirm inside sandboxed iframe
  const safeConfirm = (msg: string): boolean => {
    try {
      return window.confirm(msg);
    } catch (e) {
      console.warn("window.confirm is blocked by iframe sandbox, automatically confirming:", e);
      return true;
    }
  };

  // Navigation Sidebar states
  const [activeTab, setActiveTab] = useState<"content" | "accounts" | "devis" | "popups" | "messages" | "profile" | "stats" | "credentials" | "billing">("content");
  const [isLiveEditing, setIsLiveEditing] = useState(false);
  const [contentSubTab, setContentSubTab] = useState<"projects" | "testimonials" | "formations" | "education" | "partners" | "landingStats">("projects");
  const [eduTab, setEduTab] = useState<"formation" | "blog" | "doc">("formation");
  const [devisSubTab, setDevisSubTab] = useState<string>("all");
  const [accountsSubTab, setAccountsSubTab] = useState<"all" | "Étudiant" | "Admin" | "Client">("all");

  // Project Access (Credentials) state
  const [projectAccessList, setProjectAccessList] = useState<any[]>([]);
  const [projectAccessSearchQuery, setProjectAccessSearchQuery] = useState("");
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [editingAccess, setEditingAccess] = useState<any | null>(null);

  // Form inputs for Project Access
  const [accessClientName, setAccessClientName] = useState("");
  const [accessProjectName, setAccessProjectName] = useState("");
  const [accessClientEmail, setAccessClientEmail] = useState("");
  const [accessAdminLink, setAccessAdminLink] = useState("");
  const [accessUsername, setAccessUsername] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [accessApiToken, setAccessApiToken] = useState("");
  const [accessDbUri, setAccessDbUri] = useState("");

  // Landing Page Stats configuration
  const [statsDoc, setStatsDoc] = useState<{id: string, fondateur: string, expert: string, projet: string, anne: string}>(() => {
    const raw = localStorage.getItem("haitiandev_app_stats");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Failed to load local stats:", e);
      }
    }
    return {
      id: "main_stats",
      fondateur: "2",
      expert: "12",
      projet: "10+",
      anne: "1"
    };
  });

  const handleSaveAppStats = async (updated: any) => {
    setStatsDoc(updated);
    localStorage.setItem("haitiandev_app_stats", JSON.stringify(updated));
    await saveCollectionItem("stats", "haitiandev_app_stats_local", updated, []);
    window.dispatchEvent(new Event("haitiandev_stats_updated"));
  };

  // SEO Configurations State
  const [seoConfig, setSeoConfig] = useState(() => {
    const raw = localStorage.getItem("haitiandev_seo_config");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Failed to parse SEO config:", e);
      }
    }
    return {
      global: {
        siteName: "HaitianDev",
        defaultOgImage: "https://haitiandev.com/images/og-share-main.jpg",
        metaRobots: "index, follow",
        googleVerification: "google-site-verification-haitiandev-elite-2026",
        sitemapUrl: "https://haitiandev.com/sitemap.xml"
      },
      pages: {
        home: {
          name: "Accueil / Landing Page",
          path: "/",
          metaTitle: "HaitianDev — Elite Software Engineering & Digital Solutions",
          metaDescription: "Concevez vos applications web et mobiles d'élite, vos systèmes d'automatisation IA et formez vos équipes avec les meilleurs développeurs d'Haïti.",
          ogImage: "https://haitiandev.com/images/og-home.jpg"
        },
        services: {
          name: "Configurateur de Services",
          path: "/services",
          metaTitle: "Configurateur de Services Logiciels Élite — HaitianDev",
          metaDescription: "Estimez votre budget, configurez vos fonctionnalités cibles et concevez votre cahier des charges d'ingénierie logicielle sur mesure en quelques clics.",
          ogImage: "https://haitiandev.com/images/og-services.jpg"
        },
        portfolio: {
          name: "Portfolio / Projets",
          path: "/portfolio",
          metaTitle: "Notre Portfolio de Solutions Technologiques — HaitianDev",
          metaDescription: "Explorez nos projets à fort impact : portefeuilles MonCash ultra-rapides, reconnaissance créole par IA, passerelles de paie et applications éducatives.",
          ogImage: "https://haitiandev.com/images/og-portfolio.jpg"
        },
        about: {
          name: "À Propos / Notre Mission",
          path: "/about-us",
          metaTitle: "À Propos d'HaitianDev — Relier Haïti à la Technologie Mondiale",
          metaDescription: "Découvrez notre histoire, nos fondateurs, et notre mission de souveraineté numérique : élever l'ingénierie logicielle nationale aux standards internationaux.",
          ogImage: "https://haitiandev.com/images/og-about.jpg"
        },
        training: {
          name: "Académie / Programmation",
          path: "/training",
          metaTitle: "Académie de Développement Logiciel Élite — HaitianDev",
          metaDescription: "Formations d'ingénierie logicielle contemporaines de haut niveau en Haïti. Devenez développeur senior en travaillant sur des projets industriels réels.",
          ogImage: "https://haitiandev.com/images/og-training.jpg"
        },
        blog: {
          name: "Blog / Actualités Tech",
          path: "/blog",
          metaTitle: "Blog HaitianDev — Innovation Technologique & Stratégie Digitale",
          metaDescription: "Analyses de nos experts sur les webhooks MonCash, la performance web en faible connectivité 3G et la pédagogie logicielle avancée.",
          ogImage: "https://haitiandev.com/images/og-blog.jpg"
        },
        login: {
          name: "Portail Client / Connexion",
          path: "/login",
          metaTitle: "Espace Connexion & Portail Client — HaitianDev",
          metaDescription: "Connectez-vous à votre portail HaitianDev pour suivre l'avancement de vos projets logiciels, formations tech et livrables.",
          ogImage: "https://haitiandev.com/images/og-login.jpg"
        },
        signup: {
          name: "Inscription Académie",
          path: "/signup",
          metaTitle: "Inscription & Rejoindre l'Académie — HaitianDev",
          metaDescription: "Créez votre compte HaitianDev (Étudiant ou Client) et accédez à nos programmes d'ingénierie logicielle d'élite.",
          ogImage: "https://haitiandev.com/images/og-signup.jpg"
        }
      }
    };
  });

  const [seoSubTab, setSeoSubTab] = useState<"global" | "pages">("global");
  const [selectedSeoPageKey, setSelectedSeoPageKey] = useState<string>("home");
  const [isDragging, setIsDragging] = useState(false);

  // Drag and Drop handlers for OG Image Upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, pageKey?: string) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (pageKey) {
          setSeoConfig((prev: any) => ({
            ...prev,
            pages: {
              ...prev.pages,
              [pageKey]: {
                ...prev.pages[pageKey],
                ogImage: base64
              }
            }
          }));
        } else {
          setSeoConfig((prev: any) => ({
            ...prev,
            global: {
              ...prev.global,
              defaultOgImage: base64
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSeo = () => {
    localStorage.setItem("haitiandev_seo_config", JSON.stringify(seoConfig));
    alert("Configuration SEO enregistrée avec succès !");
  };

  // Dynamic States for CRUD
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  // Formations CRUD list state & initialization
  const [formations, setFormations] = useState<FormationItem[]>([]);

  useEffect(() => {
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
        urlImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80"
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

    const initFormations = async () => {
      const data = await loadCollection<any>("formations", "haitiandev_formations_local", DEFAULT_FORMATIONS);
      setFormations(data);
    };
    initFormations();

    const unsubscribeFormations = subscribeToCollection<any>("formations", "haitiandev_formations_local", (data) => {
      setFormations(data);
    }, DEFAULT_FORMATIONS);

    return () => {
      unsubscribeFormations();
    };
  }, []);

  useEffect(() => {
    const initLoad = async () => {
      const data = await loadCollection<any>("stats", "haitiandev_app_stats_local", [{
        id: "main_stats",
        fondateur: "2",
        expert: "12",
        projet: "10+",
        anne: "1"
      }]);
      if (data && data.length > 0) {
        setStatsDoc(data[0]);
      }
      
      const testimonialsData = await loadCollection<Testimonial>("testimonials", "haitiandev_testimonials", initialTestimonials);
      setTestimonials(testimonialsData);
      const popupData = await loadCollection<PopupItem>("haitian_dev_popups", "haitian_dev_popups", []);
      setPopups(popupData);
      const bannerData = await loadCollection<BannerItem>("haitian_dev_banners", "haitian_dev_banners", []);
      setBanners(bannerData);
    };
    initLoad();

    const unsubscribe = subscribeToCollection<Testimonial>("testimonials", "haitiandev_testimonials", (data) => {
      setTestimonials(data);
    }, initialTestimonials);
    
    // Unsubscribe popups and banners listener
    const unsubscribePopups = subscribeToCollection<PopupItem>("haitian_dev_popups", "haitian_dev_popups", (data) => {
      setPopups(data);
    }, []);
    const unsubscribeBanners = subscribeToCollection<BannerItem>("haitian_dev_banners", "haitian_dev_banners", (data) => {
      setBanners(data);
    }, []);

    return () => {
      unsubscribe();
      unsubscribePopups();
      unsubscribeBanners();
    };
  }, []);

  useEffect(() => {
    const initProjects = async () => {
      const data = await loadCollection<Project>("projects", "haitiandev_projects", []);
      setProjects(data);
    };
    initProjects();

    const unsubscribeProj = subscribeToCollection<Project>("projects", "haitiandev_projects", (data) => {
      setProjects(data);
    }, []);

    return () => {
      unsubscribeProj();
    };
  }, []);

  const [educationItems, setEducationItems] = useState<EducationItem[]>(initialEducation);

  // Load and merge unified education items in real-time
  useEffect(() => {
    let currentBlog: any[] = [];
    let currentDocs: any[] = [];
    let currentFormations: any[] = [];

    const rebuildEducationItems = () => {
      const blogs = (currentBlog || []).map(b => ({ ...normalizeArticle(b), type: "Blog" }));
      const docs = (currentDocs || []).map(d => ({ ...d, type: "Doc" }));
      const forms = (currentFormations || []).map(f => ({ ...f, type: "Formation" }));
      
      const merged = [...blogs, ...docs, ...forms];
      if (merged.length === 0) {
        setEducationItems(initialEducation);
      } else {
        setEducationItems(merged);
      }
    };

    const unsubscribeArticles = subscribeToCollection<any>("articles", "haitiandev_articles_local", (data) => {
      currentBlog = data;
      rebuildEducationItems();
    }, BLOG_DATA);

    const unsubscribeDocs = subscribeToCollection<any>("docs", "haitiandev_docs_local", (data) => {
      currentDocs = data;
      rebuildEducationItems();
    }, []);

    const unsubscribeEduFormations = subscribeToCollection<any>("education_formations", "haitiandev_edu_formations_local", (data) => {
      currentFormations = data;
      rebuildEducationItems();
    }, []);

    return () => {
      unsubscribeArticles();
      unsubscribeDocs();
      unsubscribeEduFormations();
    };
  }, []);

  const [partners, setPartners] = useState<any[]>(() => {
    const raw = localStorage.getItem("haitiandev_partners");
    const parsed = raw ? JSON.parse(raw) : defaultPartnersData;
    return parsed.map((p: any) => ({ ...p, id: String(p.id) }));
  });

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

  // Partner Modal Addition states
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [partnerName, setPartnerName] = useState("");
  const [partnerLogoUrl, setPartnerLogoUrl] = useState("");
  const [partnerWebsiteUrl, setPartnerWebsiteUrl] = useState("");
  const [partnerIcon, setPartnerIcon] = useState("Globe");
  const [partnerColor, setPartnerColor] = useState("text-blue-500");

  const [googleBusinessUrl, setGoogleBusinessUrl] = useState(() => {
    return localStorage.getItem("haitiandev_google_business_url") || "https://search.google.com/local/writereview?placeid=ChIJ8-c6lreBWjDRNgsymveYefw";
  });

  useEffect(() => {
    localStorage.setItem("haitiandev_google_business_url", googleBusinessUrl);
  }, [googleBusinessUrl]);

  useEffect(() => {
    localStorage.setItem("haitiandev_partners", JSON.stringify(partners));
    window.dispatchEvent(new Event("haitian_partners_updated"));
  }, [partners]);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Sync users from Firestore
  useEffect(() => {
    const initUsers = async () => {
      const data = await loadCollection<UserAccount>("users", "haitiandev_users_local", []);
      setAccounts(data);
    };
    initUsers();

    const unsubscribe = subscribeToCollection<UserAccount>("users", "haitiandev_users_local", (data) => {
      setAccounts(data);
    }, []);

    return () => unsubscribe();
  }, []);

  // Messages & Devis states
  const [messagesSubTab, setMessagesSubTab] = useState<"Étudiant" | "Client" | "Admin">("Étudiant");
  const [messagesSearchQuery, setMessagesSearchQuery] = useState("");
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [devisList, setDevisList] = useState<QuoteBrief[]>(initialDevis);

  // Message composing state
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<UserAccount | null>(null);
  const [newMessageSubject, setNewMessageSubject] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");

  // Message editing state
  const [editingMessage, setEditingMessage] = useState<SupportMessage | null>(null);
  const [editMessageRecipient, setEditMessageRecipient] = useState("");
  const [editMessageEmail, setEditMessageEmail] = useState("");
  const [editMessageSubject, setEditMessageSubject] = useState("");
  const [editMessageContent, setEditMessageContent] = useState("");
  const [editMessageStatus, setEditMessageStatus] = useState("");

  // Simulated Email dispatch feedback overlay
  const [simulatedEmail, setSimulatedEmail] = useState<{
    isOpen: boolean;
    to: string;
    subject: string;
    content: string;
    recipientName: string;
  } | null>(null);

  // Sync messages from Firestore
  useEffect(() => {
    const initMessages = async () => {
      const data = await loadCollection<SupportMessage>("messages", "haitiandev_support_messages_local", []);
      setMessages(data);
    };
    initMessages();

    const unsubscribe = subscribeToCollection<SupportMessage>("messages", "haitiandev_support_messages_local", (data) => {
      setMessages(data);
    }, []);

    return () => unsubscribe();
  }, []);

  // Sync Project Access (credentials) from Firestore
  useEffect(() => {
    const initAccess = async () => {
      const data = await loadCollection<any>("acces_projets", "haitiandev_acces_projets", []);
      setProjectAccessList(data);
    };
    initAccess();

    const unsubscribe = subscribeToCollection<any>("acces_projets", "haitiandev_acces_projets", (data) => {
      setProjectAccessList(data);
    }, []);

    return () => unsubscribe();
  }, []);

  // Invoice states
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("Tous");
  
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ clientName: "", email: "", projectName: "", amount: "", paymentMethod: "Natcash", paymentLink: "", file: null as File | null });
  const [isUploading, setIsUploading] = useState(false);

  // Sync invoices from Firestore
  useEffect(() => {
    const initInvoices = async () => {
      const data = await loadCollection<any>("invoices", "haitiandev_invoices_local", []);
      setInvoices(data);
      setInvoicesLoading(false);
    };
    initInvoices();

    const unsubscribe = subscribeToCollection<any>("invoices", "haitiandev_invoices_local", (data) => {
      setInvoices(data);
      setInvoicesLoading(false);
    }, []);

    return () => unsubscribe();
  }, []);

  // Sync devis from Firestore
  useEffect(() => {
    const initDevis = async () => {
      const data = await loadCollection<QuoteBrief>("devis", "haitian_dev_devis_local", initialDevis);
      setDevisList(data);
    };
    initDevis();

    const unsubscribe = subscribeToCollection<QuoteBrief>("devis", "haitian_dev_devis_local", (data) => {
      setDevisList(data);
    }, initialDevis);

    return () => unsubscribe();
  }, []);

  // Handler to alter status
  const handleChangeDevisStatus = async (id: string, nextStatus: QuoteBrief["status"]) => {
    const quote = devisList.find(d => d.id === id);
    if (!quote) return;
    const updated = { ...quote, status: nextStatus };
    const result = await saveCollectionItem("devis", "haitian_dev_devis_local", updated, devisList);
    setDevisList(result);
  };

  const handleDeleteDevis = (id: string) => {
    const d = devisList.find(dev => dev.id === id);
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'devis',
      title: d?.projectType || 'cette demande de devis'
    });
  };

  // Modals Toggle and edit target states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [isFormationModalOpen, setIsFormationModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<FormationItem | null>(null);
  const [formationForm, setFormationForm] = useState<Omit<FormationItem, "id">>({
    titre: "",
    formateur: "",
    dateDebut: "",
    duree: "",
    niveau: "AVANCÉ",
    organisme: "",
    lienInscription: "",
    urlImage: ""
  });

  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);

  // Form Fields State
  const [projectForm, setProjectForm] = useState<Omit<Project, "id">>({
    title: "",
    category: "AI",
    year: "2026",
    client: "",
    shortDesc: "",
    imageUrl: "",
    actionUrl: ""
  });

  const [testimonialForm, setTestimonialForm] = useState<Omit<Testimonial, "id">>({
    name: "",
    roleCompany: "",
    quote: "",
    avatarUrl: ""
  });

  const [educationForm, setEducationForm] = useState<Omit<EducationItem, "id">>({
    type: "Formation",
    title: "",
    author: "",
    date: new Date().toISOString().split('T')[0],
    tags: [],
    content: "",
    bannerUrl: "",
    difficulty: "Intermédiaire",
    duration: "",
    certifyingBody: "HaitianDev Academy",
    registrationUrl: "",
    readingTime: "",
    summary: "",
    version: "v1.0",
    category: "",
    targetAudience: "",
    documentUrl: ""
  });

  const [newTagInput, setNewTagInput] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isDocUploading, setIsDocUploading] = useState(false);
  const [docDragActive, setDocDragActive] = useState(false);

  // User Accounts Create states
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountForm, setAccountForm] = useState<Omit<UserAccount, "id">>({
    fullName: "",
    email: "",
    role: "Étudiant",
    accessStatus: "Active",
    companyName: ""
  });

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: UserAccount = {
      id: `user_${Date.now()}`,
      fullName: accountForm.fullName,
      email: accountForm.email,
      role: accountForm.role,
      accessStatus: accountForm.accessStatus,
      companyName: accountForm.role === "Client" ? accountForm.companyName : ""
    };
    const result = await saveCollectionItem("users", "haitiandev_users_local", newAccount, accounts);
    setAccounts(result);
    setIsAccountModalOpen(false);
    setAccountForm({
      fullName: "",
      email: "",
      role: "Étudiant",
      accessStatus: "Active",
      companyName: ""
    });
  };

  // ==================== POPUPS & BANNERS CRUD ====================
  const [popupSubSection, setPopupSubSection] = useState<"popups" | "banners">("popups");

  const [popups, setPopups] = useState<PopupItem[]>([]);

  const [banners, setBanners] = useState<BannerItem[]>([]);

  useEffect(() => {
    localStorage.setItem("haitian_dev_popups", JSON.stringify(popups));
    window.dispatchEvent(new Event("haitian_popups_updated"));
  }, [popups]);


  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<any | null>(null);
  const [popupForm, setPopupForm] = useState({
    title: "",
    content: "",
    type: "info" as "info" | "warning" | "promo" | "success",
    targetAudience: "Tous" as "Tous" | "Étudiant" | "Client" | "Admin",
    delaySeconds: 1,
    buttonText: "",
    buttonUrl: "",
    isActive: true
  });

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [bannerForm, setBannerForm] = useState({
    contenuMessage: "",
    styleVisualPreset: "promo" as "promo" | "info" | "warning" | "success",
    emplacementBaniere: "above_navbar" as "above_navbar" | "above_footer",
    targetAudience: "Tous" as "Tous" | "Étudiant" | "Client" | "Admin",
    texteCta: "",
    urlRedirection: "",
    isActive: true
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    itemId: string;
    itemType: 'popup' | 'banner' | 'message' | 'user' | 'project' | 'testimonial' | 'partner' | 'devis' | 'education' | 'formation' | 'credentials';
    title: string;
  }>({
    isOpen: false,
    itemId: '',
    itemType: 'popup',
    title: ''
  });

  const handleTogglePopupActive = async (id: string) => {
    const popup = popups.find(p => p.id === id);
    if (popup) {
      const updatedPopup = { ...popup, isActive: !popup.isActive };
      const updated = await saveCollectionItem("haitian_dev_popups", "haitian_dev_popups", updatedPopup, popups);
      setPopups(updated);
    }
  };

  const handleDeletePopup = (id: string) => {
    const p = popups.find(pop => pop.id === id);
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'popup',
      title: p?.title || 'ce popup'
    });
  };

  const handleToggleBannerActive = async (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (banner) {
      const updatedBanner = { ...banner, isActive: !banner.isActive };
      const updated = await saveCollectionItem("haitian_dev_banners", "haitian_dev_banners", updatedBanner, banners);
      setBanners(updated);
    }
  };

  const handleDeleteBanner = (id: string) => {
    const b = banners.find(ban => ban.id === id);
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'banner',
      title: b?.contenuMessage || 'cette bannière'
    });
  };

  const handleConfirmExecuteDelete = async () => {
    const { itemId, itemType } = deleteConfirmation;
    if (!itemId) return;

    if (itemType === 'popup') {
      const updated = await deleteCollectionItem("haitian_dev_popups", "haitian_dev_popups", itemId, popups);
      setPopups(updated);
    } else if (itemType === 'banner') {
      const updated = await deleteCollectionItem("haitian_dev_banners", "haitian_dev_banners", itemId, banners);
      setBanners(updated);
    } else if (itemType === 'message') {
      const updated = messages.filter(m => m.id !== itemId);
      setMessages(updated);
      await deleteCollectionItem("messages", "haitiandev_support_messages_local", itemId, messages);
    } else if (itemType === 'project') {
      const updatedList = await deleteCollectionItem<Project>("projects", "haitiandev_projects", itemId, projects);
      setProjects(updatedList);
    } else if (itemType === 'testimonial') {
      const updatedList = await deleteCollectionItem<Testimonial>("testimonials", "haitiandev_testimonials", itemId, testimonials);
      setTestimonials(updatedList);
    } else if (itemType === 'partner') {
      const updatedList = await deleteCollectionItem<any>("partners", "haitiandev_partners", itemId, partners);
      setPartners(updatedList);
    } else if (itemType === 'devis') {
      const updated = await deleteCollectionItem("devis", "haitian_dev_devis_local", itemId, devisList);
      setDevisList(updated);
    } else if (itemType === 'education') {
      const foundItem = educationItems.find(ei => ei.id === itemId);
      setEducationItems(educationItems.filter(ei => ei.id !== itemId));
      if (foundItem) {
        if (foundItem.type === "Blog") {
          await deleteCollectionItem("articles", "haitiandev_articles_local", itemId, educationItems.filter(ei => ei.type === "Blog"));
        } else if (foundItem.type === "Doc") {
          await deleteCollectionItem("docs", "haitiandev_documents_local", itemId, educationItems.filter(ei => ei.type === "Doc"));
        } else {
          await deleteCollectionItem("education_formations", "haitiandev_edu_formations_local", itemId, educationItems.filter(ei => ei.type === "Formation"));
        }
      }
    } else if (itemType === 'formation') {
      const updatedList = await deleteCollectionItem<any>("formations", "haitiandev_formations_local", itemId, formations);
      setFormations(updatedList);
    } else if (itemType === 'credentials') {
      const updatedList = await deleteCollectionItem<any>("acces_projets", "haitiandev_acces_projets", itemId, projectAccessList);
      setProjectAccessList(updatedList);
    }
    
    setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleOpenCreateAccess = () => {
    setEditingAccess(null);
    setAccessClientName("");
    setAccessProjectName("");
    setAccessClientEmail("");
    setAccessAdminLink("");
    setAccessUsername("");
    setAccessPassword("");
    setAccessApiToken("");
    setAccessDbUri("");
    setIsAccessModalOpen(true);
  };

  const handleOpenEditAccess = (item: any) => {
    setEditingAccess(item);
    setAccessClientName(item.clientName || "");
    setAccessProjectName(item.projectName || "");
    setAccessClientEmail(item.clientEmail || "");
    setAccessAdminLink(item.adminLink || "");
    setAccessUsername(item.username || "");
    setAccessPassword(item.password || "");
    setAccessApiToken(item.apiToken || "");
    setAccessDbUri(item.dbUri || "");
    setIsAccessModalOpen(true);
  };

  const handleSaveAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessClientName || !accessProjectName || !accessClientEmail || !accessAdminLink || !accessUsername || !accessPassword) {
      alert("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    const item = {
      id: editingAccess?.id || `access_${Date.now()}`,
      clientName: accessClientName,
      projectName: accessProjectName,
      clientEmail: accessClientEmail,
      adminLink: accessAdminLink,
      username: accessUsername,
      password: accessPassword,
      apiToken: accessApiToken,
      dbUri: accessDbUri
    };

    try {
      const updatedList = await saveCollectionItem<any>(
        "acces_projets",
        "haitiandev_acces_projets",
        item,
        projectAccessList
      );
      setProjectAccessList(updatedList);
      setIsAccessModalOpen(false);
      setEditingAccess(null);
    } catch (err) {
      console.error("Error saving project access:", err);
    }
  };

  const handleDeleteAccess = (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'credentials',
      title: `le code d'accès pour le projet "${name}"`
    });
  };

  const handleOpenBannerModal = (b: any | null = null) => {
    if (b) {
      setEditingBanner(b);
      setBannerForm({
        contenuMessage: b.contenuMessage,
        styleVisualPreset: b.styleVisualPreset,
        emplacementBaniere: b.emplacementBaniere,
        targetAudience: b.targetAudience,
        texteCta: b.texteCta ?? "",
        urlRedirection: b.urlRedirection ?? "",
        isActive: b.isActive ?? true
      });
    } else {
      setEditingBanner(null);
      setBannerForm({
        contenuMessage: "",
        styleVisualPreset: "promo",
        emplacementBaniere: "above_navbar",
        targetAudience: "Tous",
        texteCta: "",
        urlRedirection: "",
        isActive: true
      });
    }
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.contenuMessage.trim()) return;

    const bannerData: BannerItem = {
      ...(bannerForm as any),
      id: editingBanner ? editingBanner.id : `banner_${Date.now()}`,
      createdAt: editingBanner ? editingBanner.createdAt : new Date().toISOString().split('T')[0]
    };
    
    const updated = await saveCollectionItem("haitian_dev_banners", "haitian_dev_banners", bannerData, banners);
    setBanners(updated);
    setIsBannerModalOpen(false);
    setEditingBanner(null);
  };

  const handleOpenPopupModal = (p: any | null = null) => {
    if (p) {
      setEditingPopup(p);
      setPopupForm({
        title: p.title,
        content: p.content,
        type: p.type,
        targetAudience: p.targetAudience,
        delaySeconds: p.delaySeconds ?? 1,
        buttonText: p.buttonText ?? "",
        buttonUrl: p.buttonUrl ?? "",
        isActive: p.isActive ?? true,
        criticalityLevel: p.criticalityLevel ?? "Moyenne"
      } as any);
    } else {
      setEditingPopup(null);
      setPopupForm({
        title: "",
        content: "",
        type: "info",
        targetAudience: "Tous",
        delaySeconds: 1,
        buttonText: "",
        buttonUrl: "",
        isActive: true,
        criticalityLevel: "Moyenne"
      } as any);
    }
    setIsPopupModalOpen(true);
  };

  const handleSavePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const popupData: PopupItem = {
      ...(popupForm as any),
      id: editingPopup ? editingPopup.id : `pop_${Date.now()}`,
      createdAt: editingPopup ? editingPopup.createdAt : new Date().toISOString().split('T')[0],
      views: editingPopup ? editingPopup.views : 0,
      clicks: editingPopup ? editingPopup.clicks : 0,
      criticalityLevel: (popupForm as any).criticalityLevel || "Moyenne"
    };
    
    const updated = await saveCollectionItem("haitian_dev_popups", "haitian_dev_popups", popupData, popups);
    setPopups(updated);
    setIsPopupModalOpen(false);
  };

  // ==================== MESSAGING ACTIONS ====================
  const handleOpenComposeMessage = (recipient: UserAccount) => {
    setSelectedRecipient(recipient);
    setNewMessageSubject(`[HaitianDev] Note importante de l'équipe d'élite`);
    setNewMessageContent(`Bonjour ${recipient.fullName},\n\nNous avons le plaisir de vous contacter concernant...`);
    setIsNewMessageModalOpen(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || !newMessageSubject.trim() || !newMessageContent.trim()) return;

    const newMessage: SupportMessage = {
      id: "msg_" + Date.now(),
      senderId: "admin",
      senderName: "Marc-Arthur Saint-Jean", // Simulated logged-in administrator
      recipientId: selectedRecipient.id,
      recipientName: selectedRecipient.fullName,
      recipientEmail: selectedRecipient.email,
      recipientRole: selectedRecipient.role as any,
      subject: newMessageSubject.trim(),
      content: newMessageContent.trim(),
      timestamp: new Date().toISOString(),

      // Champs requis par l’utilisateur pour la collection messages
      destinataire: selectedRecipient.fullName,
      email: selectedRecipient.email,
      objet: newMessageSubject.trim(),
      message: newMessageContent.trim(),
      statut: "Envoyé"
    };

    const updated = await saveCollectionItem<SupportMessage>("messages", "haitiandev_support_messages_local", newMessage, messages);
    setMessages(updated);
    setIsNewMessageModalOpen(false);

    // Trigger the simulated email modal overlay
    setSimulatedEmail({
      isOpen: true,
      to: selectedRecipient.email,
      subject: newMessageSubject.trim(),
      content: newMessageContent.trim(),
      recipientName: selectedRecipient.fullName
    });

    // Reset composing state fields
    setNewMessageSubject("");
    setNewMessageContent("");
    setSelectedRecipient(null);
  };

  const handleOpenEditMessage = (msg: SupportMessage) => {
    setEditingMessage(msg);
    setEditMessageRecipient(msg.destinataire || msg.recipientName || "");
    setEditMessageEmail(msg.email || msg.recipientEmail || "");
    setEditMessageSubject(msg.objet || msg.subject || "");
    setEditMessageContent(msg.message || msg.content || "");
    setEditMessageStatus(msg.statut || "Envoyé");
  };

  const handleSaveEditedMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMessage) return;

    const updatedMessage: SupportMessage = {
      ...editingMessage,
      destinataire: editMessageRecipient.trim(),
      email: editMessageEmail.trim(),
      objet: editMessageSubject.trim(),
      message: editMessageContent.trim(),
      statut: editMessageStatus,

      // Compatibilité avec les dashboards existants
      recipientName: editMessageRecipient.trim(),
      recipientEmail: editMessageEmail.trim(),
      subject: editMessageSubject.trim(),
      content: editMessageContent.trim()
    };

    const updatedList = await saveCollectionItem<SupportMessage>(
      "messages",
      "haitiandev_support_messages_local",
      updatedMessage,
      messages
    );
    setMessages(updatedList);
    setEditingMessage(null);
  };

  const handleDeleteMessage = (id: string) => {
    const m = messages.find(msg => msg.id === id);
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'message',
      title: m?.subject || 'ce message'
    });
  };

  // ==================== PROJECTS CRUD ====================
  const handleOpenProjectModal = (proj: Project | null = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        title: proj.title,
        category: proj.category,
        year: proj.year,
        client: proj.client,
        shortDesc: proj.shortDesc,
        imageUrl: proj.imageUrl,
        actionUrl: proj.actionUrl
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: "",
        category: "SaaS",
        year: "2026",
        client: "",
        shortDesc: "",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
        actionUrl: ""
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      const updatedItem = { ...editingProject, ...projectForm };
      const updatedList = await saveCollectionItem<Project>("projects", "haitiandev_projects", updatedItem, projects);
      setProjects(updatedList);
    } else {
      const newProj: Project = {
        id: Date.now().toString(),
        ...projectForm
      };
      const updatedList = await saveCollectionItem<Project>("projects", "haitiandev_projects", newProj, projects);
      setProjects(updatedList);
    }
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    const p = projects.find(proj => proj.id === id);
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'project',
      title: p?.title || 'ce projet'
    });
  };

  // ==================== TESTIMONIALS CRUD ====================
  const handleOpenTestimonialModal = (testi: Testimonial | null = null) => {
    if (testi) {
      setEditingTestimonial(testi);
      setTestimonialForm({
        name: testi.name,
        roleCompany: testi.roleCompany,
        quote: testi.quote,
        avatarUrl: testi.avatarUrl
      });
    } else {
      setEditingTestimonial(null);
      setTestimonialForm({
        name: "",
        roleCompany: "",
        quote: "",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
      });
    }
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      const updatedItem = { ...editingTestimonial, ...testimonialForm };
      const updatedList = await saveCollectionItem<Testimonial>("testimonials", "haitiandev_testimonials", updatedItem, testimonials);
      setTestimonials(updatedList);
    } else {
      const newTesti: Testimonial = {
        id: Date.now().toString(),
        ...testimonialForm
      };
      const updatedList = await saveCollectionItem<Testimonial>("testimonials", "haitiandev_testimonials", newTesti, testimonials);
      setTestimonials(updatedList);
    }
    setIsTestimonialModalOpen(false);
  };

  const handleDeleteTestimonial = (id: string) => {
    const t = testimonials.find(testi => testi.id === id);
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'testimonial',
      title: t?.name || 'ce témoignage'
    });
  };

  // ==================== FORMATIONS CRUD ====================
  const handleOpenFormationModal = (formItem: FormationItem | null = null) => {
    if (formItem) {
      setEditingFormation(formItem);
      setFormationForm({
        titre: formItem.titre,
        formateur: formItem.formateur,
        dateDebut: formItem.dateDebut,
        duree: formItem.duree,
        niveau: formItem.niveau,
        organisme: formItem.organisme,
        lienInscription: formItem.lienInscription,
        urlImage: formItem.urlImage
      });
    } else {
      setEditingFormation(null);
      setFormationForm({
        titre: "",
        formateur: "",
        dateDebut: "",
        duree: "",
        niveau: "AVANCÉ",
        organisme: "",
        lienInscription: "",
        urlImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
      });
    }
    setIsFormationModalOpen(true);
  };

  const handleSaveFormation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFormation) {
      const updatedItem = { ...editingFormation, ...formationForm };
      const updatedList = await saveCollectionItem<any>("formations", "haitiandev_formations_local", updatedItem, formations);
      setFormations(updatedList);
    } else {
      const newForm: FormationItem = {
        id: Date.now().toString(),
        ...formationForm
      };
      const updatedList = await saveCollectionItem<any>("formations", "haitiandev_formations_local", newForm, formations);
      setFormations(updatedList);
    }
    setIsFormationModalOpen(false);
  };

  const handleDeleteFormation = (id: string) => {
    const f = formations.find(item => item.id === id);
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'formation',
      title: f?.titre || 'cette formation'
    });
  };

  // ==================== EDUCATION CRUD ====================
  const handleOpenEducationModal = (edu: EducationItem | null = null) => {
    if (edu) {
      setEditingEducation(edu);
      setEducationForm({
        type: edu.type,
        title: edu.title,
        author: typeof edu.author === 'object' && edu.author !== null ? ((edu.author as any).name || "HaitianDev Team") : (edu.author || ""),
        date: edu.date,
        tags: edu.tags || [],
        content: edu.content,
        bannerUrl: edu.bannerUrl,
        difficulty: edu.difficulty || "Intermédiaire",
        duration: edu.duration || "",
        certifyingBody: edu.certifyingBody || "HaitianDev Academy",
        registrationUrl: edu.registrationUrl || "",
        readingTime: edu.readingTime || "",
        summary: edu.summary || "",
        version: edu.version || "v1.0",
        category: edu.category || "",
        targetAudience: edu.targetAudience || "",
        documentUrl: edu.documentUrl || ""
      });
    } else {
      setEditingEducation(null);
      setEducationForm({
        type: eduTab === "formation" ? "Formation" : eduTab === "blog" ? "Blog" : "Doc",
        title: "",
        author: "",
        date: new Date().toISOString().split('T')[0],
        tags: eduTab === "formation" ? ["Formation", "Elite"] : eduTab === "blog" ? ["Blog", "Tech"] : ["Doc", "Guide"],
        content: "",
        bannerUrl: eduTab === "formation" 
          ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
          : eduTab === "blog"
          ? "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
          : "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
        difficulty: "Intermédiaire",
        duration: "",
        certifyingBody: "HaitianDev Academy",
        registrationUrl: "",
        readingTime: "",
        summary: "",
        version: "v1.0",
        category: "",
        targetAudience: "",
        documentUrl: ""
      });
    }
    setNewTagInput("");
    setIsEducationModalOpen(true);
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting education form", educationForm);
    const id = editingEducation ? editingEducation.id : Date.now().toString();

    let finalDocUrl = educationForm.documentUrl || "";
    
    if (educationForm.type === "Doc" && docFile) {
      setIsDocUploading(true);
      try {
        console.log("Uploading file to storage...");
        const storageRef = ref(storage, `documents/${Date.now()}_${docFile.name}`);
        await uploadBytes(storageRef, docFile);
        finalDocUrl = await getDownloadURL(storageRef);
        console.log("File uploaded, URL:", finalDocUrl);
      } catch (err) {
        console.error("Error uploading document:", err);
        alert("Erreur lors de l'upload du document dans le Cloud Storage.");
        setIsDocUploading(false);
        return;
      }
      setIsDocUploading(false);
    }
    
    // Validate if Doc type has required URL if not editing
    if (educationForm.type === "Doc" && !finalDocUrl && !editingEducation) {
        alert("Vous devez uploader un document pour le type 'Doc'.");
        return;
    }

    const saveItem = {
      id,
      ...educationForm,
      documentUrl: finalDocUrl,
      content: educationForm.content || (docFile ? `Document original: ${docFile.name}` : "Document technique HaitianDev")
    };
    // Determine target collection and local storage key based on item type
    let collectionName = "education_formations";
    let localKey = "haitiandev_edu_formations_local";

    if (educationForm.type === "Blog") {
      collectionName = "articles";
      localKey = "haitiandev_articles_local";
    } else if (educationForm.type === "Doc") {
      collectionName = "docs";
      localKey = "haitiandev_documents_local";
    }

    console.log("Saving item:", saveItem);
    console.log("CollectionName:", collectionName, "LocalKey:", localKey, "docFile:", docFile, "Type:", educationForm.type);

    try {
      await saveCollectionItem(collectionName, localKey, saveItem, educationItems);
      console.log("Item saved successfully");
      setDocFile(null);
      setIsEducationModalOpen(false);
      // Update local state to reflect the change
      if (editingEducation) {
        setEducationItems(prev => prev.map(item => item.id === id ? saveItem : item));
      } else {
        setEducationItems(prev => [...prev, saveItem]);
      }
    } catch (err) {
      console.error("Error saving item:", err);
      alert("Erreur lors de la sauvegarde : " + err);
    }
  };

  const handleDeleteEducation = (id: string) => {
    const edu = educationItems.find(ei => ei.id === id);
    setDeleteConfirmation({
      isOpen: true,
      itemId: id,
      itemType: 'education',
      title: edu?.title || "ce module d'éducation"
    });
  };

  const handleAddTag = () => {
    const currentTags = educationForm.tags || [];
    if (newTagInput.trim() && !currentTags.includes(newTagInput.trim())) {
      setEducationForm({
        ...educationForm,
        tags: [...currentTags, newTagInput.trim()]
      });
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = educationForm.tags || [];
    setEducationForm({
      ...educationForm,
      tags: currentTags.filter(t => t !== tagToRemove)
    });
  };

  // ==================== USERS STATUS / ROLE ACTIONS ====================
  const toggleUserStatus = async (id: string) => {
    const user = accounts.find(acc => acc.id === id);
    if (!user) return;

    const nextStatus = user.accessStatus === "Active" ? "Suspended" : "Active";
    const updatedUser = { ...user, accessStatus: nextStatus };
    const result = await saveCollectionItem("users", "haitiandev_users_local", updatedUser, accounts);
    setAccounts(result);
  };

  const changeUserRole = async (id: string, newRole: string) => {
    const user = accounts.find(acc => acc.id === id);
    if (!user) return;

    const updatedUser = { ...user, role: newRole };
    const result = await saveCollectionItem("users", "haitiandev_users_local", updatedUser, accounts);
    setAccounts(result);
  };

  if (isLiveEditing) {
    return <LiveVisualEditor onClose={() => setIsLiveEditing(false)} />;
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex justify-center relative font-sans w-full overflow-hidden">
      {/* Background visual cues */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#00209F]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#D21034]/5 blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-[1440px] flex relative z-10 h-full">
        {/* FIXED SIDEBAR */}
        <aside className="w-64 border-r border-slate-900 bg-slate-950/80 backdrop-blur-md hidden md:flex flex-col h-full z-20 shrink-0 p-6 justify-between">
        <div className="space-y-8">
          <div>
            <Link to="/" className="text-xs font-mono text-zinc-500 hover:text-[#00209F] transition-colors flex items-center space-x-1.5 justify-start pl-2 mb-6">
              <Home className="w-3.5 h-3.5" />
              <span>← Retour à l'accueil</span>
            </Link>
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#00209F] to-[#D21034] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-zinc-500 font-bold uppercase">HAITIANDEV INFRA</span>
            </div>
            <h2 className="text-xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00209F] to-[#D21034] uppercase mt-2 px-2.5">
              Admin Core
            </h2>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("content")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "content"
                  ? "bg-gradient-to-r from-[#00209F]/25 to-[#D21034]/25 border border-white/10 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <FolderGit2 className="w-4 h-4 text-red-500" />
              <span>Gestion Contenu</span>
            </button>

            <button
              onClick={() => setActiveTab("accounts")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "accounts"
                  ? "bg-gradient-to-r from-[#00209F]/25 to-[#D21034]/25 border border-white/10 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <Users className="w-4 h-4 text-blue-500" />
              <span>Gestion Comptes</span>
            </button>

            <button
              onClick={() => setActiveTab("devis")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "devis"
                  ? "bg-gradient-to-r from-[#00209F]/25 to-[#D21034]/25 border border-white/10 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <ClipboardList className="w-4 h-4 text-emerald-500" />
              <span>Gestion Devis [{devisList.filter(d => d.status === "Nouveau").length}]</span>
            </button>

            <button
              onClick={() => setActiveTab("popups")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "popups"
                  ? "bg-gradient-to-r from-[#00209F]/25 to-[#D21034]/25 border border-white/10 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <Megaphone className="w-4 h-4 text-purple-500" />
              <span>Gestion Popups ({popups.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "messages"
                  ? "bg-gradient-to-r from-[#00209F]/25 to-[#D21034]/25 border border-white/10 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-pink-500" />
              <span>Gestion Messages</span>
            </button>

            <button
              onClick={() => setActiveTab("credentials")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "credentials"
                  ? "bg-gradient-to-r from-[#00209F]/25 to-[#D21034]/25 border border-white/10 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Accès Projets CMS</span>
            </button>

            <button
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "billing"
                  ? "bg-gradient-to-r from-[#00209F]/25 to-[#D21034]/25 border border-white/10 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <span>Facturation</span>
            </button>

            <button
              onClick={() => setActiveTab("stats")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "stats"
                  ? "bg-gradient-to-r from-[#00209F]/25 to-[#D21034]/25 border border-white/10 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-yellow-500" />
              <span>Statistiques</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-[#00209F]/25 to-[#D21034]/25 border border-white/10 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <Settings className="w-4 h-4 text-teal-500" />
              <span>Mon Profil</span>
            </button>
          </nav>
        </div>

        {/* Short footer meta info */}
        <div className="border-t border-slate-900 pt-6 space-y-6">
          <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-900 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00209F] to-[#D21034] flex items-center justify-center font-bold text-xs">
              HD
            </div>
          <button 
            onClick={async () => {
              try {
                await signOut(auth);
              } catch(e) {}
              localStorage.removeItem("haitiandev_admin_session");
              navigate('/admin-login');
            }}
            className="flex items-center space-x-2 text-xs text-red-500 hover:text-red-400 font-mono uppercase tracking-widest border border-red-500/20 px-3 py-1.5 rounded-lg transition-all"
          >
            <LogOut className="w-3 h-3" />
            <span>Déconnexion</span>
          </button>
          </div>
        </div>
      </aside>

      {/* MOBILE COMPACT SELECTOR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-900 z-30 px-4 py-3 flex gap-2 overflow-x-auto justify-center">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "content"
              ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white"
              : "bg-slate-900 border border-slate-800 text-zinc-400"
          }`}
        >
          Gestion Contenu
        </button>
        <button
          onClick={() => setActiveTab("accounts")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "accounts"
              ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white"
              : "bg-slate-900 border border-slate-800 text-zinc-400"
          }`}
        >
          Comptes
        </button>
        <button
          onClick={() => setActiveTab("devis")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "devis"
              ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white"
              : "bg-slate-900 border border-slate-800 text-zinc-400"
          }`}
        >
          Devis ({devisList.filter(d => d.status === "Nouveau").length})
        </button>
        <button
          onClick={() => setActiveTab("popups")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "popups"
              ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white"
              : "bg-slate-900 border border-slate-800 text-zinc-400"
          }`}
        >
          Popups ({popups.length})
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "messages"
              ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white"
              : "bg-slate-900 border border-slate-800 text-zinc-400"
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab("credentials")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "credentials"
              ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white"
              : "bg-slate-900 border border-slate-800 text-zinc-400"
          }`}
        >
          Accès CMS Projets
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "stats"
              ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white"
              : "bg-slate-900 border border-slate-800 text-zinc-400"
          }`}
        >
          Statistiques
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white"
              : "bg-slate-900 border border-slate-800 text-zinc-400"
          }`}
        >
          Mon Profil
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8 z-10 w-full md:pt-10 pt-20 overflow-y-auto overflow-x-hidden">
        
        {/* SUBTAB BAR (If content management is active) */}
        {activeTab === "content" && (
          <div className="flex space-x-2 border-b border-slate-900 pb-4 max-w-max">
            <button
              onClick={() => setContentSubTab("projects")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                contentSubTab === "projects"
                  ? "bg-slate-900 border border-slate-800 text-white shadow-md shadow-black/40"
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Projets ({projects.length})</span>
            </button>
            <button
              onClick={() => setContentSubTab("testimonials")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                contentSubTab === "testimonials"
                  ? "bg-slate-900 border border-slate-800 text-white shadow-md shadow-black/40"
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-red-500" />
              <span>Témoignages ({testimonials.length})</span>
            </button>
            <button
              onClick={() => setContentSubTab("formations")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                contentSubTab === "formations"
                  ? "bg-slate-900 border border-slate-800 text-white shadow-md shadow-black/40"
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-red-500 font-extrabold" />
              <span>Formations ({formations.length})</span>
            </button>
            <button
              onClick={() => setContentSubTab("education")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                contentSubTab === "education"
                  ? "bg-slate-900 border border-slate-800 text-white shadow-md shadow-black/40"
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-yellow-500" />
              <span>Éducation ({educationItems.length})</span>
            </button>
            <button
              onClick={() => setContentSubTab("partners")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                contentSubTab === "partners"
                  ? "bg-slate-900 border border-slate-800 text-white shadow-md shadow-black/40"
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
              <span>Partenaires ({partners.length})</span>
            </button>
            <button
              onClick={() => setContentSubTab("landingStats")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                contentSubTab === "landingStats"
                  ? "bg-slate-900 border border-slate-800 text-white shadow-md shadow-black/40"
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Stats Landing (4)</span>
            </button>
          </div>
        )}

        {/* ---------------- SECTION 1.1: PROJECTS TABLE & ACTION ---------------- */}
        {activeTab === "content" && contentSubTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => handleOpenProjectModal(null)}
                className="bg-gradient-to-r from-[#00209F] to-[#D21034] hover:brightness-110 text-white font-semibold text-xs tracking-wider uppercase rounded-xl px-4 py-3 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Projet</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-xl">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-950/60 text-zinc-400 text-xs font-mono uppercase border-b border-slate-900 font-bold">
                  <tr>
                    <th className="p-4 pl-6">Projet / Image</th>
                    <th className="p-4">Catégorie</th>
                    <th className="p-4">Année / Client</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/40">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500">Aucun projet enregistré.</td>
                    </tr>
                  ) : (
                    projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="p-4 pl-6 flex items-center space-x-4">
                          <img 
                            src={proj.imageUrl} 
                            alt={proj.title} 
                            className="w-12 h-10 object-cover rounded-lg border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-display font-bold text-white text-sm">{proj.title}</p>
                            <a href={proj.actionUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-blue-500 hover:underline flex items-center gap-1">
                              <LinkIcon className="w-3 h-3" /> Lien Action
                            </a>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-extrabold bg-blue-950/40 border border-blue-900/60 text-blue-400">
                            {proj.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-xs text-zinc-300 font-mono">{proj.year}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{proj.client}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-xs text-zinc-400 max-w-xs truncate">{proj.shortDesc}</p>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenProjectModal(proj)}
                            className="p-2 rounded-lg border border-slate-800 bg-slate-900/30 text-zinc-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 rounded-lg border border-slate-800 bg-slate-900/30 text-red-400 hover:bg-red-950/10 hover:text-red-500 hover:border-red-900/40 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 1.2: TESTIMONIALS TABLE & ACTION ---------------- */}
        {activeTab === "content" && contentSubTab === "testimonials" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => handleOpenTestimonialModal(null)}
                className="bg-gradient-to-r from-[#00209F] to-[#D21034] hover:brightness-110 text-white font-semibold text-xs tracking-wider uppercase rounded-xl px-4 py-3 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Témoignage</span>
              </button>
            </div>

            {/* Google My Business Configuration Card */}
            <div className="bg-slate-900/40 backdrop-blur-lg border border-slate-800 p-5 rounded-3xl space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-xl">
                  <Star className="w-5 h-5 fill-yellow-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">Configuration Avis Google My Business</h4>
                  <p className="text-[11px] text-zinc-500">Insérez le lien vers votre page Google Reviews. Les utilisateurs de la page d'accueil pourront cliquer sur l'un des boutons 5 étoiles pour l'ouvrir.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <input 
                  type="url"
                  value={googleBusinessUrl}
                  onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                  placeholder="https://g.page/r/YOUR_GOOOGLE_ID/review"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D21034]"
                />
              </div>
            </div>

            {/* Grid layout of testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.length === 0 ? (
                <div className="col-span-2 text-center p-8 text-zinc-500 border border-slate-800 bg-slate-900/10 rounded-2xl">
                  Aucun témoignage enregistré.
                </div>
              ) : (
                testimonials.map((testi) => (
                  <div 
                    key={testi.id} 
                    className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-xl flex flex-col justify-between hover:border-slate-700/60 transition-all duration-300 relative group"
                  >
                    <div>
                      <span className="text-3xl font-serif text-red-500/30 absolute top-4 left-6 pointer-events-none">“</span>
                      <p className="text-zinc-300 text-xs sm:text-sm italic leading-relaxed pl-4 pt-2 relative z-10">
                        {testi.quote}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-900 mt-6 pt-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={testi.avatarUrl} 
                          alt={testi.name} 
                          className="w-10 h-10 object-cover rounded-full border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-display font-medium text-xs sm:text-sm text-white">{testi.name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{testi.roleCompany}</p>
                        </div>
                      </div>

                      <div className="flex space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenTestimonialModal(testi)}
                          className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(testi.id)}
                          className="p-2 rounded-lg border border-slate-800 bg-slate-950 text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 1.2b: FORMATIONS TABLE & ACTION ---------------- */}
        {activeTab === "content" && contentSubTab === "formations" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-lg border border-slate-800 p-5 rounded-3xl">
              <div>
                <h3 className="text-base font-bold text-white font-display">Gestion des Formations</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Ajoutez, modifiez ou supprimez les cours et certifications affichés sur l'onglet Formations. Tout changement est directement synchronisé.
                </p>
              </div>
              <button
                onClick={() => handleOpenFormationModal(null)}
                className="bg-gradient-to-r from-[#00209F] to-[#D21034] hover:brightness-110 text-white font-semibold text-xs tracking-wider uppercase rounded-xl px-4 py-3 flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-black/40"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle Formation</span>
              </button>
            </div>

            <div className="bg-slate-950/30 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/30">
                    <th className="p-4 pl-6 text-[11px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">Formation / Cover</th>
                    <th className="p-4 text-[11px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">Détails Enseigne</th>
                    <th className="p-4 text-[11px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">Niveau & Organisme</th>
                    <th className="p-4 text-[11px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">Inscription</th>
                    <th className="p-4 pr-6 text-right text-[11px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {formations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500 text-xs">
                        Aucune formation disponible. Cliquez sur "Nouvelle Formation" pour en ajouter une.
                      </td>
                    </tr>
                  ) : (
                    formations.map((formItem) => (
                      <tr key={formItem.id} className="hover:bg-slate-900/10 transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="flex items-center space-x-4">
                            <img
                              src={formItem.urlImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80"}
                              alt={formItem.titre}
                              className="w-16 h-10 object-cover rounded-lg border border-slate-800 bg-slate-900 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="max-w-xs sm:max-w-md">
                              <p className="font-display font-bold text-xs sm:text-sm text-white leading-snug group-hover:text-red-400 transition-colors">
                                {formItem.titre}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-[10px] bg-slate-900 text-zinc-400 px-2 py-0.5 rounded-full font-mono border border-slate-800">
                                  ID: {formItem.id}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-xs text-white font-medium">{formItem.formateur}</p>
                          <div className="flex items-center space-x-4 mt-1 text-[10px] text-zinc-400 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-red-500" />
                              {formItem.dateDebut}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-blue-500" />
                              {formItem.duree}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            formItem.niveau === "AVANCÉ"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : formItem.niveau === "INTERMÉDIAIRE"
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}>
                            {formItem.niveau}
                          </span>
                          <p className="text-[10px] text-zinc-400 mt-1 max-w-[150px] truncate">{formItem.organisme}</p>
                        </td>
                        <td className="p-4">
                          {formItem.lienInscription ? (
                            <a
                              href={formItem.lienInscription}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] bg-red-950/20 hover:bg-red-900/20 border border-red-500/10 text-red-400 px-2 py-1 rounded-lg inline-flex items-center gap-1 font-mono transition-all"
                            >
                              <LinkIcon className="w-2.5 h-2.5" />
                              <span>Lien Direct</span>
                            </a>
                          ) : (
                            <span className="text-[10px] text-zinc-500 font-mono">Formulaire Interne UI</span>
                          )}
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenFormationModal(formItem)}
                            className="p-2 rounded-lg border border-slate-800 bg-slate-900/30 text-zinc-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer inline-flex"
                            title="Modifier"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFormation(formItem.id)}
                            className="p-2 rounded-lg border border-slate-800 bg-slate-900/30 text-red-500 hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/40 transition-colors cursor-pointer inline-flex"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 1.3: UNIFIED EDUCATION TABLE & ACTION ---------------- */}
        {activeTab === "content" && contentSubTab === "education" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => handleOpenEducationModal(null)}
                className="bg-gradient-to-r from-[#00209F] to-[#D21034] hover:brightness-110 text-white font-semibold text-xs tracking-wider uppercase rounded-xl px-4 py-3 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {eduTab === "formation"
                    ? "Nouvelle Formation"
                    : eduTab === "blog"
                    ? "Nouveau Blog"
                    : "Nouveau Doc"}
                </span>
              </button>
            </div>

            {/* Inner Subtabs for Education */}
            <div className="flex flex-wrap gap-2 border-b border-slate-900/50 pb-2">
              <button
                onClick={() => setEduTab("formation")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  eduTab === "formation"
                    ? "bg-gradient-to-r from-[#00209F]/15 to-[#D21034]/15 border border-red-500/35 text-white shadow-md shadow-black/40"
                    : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <span>🎓 Formation ({educationItems.filter(e => e.type === "Formation").length})</span>
              </button>
              <button
                onClick={() => setEduTab("blog")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  eduTab === "blog"
                    ? "bg-gradient-to-r from-[#00209F]/15 to-[#D21034]/15 border border-red-500/35 text-white shadow-md shadow-black/40"
                    : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <span>📝 Blog ({educationItems.filter(e => e.type === "Blog").length})</span>
              </button>
              <button
                onClick={() => setEduTab("doc")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  eduTab === "doc"
                    ? "bg-gradient-to-r from-[#00209F]/15 to-[#D21034]/15 border border-red-500/35 text-white shadow-md shadow-black/40"
                    : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <span>📄 Documentation ({educationItems.filter(e => e.type === "Doc").length})</span>
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {educationItems.filter(edu => {
                if (eduTab === "formation") return edu.type === "Formation";
                if (eduTab === "blog") return edu.type === "Blog";
                return edu.type === "Doc";
              }).length === 0 ? (
                <div className="p-8 text-center text-zinc-500 border border-slate-800 bg-slate-900/10 rounded-2xl">
                  {eduTab === "formation" && "Aucune formation disponible pour le moment."}
                  {eduTab === "blog" && "Aucun article de blog disponible."}
                  {eduTab === "doc" && "Aucun document de support ou d'aide disponible."}
                </div>
              ) : (
                educationItems
                  .filter(edu => {
                    if (eduTab === "formation") return edu.type === "Formation";
                    if (eduTab === "blog") return edu.type === "Blog";
                    return edu.type === "Doc";
                  })
                  .map((edu) => (
                    <div 
                      key={edu.id} 
                      className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-900/30 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="hidden sm:block shrink-0 relative">
                          <img 
                            src={edu.bannerUrl} 
                            alt={edu.title} 
                            className="w-24 h-16 object-cover rounded-xl border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute -top-2 -left-2 shadow-md">
                            {edu.type === "Formation" && <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-emerald-950 border border-emerald-800 text-emerald-400">Formation</span>}
                            {edu.type === "Blog" && <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-blue-950 border border-blue-800 text-blue-400">Blog</span>}
                            {edu.type === "Doc" && <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-yellow-950 border border-yellow-800 text-yellow-400">Doc</span>}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2.5">
                            <span className="sm:hidden">
                              {edu.type === "Formation" && <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-emerald-950 border border-emerald-800 text-emerald-400">Formation</span>}
                              {edu.type === "Blog" && <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-blue-950 border border-blue-800 text-blue-400">Blog</span>}
                              {edu.type === "Doc" && <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-yellow-950 border border-yellow-800 text-yellow-400">Doc</span>}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">Par {typeof edu.author === 'object' && edu.author !== null ? ((edu.author as any).name || "HaitianDev Team") : (edu.author || "HaitianDev Team")} • Créé le {edu.date}</span>
                          </div>
                          <h4 className="text-white font-display font-medium text-base leading-snug">{edu.title}</h4>
                          
                          {/* Adapted display fields */}
                          {edu.type === "Formation" && (
                            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-400">
                              {edu.duration && (
                                <span className="flex items-center space-x-1 uppercase text-yellow-500 font-bold bg-yellow-950/25 px-2 py-0.5 rounded">
                                  <Clock className="w-3 h-3" />
                                  <span>{edu.duration}</span>
                                </span>
                              )}
                              {edu.difficulty && (
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  edu.difficulty === "Débutant" ? "bg-emerald-950/40 border border-emerald-850/40 text-emerald-400" :
                                  edu.difficulty === "Intermédiaire" ? "bg-amber-950/40 border border-amber-850/40 text-amber-400" :
                                  "bg-rose-950/40 border border-rose-850/40 text-rose-400"
                                }`}>
                                  {edu.difficulty}
                                </span>
                              )}
                              {edu.certifyingBody && (
                                <span className="text-zinc-500">Certifié par : {edu.certifyingBody}</span>
                              )}
                              {edu.registrationUrl && (
                                <span className="text-emerald-500 bg-emerald-950/20 border border-emerald-900/30 px-1.5 py-0.5 rounded text-[9px] truncate max-w-xs font-mono font-bold">
                                  Lien : {edu.registrationUrl}
                                </span>
                              )}
                            </div>
                          )}

                          {edu.type === "Blog" && (
                            <div className="space-y-1">
                              {edu.summary && (
                                <p className="text-xs text-zinc-400 line-clamp-1 italic">« {edu.summary} »</p>
                              )}
                              {edu.readingTime && (
                                <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-blue-400 uppercase font-bold bg-blue-950/25 px-2 py-0.5 rounded">
                                  <Clock className="w-3 h-3" />
                                  <span>{edu.readingTime}</span>
                                </span>
                              )}
                            </div>
                          )}

                          {edu.type === "Doc" && (
                            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-400">
                              {edu.version && (
                                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-bold">
                                  Version {edu.version}
                                </span>
                              )}
                              {edu.category && (
                                <span className="text-zinc-300 font-semibold uppercase">{edu.category}</span>
                              )}
                              {edu.targetAudience && (
                                <span className="text-zinc-500 text-[9px] italic">Public : {edu.targetAudience}</span>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1">
                            {(edu.tags || []).map(t => (
                              <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-zinc-500 uppercase tracking-wider">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 border-t lg:border-t-0 border-slate-900 pt-4 lg:pt-0 shrink-0 self-end lg:self-center w-full lg:w-auto justify-between lg:justify-end">
                        <div className="text-right hidden lg:block">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Aperçu du contenu</p>
                          <p className="text-xs text-zinc-400 max-w-xs truncate italic">{edu.content}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const shareUrl = `${window.location.origin}/education/${edu.id}`;
                              navigator.clipboard.writeText(shareUrl).then(() => {
                                alert("Lien copié dans le presse-papier !");
                              }).catch(err => {
                                console.error('Erreur lors de la copie du lien: ', err);
                              });
                            }}
                            className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-zinc-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                            title="Partager"
                          >
                            <Share className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEducationModal(edu)}
                            className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-zinc-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEducation(edu.id)}
                            className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-red-400 hover:text-red-500 hover:border-red-950 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* ---------------- SECTION 1.4: PARTNERS TABLE & ACTION ---------------- */}
        {activeTab === "content" && contentSubTab === "partners" && (
          <div className="space-y-6">
            <div className="flex justify-end p-2">
              <button
                onClick={() => {
                  setPartnerName("");
                  setPartnerLogoUrl("");
                  setPartnerWebsiteUrl("");
                  setPartnerIcon("Globe");
                  setPartnerColor("text-blue-500");
                  setEditingPartner(null);
                  setPartnerModalOpen(true);
                }}
                className="bg-gradient-to-r from-[#00209F] to-[#D21034] hover:opacity-90 active:scale-95 transition-all text-xs font-bold font-mono tracking-wider uppercase rounded-xl px-5 py-3.5 text-white flex items-center space-x-2 shadow-lg shadow-red-500/10 hover:shadow-red-500/25 border border-white/10 shrink-0 cursor-pointer hover:scale-[1.02] duration-300"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Ajouter un Partenaire</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {partners.length === 0 ? (
                 <div className="col-span-full bg-slate-900/30 border border-slate-800 p-8 rounded-3xl text-center flex flex-col items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                     <Briefcase className="w-6 h-6 text-zinc-400" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">Aucun partenaire enregistré</h3>
                   <p className="text-zinc-500 text-sm max-w-sm mx-auto">Ajoutez le tout premier partenaire qui fera surface sur votre application !</p>
                 </div>
              ) : (
                partners.map(partner => (
                  <div key={partner.id} className="group relative bg-slate-900/40 backdrop-blur-lg border border-slate-800 p-6 rounded-3xl overflow-hidden hover:border-[#D21034]/30 transition-all flex justify-between items-center">
                    <div className="space-y-2 flex-1 mr-4 overflow-hidden">
                      <div className="flex items-center space-x-3">
                         {partner.logoUrl ? (
                           <img 
                             src={partner.logoUrl} 
                             alt={partner.name} 
                             referrerPolicy="no-referrer"
                             className="w-10 h-10 object-contain p-1 rounded-xl bg-slate-950 border border-slate-900 shrink-0"
                             onError={(e) => {
                               e.currentTarget.style.display = 'none';
                             }}
                           />
                         ) : (
                           <span className={`p-2 rounded-xl bg-slate-950 border border-slate-900 ${partner.color || 'text-zinc-400'}`}>
                             <Briefcase className="w-5 h-5" />
                           </span>
                         )}
                         <div className="overflow-hidden">
                           <h4 className="text-white font-display font-medium text-lg truncate">{partner.name}</h4>
                           {partner.websiteUrl && (
                             <a 
                               href={partner.websiteUrl} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="text-[11px] text-[#00209F] hover:underline block truncate max-w-[200px]"
                             >
                               {partner.websiteUrl}
                             </a>
                           )}
                         </div>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                         Icon: {partner.icon} • Color: {partner.color}
                      </div>
                    </div>
                    <div className="flex space-x-2 shrink-0">
                       <button
                         onClick={() => {
                           setPartnerName(partner.name || "");
                           setPartnerLogoUrl(partner.logoUrl || "");
                           setPartnerWebsiteUrl(partner.websiteUrl || "");
                           setPartnerIcon(partner.icon || "Globe");
                           setPartnerColor(partner.color || "text-blue-500");
                           setEditingPartner(partner);
                           setPartnerModalOpen(true);
                         }}
                         className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-blue-400 hover:text-blue-500 hover:border-blue-950 transition-colors cursor-pointer flex items-center justify-center ss-edit-partner-btn"
                         title="Modifier"
                       >
                         <Edit className="w-4 h-4" />
                       </button>
                       <button
                         onClick={async () => {
                           if (safeConfirm("Supprimer ce partenaire ?")) {
                             const updatedPartners = await deleteCollectionItem<any>("partners", "haitiandev_partners", partner.id, partners);
                             setPartners(updatedPartners);
                           }
                         }}
                         className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-red-400 hover:text-red-500 hover:border-red-950 transition-colors cursor-pointer flex items-center justify-center"
                         title="Supprimer"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Custom Modal for Adding / Editing Partner */}
            {partnerModalOpen && (
              <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/80 space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-xl font-display font-extrabold text-white">
                      {editingPartner ? "Modifier le Partenaire" : "Nouveau Partenaire"}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {editingPartner ? "Configurez les données mises à jour de cette marque." : "Configurez une marque d'élite pour le carrousel principal."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-2 font-bold uppercase tracking-wider">Nom du Partenaire *</label>
                      <input 
                        type="text" 
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="Ex: TechNova"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D21034]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-2 font-bold uppercase tracking-wider">Lien du Logo (Image URL)</label>
                      <input 
                        type="url" 
                        value={partnerLogoUrl}
                        onChange={(e) => setPartnerLogoUrl(e.target.value)}
                        placeholder="Ex: https://haitiandev.com/assets/logo.png"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D21034]"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Laisser vide pour utiliser une icône de secours par défaut.</span>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-2 font-bold uppercase tracking-wider">Lien de redirection (Site Web)</label>
                      <input 
                        type="url" 
                        value={partnerWebsiteUrl}
                        onChange={(e) => setPartnerWebsiteUrl(e.target.value)}
                        placeholder="Ex: https://technova.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D21034]"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Le logo deviendra cliquable vers ce site web de destination.</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-2 font-bold uppercase tracking-wider">Icône de secours</label>
                        <select 
                          value={partnerIcon}
                          onChange={(e) => setPartnerIcon(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                        >
                          {["Globe", "Hexagon", "Triangle", "Box", "Circle", "Target", "Layers", "Activity", "Users", "Star", "Shield", "Zap", "Sparkles", "Building", "Rocket", "Code2", "Cloud"].map(iconName => (
                            <option key={iconName} value={iconName} className="bg-slate-950">{iconName}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-2 font-bold uppercase tracking-wider">Couleur icône de secours</label>
                        <select 
                          value={partnerColor}
                          onChange={(e) => setPartnerColor(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                        >
                          <option value="text-blue-500" className="bg-slate-950">Bleu (Blue)</option>
                          <option value="text-red-500" className="bg-slate-950">Rouge (Red)</option>
                          <option value="text-[#10b981]" className="bg-slate-950">Vert (Emerald)</option>
                          <option value="text-purple-500" className="bg-slate-950">Violet (Purple)</option>
                          <option value="text-orange-500" className="bg-slate-950">Orange</option>
                          <option value="text-cyan-500" className="bg-slate-950">Cyan</option>
                          <option value="text-pink-500" className="bg-slate-950">Rose (Pink)</option>
                          <option value="text-yellow-500" className="bg-slate-950">Jaune (Yellow)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 justify-end pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPartnerModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!partnerName.trim()) {
                          alert("Le nom du partenaire est obligatoire !");
                          return;
                        }

                        if (editingPartner) {
                          const updatedPartner = {
                            ...editingPartner,
                            name: partnerName.trim(),
                            logoUrl: partnerLogoUrl.trim() || "",
                            websiteUrl: partnerWebsiteUrl.trim() || "",
                            icon: partnerIcon,
                            color: partnerColor
                          };
                          const updatedList = await saveCollectionItem<any>("partners", "haitiandev_partners", updatedPartner, partners);
                          setPartners(updatedList);
                        } else {
                          const newPartner = {
                            id: Date.now().toString(),
                            name: partnerName.trim(),
                            logoUrl: partnerLogoUrl.trim() || "",
                            websiteUrl: partnerWebsiteUrl.trim() || "",
                            icon: partnerIcon,
                            color: partnerColor
                          };
                          const updatedList = await saveCollectionItem<any>("partners", "haitiandev_partners", newPartner, partners);
                          setPartners(updatedList);
                        }
                        setPartnerModalOpen(false);
                      }}
                    >
                      {editingPartner ? "Enregistrer" : "Ajouter"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- SECTION 1.5: LANDING STATS EDITOR ---------------- */}
        {activeTab === "content" && contentSubTab === "landingStats" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header section with actions */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const confirmReset = safeConfirm("Réinitialiser les statistiques aux valeurs d'usine ?");
                    if (confirmReset) {
                      const defaults = {
                        id: "main_stats",
                        fondateur: "2",
                        expert: "12",
                        projet: "10+",
                        anne: "1"
                      };
                      handleSaveAppStats(defaults);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Valeurs par défaut
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSaveAppStats(statsDoc);
                    alert("Statistiques de la landing page sauvegardées sur Firestore !");
                  }}
                  className="bg-gradient-to-r from-[#00209F] to-[#D21034] hover:opacity-90 active:scale-95 transition-all text-xs font-bold font-mono tracking-wider uppercase rounded-xl px-5 py-2.5 text-white flex items-center space-x-2 shadow-lg shadow-red-500/10 hover:shadow-red-500/25 border border-white/10 shrink-0 cursor-pointer hover:scale-[1.02] duration-300"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer sur Firestore</span>
                </button>
              </div>

            {/* Flat form for the 4 specific stats requested */}
            <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Nombre de Fondateurs
                  </label>
                  <input
                    type="text"
                    value={statsDoc.fondateur}
                    onChange={(e) => setStatsDoc({ ...statsDoc, fondateur: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-xl font-bold text-white font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                    placeholder="ex: 2"
                  />
                  <p className="text-[9px] text-zinc-600 font-mono italic">Label: FONDATEURS / FOUNDERS</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Nombre d'Experts
                  </label>
                  <input
                    type="text"
                    value={statsDoc.expert}
                    onChange={(e) => setStatsDoc({ ...statsDoc, expert: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-xl font-bold text-white font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all"
                    placeholder="ex: 12"
                  />
                  <p className="text-[9px] text-zinc-600 font-mono italic">Label: EXPERTS / EXPERTS</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Nombre de Projets
                  </label>
                  <input
                    type="text"
                    value={statsDoc.projet}
                    onChange={(e) => setStatsDoc({ ...statsDoc, projet: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-xl font-bold text-white font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all"
                    placeholder="ex: 10+"
                  />
                  <p className="text-[9px] text-zinc-600 font-mono italic">Label: PROJETS / PROJECTS</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    Années d'Expérience
                  </label>
                  <input
                    type="text"
                    value={statsDoc.anne}
                    onChange={(e) => setStatsDoc({ ...statsDoc, anne: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-xl font-bold text-white font-mono focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 outline-none transition-all"
                    placeholder="ex: 1"
                  />
                  <p className="text-[9px] text-zinc-600 font-mono italic">Label: AN / YEAR</p>
                </div>
              </div>

              {/* Live Preview row */}
              <div className="pt-8 border-t border-slate-800/50">
                <h4 className="text-center text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">Aperçu en Temps Réel sur la Landing</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { val: statsDoc.fondateur, label: "Fondateurs" },
                    { val: statsDoc.expert, label: "Experts" },
                    { val: statsDoc.projet, label: "Projets" },
                    { val: statsDoc.anne, label: "An" }
                  ].map((s, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/50 border border-slate-800">
                      <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 font-mono">{s.val}</span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 2: ACCOUNTS TABLE ---------------- */}
        {activeTab === "accounts" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pb-2">
              <div className="relative group min-w-[200px] sm:min-w-[280px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Rechercher par nom d'élite..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 transition-all"
                />
              </div>

              <button
                onClick={() => setIsAccountModalOpen(true)}
                className="bg-gradient-to-r from-[#00209F] to-[#D21034] hover:opacity-90 active:scale-95 transition-all text-xs font-bold font-mono tracking-wider uppercase rounded-xl px-5 py-3.5 text-white flex items-center justify-center space-x-2 shadow-lg shadow-red-500/10 hover:shadow-red-500/25 border border-white/10 shrink-0 cursor-pointer hover:scale-[1.02] duration-300"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Nouveau Profil</span>
              </button>
            </div>

            {/* Role filtering subtabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-900/50 pb-3">
              {[
                { id: "all", label: "👥 Tous les Rôles", count: accounts.length },
                { id: "Admin", label: "🛡️ Admins", count: accounts.filter(acc => acc.role === "Admin").length },
                { id: "Étudiant", label: "🎓 Étudiants", count: accounts.filter(acc => acc.role === "Étudiant").length },
                { id: "Client", label: "💼 Clients", count: accounts.filter(acc => acc.role === "Client").length }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setAccountsSubTab(sub.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    accountsSubTab === sub.id
                      ? "bg-gradient-to-r from-[#00209F]/15 to-[#D21034]/15 border border-red-500/35 text-white shadow-md shadow-black/40"
                      : "text-zinc-500 hover:text-zinc-350 bg-slate-900/20 border border-transparent"
                  }`}
                >
                  <span>{sub.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/60 border border-slate-800 font-bold ${accountsSubTab === sub.id ? "text-red-400 border-red-500/20" : "text-zinc-400"}`}>
                    {sub.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-xl">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-950/60 text-zinc-400 text-xs font-mono uppercase border-b border-slate-900 font-bold">
                  <tr>
                    <th className="p-4 pl-6">Profil Membre</th>
                    <th className="p-4">Rôle</th>
                    <th className="p-4">Adresse de Connexion</th>
                    <th className="p-4">Statut de l'Accès</th>
                    <th className="p-4 pr-6 text-right">Rôle & Suspension</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/40">
                  {accounts
                    .filter((acc) => {
                      // Filter by tab
                      const matchesTab = accountsSubTab === "all" || acc.role === accountsSubTab;
                      
                      // Filter by search term
                      const matchesSearch = !userSearchTerm.trim() || 
                        (acc.fullName || "").toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        (acc.email || "").toLowerCase().includes(userSearchTerm.toLowerCase());

                      return matchesTab && matchesSearch;
                    })
                    .map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="p-4 pl-6 flex items-center space-x-3 w-auto max-w-xs sm:max-w-none truncate">
                          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold font-mono text-zinc-400 text-sm shrink-0">
                            {(acc.fullName || "U").charAt(0)}
                          </div>
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <p className="font-display font-bold text-white text-sm">{acc.fullName}</p>
                              {acc.role === "Client" && acc.companyName && (
                                <span className="bg-gradient-to-r from-[#00209F]/10 to-[#D21034]/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                                  🏢 {acc.companyName}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-mono text-zinc-500">ID: {acc.id.substring(0, 12)}...</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <select
                              value={acc.role}
                              onChange={(e) => changeUserRole(acc.id, e.target.value)}
                              className="bg-slate-950 border border-slate-800 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="Admin">Admin</option>
                              <option value="Étudiant">Étudiant</option>
                              <option value="Client">Client</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-xs text-zinc-400">{acc.email}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            acc.accessStatus === "Active" 
                              ? "bg-emerald-950/40 border border-emerald-900 text-emerald-400" 
                              : acc.accessStatus === "Pending"
                                ? "bg-amber-950/40 border border-amber-900 text-amber-400"
                                : "bg-red-950/40 border border-red-900 text-red-400"
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${acc.accessStatus === "Active" ? "bg-emerald-400" : acc.accessStatus === "Pending" ? "bg-amber-400" : "bg-red-400"} animate-pulse`} />
                            <span>{acc.accessStatus}</span>
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => toggleUserStatus(acc.id)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                              acc.accessStatus === "Active"
                                ? "bg-red-950/10 border-red-900/30 text-red-400 hover:bg-red-950/20"
                                : "bg-emerald-950/10 border-emerald-900/30 text-emerald-400 hover:bg-emerald-950/20"
                            }`}
                          >
                            {acc.accessStatus === "Active" ? "Suspendre" : "Activer"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 3: DEVIS MANAGEMENT ---------------- */}
        {activeTab === "devis" && (
          <div className="space-y-6">
            
            {/* List entries for current subtab */}
            <div className="space-y-4">
              {(() => {
                const filtered = devisList.filter(d => {
                  if (devisSubTab === "all") return true;
                  if (devisSubTab === "Formation") return d.serviceType.startsWith("Formation:");
                  return d.serviceType === devisSubTab;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center text-zinc-500 border border-slate-900 bg-slate-900/10 rounded-2xl font-mono text-sm leading-relaxed">
                      Aucune demande de devis enregistrée pour ce domaine d'activité.
                    </div>
                  );
                }

                return filtered.map((d) => (
                  <div
                    key={d.id}
                    className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-xl flex flex-col xl:flex-row xl:items-start justify-between gap-6 hover:bg-slate-900/30 transition-all duration-300"
                  >
                    {/* Header info: customer & specs */}
                    <div className="space-y-4 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest bg-slate-900 border border-slate-800 text-zinc-400`}>
                          {d.serviceType}
                        </span>

                        <span className="text-[10px] font-mono text-zinc-500">ID: devis_{d.id.slice(-6)} • Reçu le {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A'}</span>
                        
                        {/* Status badge */}
                        <div className="ml-auto xl:ml-2">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            d.status === "Nouveau / En attente" ? "bg-red-950 border border-red-800 text-red-400" :
                            d.status === "Analyse en cours" ? "bg-amber-950 border border-amber-800 text-amber-400" :
                            d.status === "Chiffrage / Proposition Prête" ? "bg-blue-950 border border-blue-800 text-blue-400" :
                            d.status === "Accepté / Validé" ? "bg-emerald-950 border border-emerald-800 text-emerald-400" :
                            "bg-zinc-900 border border-zinc-700 text-zinc-400"
                          }`}>
                            {d.status === "Nouveau / En attente" && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
                            <span>{d.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Contact metadata row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-900/50">
                        <div className="min-w-0">
                          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Client</p>
                          <p className="text-white font-bold text-xs mt-0.5 truncate">{d.clientName}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Email</p>
                          <a href={`mailto:${d.email}`} className="text-blue-400 hover:underline font-mono text-xs mt-0.5 block truncate" title="Envoyer un email">
                            {d.email}
                          </a>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Entreprise</p>
                          <p className="text-zinc-300 font-medium text-xs mt-0.5 truncate">{d.company || "Non spécifié"}</p>
                        </div>
                      </div>

                      {/* Specifications/Needs */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Spécifications & Fonctionnalités :</p>
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-zinc-300 text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                          {d.specs}
                        </div>
                      </div>
                    </div>

                    {/* Meta parameters: budget, timeline, and actions */}
                    <div className="xl:w-64 flex flex-col sm:flex-row xl:flex-col justify-between sm:items-center xl:items-stretch border-t xl:border-t-0 xl:border-l border-slate-900 pt-4 xl:pt-0 xl:pl-6 shrink-0 gap-4">
                      
                      <div className="grid grid-cols-2 xl:grid-cols-1 gap-4 xl:gap-3 flex-1">
                        <div>
                          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Budget Estimé</p>
                          <span className="inline-block mt-1 px-2.5 py-1 rounded text-xs font-mono font-black bg-slate-950 border border-slate-900 text-zinc-400">
                            {d.estimatedBudget}
                          </span>
                        </div>

                        <div>
                          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Délai Souhaité</p>
                          <p className="text-zinc-300 font-semibold font-mono text-xs mt-1">
                            {d.desiredDeadline}
                          </p>
                        </div>
                      </div>

                      {/* Action trigger flows */}
                      <div className="space-y-2 shrink-0 w-full sm:w-auto xl:w-full">
                        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest hidden xl:block mb-1">Workflow Diagnostic</p>
                        <div className="flex flex-wrap gap-1.5 w-full">
                          <select
                            value={d.status}
                            onChange={(e) => handleChangeDevisStatus(d.id, e.target.value as QuoteBrief["status"])}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-mono text-zinc-300 focus:outline-none focus:border-red-500/50 flex-1 min-w-[140px]"
                          >
                            <option value="Nouveau / En attente">Nouveau / En attente</option>
                            <option value="Analyse en cours">Analyse en cours</option>
                            <option value="Chiffrage / Proposition Prête">Chiffrage / Proposition Prête</option>
                            <option value="Accepté / Validé">Accepté / Validé</option>
                            <option value="Refusé / Annulé">Refusé / Annulé</option>
                          </select>
                          <button
                            onClick={() => handleDeleteDevis(d.id)}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-red-500 hover:text-red-700 hover:border-red-950 transition-colors cursor-pointer shrink-0"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ));
              })()}
            </div>

          </div>
        )}

        {/* ---------------- SECTION 4: POPUPS MANAGEMENT ---------------- */}
        {activeTab === "popups" && (
          <div className="space-y-6">
            
            {/* Sub-tabs for targeting: Popups vs Bannières */}
            <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-900 self-start">
              <button
                type="button"
                onClick={() => setPopupSubSection("popups")}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  popupSubSection === "popups"
                    ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white shadow-md font-extrabold"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                💬 Popups Contextuels ({popups.length})
              </button>
              <button
                type="button"
                onClick={() => setPopupSubSection("banners")}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  popupSubSection === "banners"
                    ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white shadow-md font-extrabold"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                📢 Bannières d'En-tête & Pied ({banners.length})
              </button>
            </div>

            {popupSubSection === "banners" ? (
              <div className="space-y-6 pt-4">
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleOpenBannerModal(null)}
                    className="bg-gradient-to-r from-[#00209F] to-[#D21034] hover:opacity-90 active:scale-95 transition-all text-xs font-bold font-mono tracking-wider uppercase rounded-xl px-5 py-3.5 text-white flex items-center space-x-2 shadow-lg shadow-red-500/10 hover:shadow-red-500/25 border border-white/10 shrink-0 cursor-pointer self-start sm:self-center hover:scale-[1.02] duration-300 animate-none"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>Créer une Bannière</span>
                  </button>
                </div>

                {/* Banners grid list */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {banners.length === 0 ? (
                    <div className="lg:col-span-2 p-12 text-center text-zinc-500 border border-slate-900 bg-slate-900/10 rounded-2xl font-mono text-sm leading-relaxed">
                      Aucune alerte ou bannière configurée. Cliquez sur "Créer une Bannière" pour diffuser votre premier message d'équipe !
                    </div>
                  ) : (
                    banners.map((b) => {
                      return (
                        <div
                          key={b.id}
                          className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-xl flex flex-col justify-between gap-6 hover:bg-slate-900/30 transition-all duration-300 relative"
                        >
                          {/* Active status dot */}
                          <div className="absolute top-6 right-6 flex items-center space-x-2">
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                              b.isActive 
                                ? "bg-emerald-950/40 border border-emerald-900 text-emerald-400" 
                                : "bg-zinc-900 border border-zinc-805 text-zinc-500"
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${b.isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
                              <span>{b.isActive ? "Actif" : "Inactif"}</span>
                            </span>
                          </div>

                          <div className="space-y-4">
                            {/* Tags / Header */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest ${
                                b.styleVisualPreset === "promo" ? "bg-red-950 border border-red-900 text-red-500" :
                                b.styleVisualPreset === "warning" ? "bg-amber-950 border border-amber-900 text-amber-500" :
                                b.styleVisualPreset === "success" ? "bg-emerald-950 border border-emerald-900 text-emerald-500" :
                                "bg-blue-950 border border-blue-900 text-blue-500"
                              }`}>
                                ⚡ {b.styleVisualPreset}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest bg-violet-950/40 border border-violet-900 text-violet-400 font-extrabold">
                                📍 Position : {b.emplacementBaniere === "above_navbar" ? "Au-dessus Navbar" : "Au-dessus Footer"}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest bg-zinc-900 border border-zinc-850 text-zinc-400">
                                🎯 Cible: {b.targetAudience}
                              </span>
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                              <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed max-h-24 overflow-y-auto pr-2 font-mono">{b.contenuMessage}</p>
                            </div>

                            {/* CTA link preview */}
                            {b.texteCta && b.urlRedirection && (
                              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-900">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold shrink-0">Bouton :</span>
                                <span className="text-xs font-mono text-zinc-350 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850 max-w-[120px] truncate">{b.texteCta}</span>
                                <span className="text-[10px] font-mono text-zinc-600 truncate flex-1">{b.urlRedirection}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions footer */}
                          <div className="border-t border-slate-900/60 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <span className="text-[9px] font-mono text-zinc-650 uppercase">ID: {b.id}</span>
                            
                            <div className="flex items-center space-x-2 text-right">
                              <button
                                onClick={() => handleToggleBannerActive(b.id)}
                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase cursor-pointer transition-colors ${
                                  b.isActive
                                    ? "bg-amber-950/10 border-amber-900/30 text-amber-400 hover:bg-amber-950/20"
                                    : "bg-emerald-950/10 border-emerald-900/30 text-emerald-400 hover:bg-emerald-950/20"
                                }`}
                              >
                                {b.isActive ? "Désactiver" : "Activer"}
                              </button>
                              <button
                                onClick={() => handleOpenBannerModal(b)}
                                className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-zinc-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                                title="Modifier"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBanner(b.id)}
                                className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-red-400 hover:text-red-500 hover:border-red-950 transition-colors cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleOpenPopupModal(null)}
                    className="bg-gradient-to-r from-[#00209F] to-[#D21034] hover:opacity-90 active:scale-95 transition-all text-xs font-bold font-mono tracking-wider uppercase rounded-xl px-5 py-3.5 text-white flex items-center space-x-2 shadow-lg shadow-red-500/10 hover:shadow-red-500/25 border border-white/10 shrink-0 cursor-pointer self-start sm:self-center hover:scale-[1.02] duration-300 animate-none"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>Créer un Popup</span>
                  </button>
                </div>

                {/* Popups grid list */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {popups.length === 0 ? (
                    <div className="lg:col-span-2 p-12 text-center text-zinc-500 border border-slate-900 bg-slate-900/10 rounded-2xl font-mono text-sm leading-relaxed">
                      Aucun popup configuré. Cliquez sur "Créer un Popup" pour diffuser votre première alerte d'élite !
                    </div>
                  ) : (
                    popups.map((p) => {
                      return (
                        <div
                          key={p.id}
                          className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-xl flex flex-col justify-between gap-6 hover:bg-slate-900/30 transition-all duration-300 relative"
                        >
                          {/* Active status dot */}
                          <div className="absolute top-6 right-6 flex items-center space-x-2">
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                              p.isActive 
                                ? "bg-emerald-950/40 border border-emerald-900 text-emerald-400" 
                                : "bg-zinc-900 border border-zinc-805 text-zinc-500"
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${p.isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
                              <span>{p.isActive ? "En ligne" : "Inactif"}</span>
                            </span>
                          </div>

                          <div className="space-y-4">
                            {/* Tags / Header */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest ${
                                p.type === "promo" ? "bg-red-950 border border-red-900 text-red-500" :
                                p.type === "warning" ? "bg-amber-950 border border-amber-900 text-amber-500" :
                                p.type === "success" ? "bg-emerald-950 border border-emerald-900 text-emerald-500" :
                                "bg-blue-950 border border-blue-900 text-blue-500"
                              }`}>
                                ⚡ {p.type}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest bg-zinc-900 border border-zinc-850 text-zinc-400">
                                🎯 Cible: {p.targetAudience}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest bg-zinc-900 border border-zinc-850 text-zinc-400">
                                ⏱️ Délai: {p.delaySeconds}s
                              </span>
                            </div>

                            {/* Title and message content */}
                            <div className="space-y-2">
                              <h4 className="text-white font-display font-bold text-base leading-snug">{p.title}</h4>
                              <p className="text-zinc-400 text-xs leading-relaxed max-h-24 overflow-y-auto pr-2">{p.content}</p>
                            </div>

                            {/* CTA visual preview tag */}
                            {p.buttonText && p.buttonUrl && (
                              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-900">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold shrink-0">Bouton :</span>
                                <span className="text-xs font-mono text-zinc-350 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850 max-w-[120px] truncate">{p.buttonText}</span>
                                <span className="text-[10px] font-mono text-zinc-600 truncate flex-1">{p.buttonUrl}</span>
                              </div>
                            )}
                          </div>

                          {/* Performance metrics & actions footer */}
                          <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Engagement mock statistics */}
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Affichages</p>
                                <p className="text-white font-mono font-bold text-sm mt-0.5">{p.views || 0}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Clics CTA</p>
                                <p className="text-white font-mono font-bold text-sm mt-0.5">{p.clicks || 0}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Taux Clic</p>
                                <p className="text-white font-mono font-bold text-sm mt-0.5">
                                  {p.views ? Math.round(((p.clicks || 0) / p.views) * 100) : 0}%
                                </p>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center space-x-2 text-right">
                              <button
                                onClick={() => handleTogglePopupActive(p.id)}
                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase cursor-pointer transition-colors ${
                                  p.isActive
                                    ? "bg-amber-950/10 border-amber-900/30 text-amber-400 hover:bg-amber-950/20"
                                    : "bg-emerald-950/10 border-emerald-900/30 text-emerald-400 hover:bg-emerald-950/20"
                                }`}
                              >
                                {p.isActive ? "Désactiver" : "Activer"}
                              </button>
                              <button
                                onClick={() => handleOpenPopupModal(p)}
                                className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-zinc-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                                title="Modifier"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePopup(p.id)}
                                className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-red-400 hover:text-red-500 hover:border-red-950 transition-colors cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

          </div>
        )}

        {/* ---------------- SECTION 5: MESSAGES MANAGEMENT ---------------- */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            
            {/* Contact directories / Search bar */}
            <div className="bg-slate-900/10 p-6 rounded-2xl border border-slate-900/65 backdrop-blur-md">
              <div className="flex justify-end pb-4 border-b border-slate-900">
                {/* Subtabs for targeting: Étudiant, Client, Admin */}
                <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-900">
                  {(["Étudiant", "Client", "Admin"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setMessagesSubTab(role)}
                      className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        messagesSubTab === role
                          ? "bg-gradient-to-r from-[#00209F] to-[#D21034] text-white shadow-md font-extrabold"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {role === "Étudiant" ? "🎓 Étudiants" : role === "Client" ? "💼 Clients" : "🛡️ Admins"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Search Input within sub tab */}
              <div className="mt-6 relative">
                <input
                  type="text"
                  placeholder={`Rechercher un ${messagesSubTab.toLowerCase()} par nom ou adresse email...`}
                  value={messagesSearchQuery}
                  onChange={(e) => setMessagesSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-900 hover:border-slate-850 rounded-xl pl-10 pr-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-550 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-mono"
                />
                <div className="absolute left-3 top-4 text-zinc-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {messagesSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setMessagesSearchQuery("")}
                    className="absolute right-3 top-3 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-mono rounded"
                  >
                    Effacer
                  </button>
                )}
              </div>

              {/* Contacts matching selection */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-slate-900 bg-black/40">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-950/80 text-zinc-400 text-xs font-mono uppercase border-b border-slate-900 font-bold">
                    <tr>
                      <th className="p-4 pl-6">Nom Complet</th>
                      <th className="p-4">Courriel</th>
                      <th className="p-4">Statut</th>
                      {messagesSubTab === "Client" && <th className="p-4">Entreprise</th>}
                      <th className="p-4 pr-6 text-right">Action directe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/30">
                    {accounts
                      .filter((acc) => acc.role === messagesSubTab)
                      .filter((acc) => {
                        const q = (messagesSearchQuery || "").toLowerCase().trim();
                        if (!q) return true;
                        return (acc.name || "").toLowerCase().includes(q) || (acc.email || "").toLowerCase().includes(q);
                      })
                      .map((acc) => (
                        <tr key={acc.id} className="hover:bg-slate-900/15 transition-colors">
                          <td className="p-4 pl-6 font-semibold text-white flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold font-mono text-zinc-300">
                              {(acc.name || "U").charAt(0)}
                            </div>
                            <span>{acc.name}</span>
                          </td>
                          <td className="p-4 text-zinc-400 font-mono text-xs">{acc.email}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                              acc.status === "Actif"
                                ? "bg-emerald-950/10 border-emerald-900/30 text-emerald-400"
                                : "bg-red-950/10 border-red-900/30 text-red-400"
                            }`}>
                              {acc.status}
                            </span>
                          </td>
                          {messagesSubTab === "Client" && (
                            <td className="p-4 text-zinc-400 text-xs font-semibold">{acc.company || "N/A"}</td>
                          )}
                          <td className="p-4 pr-6 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenComposeMessage(acc)}
                              className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold font-mono uppercase bg-slate-950 border border-slate-800 text-pink-400 hover:text-white hover:bg-pink-600 hover:border-pink-500 transition-all cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Écrire Message</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    {accounts.filter((acc) => acc.role === messagesSubTab).filter((acc) => {
                      const q = (messagesSearchQuery || "").toLowerCase().trim();
                      if (!q) return true;
                      return (acc.name || "").toLowerCase().includes(q) || (acc.email || "").toLowerCase().includes(q);
                    }).length === 0 && (
                      <tr>
                        <td colSpan={messagesSubTab === "Client" ? 5 : 4} className="p-8 text-center text-zinc-550 font-mono text-xs">
                          Aucun membre correspondant trouvé dans la catégorie {messagesSubTab}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Outbox / Sent history */}
            <div className="bg-slate-900/10 p-6 rounded-2xl border border-slate-900/50 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-end">
                <span className="text-xs font-mono font-bold bg-pink-950/20 border border-pink-900/30 text-pink-400 px-3 py-1 rounded-full">
                  {messages.length} Messages Totaux
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 text-center text-zinc-550 border border-dashed border-slate-900 bg-slate-900/5 rounded-xl font-mono text-xs">
                  Aucun message n'a encore été envoyé. Utilisez les raccourcis ci-dessus pour notifier vos premiers membres !
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => {
                    const cleanDate = new Date(m.timestamp || new Date().toISOString()).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    const recipientName = m.destinataire || m.recipientName || "Membre";
                    const recipientEmail = m.email || m.recipientEmail || "N/A";
                    const recipientRole = m.recipientRole || "Utilisateur";
                    const subject = m.objet || m.subject || "";
                    const content = m.message || m.content || "";
                    const status = m.statut || "Livré";

                    return (
                      <div key={m.id} className="p-5 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-850 transition-colors space-y-3 p-id" id={`msg-item-${m.id}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/60 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-zinc-500">Destinataire :</span>
                            <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-white font-semibold">
                              {recipientName} ({recipientRole})
                            </span>
                            <span className="text-xs font-mono text-zinc-650 truncate max-w-xs">{recipientEmail}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3 self-start sm:self-center">
                            <span className="text-[10px] font-mono text-zinc-500">{cleanDate}</span>
                            <button
                              type="button"
                              onClick={() => handleOpenEditMessage(m)}
                              className="text-zinc-650 hover:text-blue-400 transition-colors p-1 cursor-pointer"
                              title="Modifier ce message"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(m.id)}
                              className="text-zinc-650 hover:text-red-400 transition-colors p-1 cursor-pointer"
                              title="Dissoudre cet envoi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-zinc-250 font-display flex items-center gap-2">
                            <span className="text-red-500 font-mono text-xs font-semibold">Objet :</span>
                            {subject}
                          </h4>
                          <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line font-mono pl-4 border-l border-zinc-800">
                            {content}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 pt-2">
                          <span className="flex items-center gap-1 text-emerald-450">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Statut : {status}
                          </span>
                          <span className="flex items-center gap-1 text-blue-450">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            Simulé : Courrier SMTP envoyé à {recipientEmail}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ---------------- SECTION 5C: BILLING (FACTURATION) ---------------- */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-display font-black tracking-tight text-white uppercase flex items-center space-x-3">
                <CreditCard className="w-8 h-8 text-emerald-500" />
                <span>Gestion Facturation</span>
              </h2>
              <button 
                onClick={() => setIsAddInvoiceModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 transition"
              >
                <PlusCircle className="w-5 h-5" /> Ajouter Facture
              </button>
            </div>

            {isAddInvoiceModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="bg-[#0c0c12] border border-white/10 rounded-2xl p-8 max-w-lg w-full space-y-4">
                  <h3 className="text-xl font-bold">Ajouter une facture</h3>
                  <input type="text" placeholder="Nom complet" className="w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2" onChange={e => setNewInvoice({...newInvoice, clientName: e.target.value})} />
                  <input type="email" placeholder="Email" className="w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2" onChange={e => setNewInvoice({...newInvoice, email: e.target.value})} />
                  <input type="text" placeholder="Projet" className="w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2" onChange={e => setNewInvoice({...newInvoice, projectName: e.target.value})} />
                  <input type="text" placeholder="Montant" className="w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2" onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} />
                  <select className="w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2" value={newInvoice.paymentMethod} onChange={e => setNewInvoice({...newInvoice, paymentMethod: e.target.value})}>
                    <option value="Natcash">Natcash</option>
                    <option value="Moncash">Moncash</option>
                    <option value="Carte">Carte</option>
                  </select>
                  <input type="text" placeholder="Lien Paiement" className="w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2" onChange={e => setNewInvoice({...newInvoice, paymentLink: e.target.value})} />
                  {newInvoice.paymentMethod === "Natcash" && (
                    <input type="file" onChange={e => setNewInvoice({...newInvoice, file: e.target.files?.[0] || null})} className="w-full bg-[#1a1a24] border border-white/5 rounded-lg px-4 py-2 text-zinc-400" />
                  )}
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsAddInvoiceModalOpen(false)} className="flex-1 py-2 bg-zinc-800 rounded-lg">Annuler</button>
                    <button 
                      disabled={isUploading}
                      onClick={async () => {
                        setIsUploading(true);
                        try {
                          let proofUrl = "";
                          if (newInvoice.file) {
                             const storageRef = ref(storage, `invoices/${Date.now()}_${newInvoice.file.name}`);
                             await uploadBytes(storageRef, newInvoice.file);
                             proofUrl = await getDownloadURL(storageRef);
                          }
                          await addDoc(collection(db, "invoices"), {
                            ...newInvoice,
                            file: proofUrl,
                            timestamp: Date.now()
                          });
                          setIsAddInvoiceModalOpen(false);
                          setNewInvoice({ clientName: "", email: "", projectName: "", amount: "", paymentMethod: "Natcash", paymentLink: "", file: null });
                        } catch (e) {
                          console.error(e);
                        } finally {
                          setIsUploading(false);
                        }
                      }}
                      className="flex-1 py-2 bg-blue-600 rounded-lg"
                    >
                      {isUploading ? "..." : "Ajouter"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 bg-[#0c0c12] p-4 rounded-xl border border-white/5">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-transparent border border-white/10 rounded-lg text-white"
                />
              </div>
              <select 
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="bg-transparent border border-white/10 text-white rounded-lg px-4 py-2"
              >
                <option value="Tous">Tous</option>
                <option value="Natcash">Natcash</option>
                <option value="Moncash">Moncash</option>
                <option value="Carte">Carte</option>
              </select>
            </div>

            {invoicesLoading ? (
              <div className="text-center p-20 text-zinc-500">Chargement...</div>
            ) : (
              <div className="space-y-4">
                {invoices.filter(inv => 
                  (paymentMethodFilter === "Tous" || inv.paymentMethod === paymentMethodFilter) &&
                  (inv.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((inv) => (
                    <div key={inv.id} className="bg-[#0c0c12] border border-white/5 rounded-2xl p-6 flex justify-between items-center">
                        <div className="space-y-1">
                            <h4 className="font-bold text-white">{inv.projectName}</h4>
                            <p className="text-sm text-zinc-400">Pour : {inv.clientName} ({inv.email}) - {inv.paymentMethod}</p>
                            {inv.status && (
                              <p className="text-xs font-mono text-zinc-500">Statut : {inv.status}</p>
                            )}
                            {inv.file && (
                              <a 
                                href={inv.file} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline mt-2 bg-blue-500/10 px-2 py-1 rounded"
                              >
                                <Eye className="w-3.5 h-3.5" /> Voir la preuve de paiement
                              </a>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-bold text-emerald-400">{inv.amount}</p>
                            <button
                              onClick={async () => {
                                try {
                                  await deleteDoc(doc(db, "invoices", inv.id));
                                  setInvoices(prev => prev.filter(i => i.id !== inv.id));
                                } catch (e) {
                                  console.error(e);
                                  alert("Erreur lors de la suppression.");
                                }
                              }}
                              className="p-2 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-900/40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- SECTION 5B: PROJECT ACCESS CREDENTIALS (CODES ACCES CMS) ---------------- */}
        {activeTab === "credentials" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-display font-black tracking-tight text-white uppercase flex items-center space-x-3">
                  <KeyRound className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600" />
                  <span>Accès Projets CMS Clients</span>
                </h2>
                <p className="text-zinc-400 text-sm mt-1">
                  Gérez et transmettez en toute sécurité les codes d'accès CMS et tokens API de vos clients.
                </p>
              </div>
              <button
                onClick={handleOpenCreateAccess}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold text-sm transition-all shadow-lg cursor-pointer transform hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4 text-white font-bold" />
                <span>Nouveau Code Accès</span>
              </button>
            </div>

            {/* Barre de Recherche & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Rechercher par nom de client, projet ou email..."
                  value={projectAccessSearchQuery}
                  onChange={(e) => setProjectAccessSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/30 border border-slate-800 rounded-2xl text-slate-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 text-sm transition-all"
                />
              </div>
              <div className="p-4 bg-slate-900/10 border border-slate-850 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-500 font-mono block">TOTAL CODES ACTIFS</span>
                  <span className="text-2xl font-bold text-white mt-1 block">
                    {projectAccessList.length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/10 to-red-600/10 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Liste des Accès Projets */}
            {projectAccessList.filter(item => {
              const query = (projectAccessSearchQuery || "").toLowerCase();
              return (
                (item.clientName || "").toLowerCase().includes(query) ||
                (item.projectName || "").toLowerCase().includes(query) ||
                (item.clientEmail || "").toLowerCase().includes(query)
              );
            }).length === 0 ? (
              <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-slate-950/20">
                <KeyRound className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 font-medium">Aucun code d'accès CMS trouvé</p>
                <p className="text-zinc-600 text-xs mt-1">
                  Créez des accès en cliquant sur le bouton ci-dessus pour les attribuer à vos clients.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {projectAccessList
                  .filter(item => {
                    const query = (projectAccessSearchQuery || "").toLowerCase();
                    return (
                      (item.clientName || "").toLowerCase().includes(query) ||
                      (item.projectName || "").toLowerCase().includes(query) ||
                      (item.clientEmail || "").toLowerCase().includes(query)
                    );
                  })
                  .map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="p-6 rounded-3xl border border-slate-850 bg-slate-900/20 backdrop-blur-xl relative overflow-hidden group hover:border-slate-800 transition-all space-y-4"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00209F]/5 blur-3xl rounded-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D21034]/5 blur-3xl rounded-full" />
                        
                        <div className="flex items-start justify-between relative z-10">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00209F]/20 text-[#00209F] uppercase tracking-wider">
                                Client
                              </span>
                              <span className="text-zinc-400 text-xs font-mono">{item.clientEmail}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mt-1.5">{item.clientName}</h3>
                            <p className="text-amber-500 font-semibold text-sm mt-0.5">
                              Projet : {item.projectName}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleOpenEditAccess(item)}
                              className="p-2 rounded-lg bg-slate-900 text-zinc-405 hover:text-white transition-colors cursor-pointer"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4 text-emerald-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteAccess(item.id, item.projectName)}
                              className="p-2 rounded-lg bg-red-950/20 text-red-450 hover:bg-red-900/30 transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* CMS Administration Details */}
                        <div className="space-y-3 pt-3 border-t border-slate-850/50 relative z-10">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Lien Administration CMS</span>
                            <div className="flex items-center justify-between mt-1 p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                              <span className="text-zinc-300 text-xs truncate mr-2 font-mono">{item.adminLink}</span>
                              <a
                                href={item.adminLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center space-x-1"
                              >
                                <span>Ouvrir</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Identifiant</span>
                              <div className="mt-1 p-2.5 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between">
                                <span className="text-white text-xs font-mono truncate">{item.username}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.username);
                                    alert("Identifiant copié !");
                                  }}
                                  className="text-[10px] text-amber-500 hover:text-amber-400 font-mono uppercase font-bold cursor-pointer"
                                >
                                  Copier
                                </button>
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Mot de passe</span>
                              <div className="mt-1 p-2.5 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between">
                                <span className="text-white text-xs font-mono truncate">{item.password}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.password);
                                    alert("Mot de passe copié !");
                                  }}
                                  className="text-[10px] text-amber-500 hover:text-amber-400 font-mono uppercase font-bold cursor-pointer"
                                >
                                  Copier
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Connection API Details */}
                        <div className="space-y-3 pt-3 border-t border-slate-850/50 relative z-10">
                          <span className="text-[11px] font-bold text-slate-300 block">Configuration API de Synchronisation</span>
                          {item.apiToken || item.dbUri ? (
                            <div className="space-y-2 p-3 bg-slate-950/40 rounded-2xl border border-slate-850/55">
                              {item.apiToken && (
                                <div>
                                  <span className="text-[9px] uppercase font-mono text-zinc-500 block">API Token Key</span>
                                  <div className="flex items-center justify-between gap-2 mt-0.5">
                                    <span className="text-zinc-400 font-mono text-xs truncate flex-1">{item.apiToken}</span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(item.apiToken);
                                        alert("API Token copié !");
                                      }}
                                      className="text-[9px] text-amber-500 hover:text-amber-400 font-mono uppercase cursor-pointer"
                                    >
                                      Copier
                                    </button>
                                  </div>
                                </div>
                              )}
                              {item.dbUri && (
                                <div className="pt-1.5 border-t border-slate-850/30">
                                  <span className="text-[9px] uppercase font-mono text-zinc-500 block">URL de Connexion de l'API Base de données</span>
                                  <div className="flex items-center justify-between gap-2 mt-0.5">
                                    <span className="text-zinc-400 font-mono text-xs truncate flex-1">{item.dbUri}</span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(item.dbUri);
                                        alert("URI de connexion copiée !");
                                      }}
                                      className="text-[9px] text-amber-500 hover:text-amber-400 font-mono uppercase cursor-pointer"
                                    >
                                      Copier
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] italic text-zinc-600 pl-1">
                              Aucun paramètre API ou jeton de connexion n'a été spécifié pour ce projet.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ---------------- SECTION 6: PROFILE & SETTINGS ---------------- */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Informations du Compte */}
              <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00209F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-xl font-display font-extrabold text-white mb-6 flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-blue-500" />
                  <span>Informations Publiques</span>
                </h3>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Profil mis à jour (démo)"); }}>
                  <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00209F] to-[#D21034] p-1 shrink-0">
                      <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center border-2 border-slate-950">
                        <span className="text-2xl font-bold text-white font-display uppercase tracking-widest">HD</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <button type="button" className="text-xs bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-mono text-white transition-colors cursor-pointer">Changer l'avatar</button>
                      <p className="text-[10px] text-zinc-500 font-mono">JPG ou PNG, max 2MB</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Nom Complet</label>
                    <input type="text" defaultValue="Admin HaitianDev" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Adresse Email Associée</label>
                    <input type="email" defaultValue="admin@haitiandev.com" readOnly className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-zinc-500 focus:outline-none cursor-not-allowed opacity-75" />
                    <p className="text-[10px] text-amber-500 font-mono">L'email administrateur ne peut être modifié ici.</p>
                  </div>

                  <button type="submit" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs tracking-wider uppercase rounded-xl px-6 py-3 transition-all cursor-pointer mt-4">
                    Sauvegarder le profil
                  </button>
                </form>
              </div>

              {/* Sécurité et Mot de passe */}
              <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D21034]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-xl font-display font-extrabold text-white mb-6 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Sécurité & Accès</span>
                </h3>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Mot de passe modifié avec succès (démo)"); }}>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Mot de passe actuel</label>
                    <input type="password" required placeholder="********" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-mono" />
                  </div>
                  
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/50">
                    <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Nouveau mot de passe</label>
                    <input type="password" required placeholder="Nouveau mot de passe" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-mono" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Confirmez le nouveau mot de passe</label>
                    <input type="password" required placeholder="Confirmez le mot de passe" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-mono" />
                  </div>

                  <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-[#00209F] to-[#D21034] hover:brightness-110 text-white font-semibold text-xs tracking-wider uppercase rounded-xl px-6 py-3 transition-all cursor-pointer mt-4">
                    Mettre à jour la sécurité
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ---------------- SECTION 8: STATISTIQUES & ANALYTICS ---------------- */}
        {activeTab === "stats" && (
          <div className="space-y-8 animate-fade-in pt-4">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  alert("Les données d'analyse dynamique de HaitianDev ont été actualisées avec succès.");
                }}
                className="bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 text-xs font-mono font-bold uppercase tracking-wider rounded-xl px-4 py-2.5 flex items-center space-x-2 transition-all cursor-pointer hover:border-slate-700 hover:scale-[1.02] active:scale-95 duration-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualiser</span>
              </button>
            </div>

            {/* Key Metrics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Scorecard 1: Nombre de visites */}
              <div className="group relative bg-slate-900/30 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl overflow-hidden hover:border-[#00209F]/50 hover:shadow-lg hover:shadow-[#00209F]/5 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00209F]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00209F]/10 transition-colors duration-500" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/15 rounded-2xl">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +18.4%
                  </span>
                </div>
                <div>
                  <h4 className="text-zinc-400 font-display text-xs uppercase tracking-wider font-semibold">Nombre de visites</h4>
                  <p className="text-white text-3xl font-black font-display tracking-tight mt-1 flex items-baseline gap-1.5">
                    {1284 + accounts.length * 15 + devisList.length * 20 + messages.length * 5}
                    <span className="text-xs text-zinc-550 font-normal">vues</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-2.5 leading-relaxed font-sans">Trafic global estimé sur le site web.</p>
                </div>
              </div>

              {/* Scorecard 2: Nombre d'Inscriptions */}
              <div className="group relative bg-slate-900/30 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl overflow-hidden hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-violet-500/10 transition-colors duration-500" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-violet-500/10 text-violet-400 border border-violet-500/15 rounded-2xl">
                    <Users className="w-6 h-6 text-violet-400" />
                  </div>
                  <span className="text-[10px] text-violet-400 font-mono font-bold bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                    Étudiants
                  </span>
                </div>
                <div>
                  <h4 className="text-zinc-400 font-display text-xs uppercase tracking-wider font-semibold">Nombre d'inscriptions</h4>
                  <p className="text-white text-3xl font-black font-display tracking-tight mt-1 flex items-baseline gap-1.5">
                    {accounts.filter(a => a.role === "Étudiant").length}
                    <span className="text-xs text-zinc-550 font-normal">personnes</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-2.5 leading-relaxed font-sans">Inscriptions au programme de mentorat et formations.</p>
                </div>
              </div>

              {/* Scorecard 3: Nombre de Comptes */}
              <div className="group relative bg-slate-900/30 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl overflow-hidden hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 rounded-2xl">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    Membres
                  </span>
                </div>
                <div>
                  <h4 className="text-zinc-400 font-display text-xs uppercase tracking-wider font-semibold">Nombre de Comptes</h4>
                  <p className="text-white text-3xl font-black font-display tracking-tight mt-1 flex items-baseline gap-1.5">
                    {accounts.length}
                    <span className="text-xs text-zinc-550 font-normal">créés</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-2.5 leading-relaxed font-sans">Total des comptes clients et étudiants sur la plateforme.</p>
                </div>
              </div>

              {/* Scorecard 4: Messages Recus */}
              <div className="group relative bg-slate-900/30 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl overflow-hidden hover:border-[#D21034]/50 hover:shadow-lg hover:shadow-[#D21034]/5 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D21034]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D21034]/10 transition-colors duration-500" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/15 rounded-2xl">
                    <Mail className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="text-[10px] text-zinc-300 font-mono font-bold bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-full">
                    Contact
                  </span>
                </div>
                <div>
                  <h4 className="text-zinc-400 font-display text-xs uppercase tracking-wider font-semibold">Messages Reçus</h4>
                  <p className="text-white text-3xl font-black font-display tracking-tight mt-1 flex items-baseline gap-1.5">
                    {messages.length}
                    <span className="text-xs text-zinc-550 font-normal">messages</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-2.5 leading-relaxed font-sans">Formulaires de contact de prospection complétés.</p>
                </div>
              </div>

              {/* Scorecard 5: Taux de Conversion */}
              <div className="group relative bg-slate-900/30 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl overflow-hidden hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/5 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-yellow-500/10 transition-colors duration-500" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-yellow-500/10 text-yellow-500 border border-yellow-500/15 rounded-2xl">
                    <Activity className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="text-[10px] text-[#00D2FF] font-mono font-bold bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                    Optimisé
                  </span>
                </div>
                <div>
                  <h4 className="text-zinc-400 font-display text-xs uppercase tracking-wider font-semibold">Taux de Conversion</h4>
                  <p className="text-white text-3xl font-black font-display tracking-tight mt-1 flex items-baseline gap-1.5">
                    {(((accounts.length + devisList.length) / (1284 + accounts.length * 15 + devisList.length * 20 + messages.length * 5)) * 100).toFixed(1)}%
                    <span className="text-xs text-zinc-550 font-normal">CTA</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-2.5 leading-relaxed font-sans">Proportion de visiteurs ayant créé un compte ou demandé un devis.</p>
                </div>
              </div>
              
              {/* Scorecard 6: Demandes de Devis */}
              <div className="group relative bg-slate-900/30 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl overflow-hidden hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/10 transition-colors duration-500" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-orange-500/10 text-orange-400 border border-orange-500/15 rounded-2xl">
                    <FileText className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="text-[10px] text-orange-400 font-mono font-bold bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                    Acquisition
                  </span>
                </div>
                <div>
                  <h4 className="text-zinc-400 font-display text-xs uppercase tracking-wider font-semibold">Demandes de Devis</h4>
                  <p className="text-white text-3xl font-black font-display tracking-tight mt-1 flex items-baseline gap-1.5">
                    {devisList.length}
                    <span className="text-xs text-zinc-550 font-normal">projets</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-2.5 leading-relaxed font-sans">Besoins clients qualifiés reçus depuis le simulateur.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 9: SEO & META CONFIGURATION ---------------- */}
        {false && activeTab === "seo" && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Navigation for SEO Panel */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setSeoSubTab("global")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
                    seoSubTab === "global"
                      ? "bg-white text-black shadow-lg"
                      : "text-zinc-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  🌐 Configuration Globale
                </button>
                <button
                  onClick={() => setSeoSubTab("pages")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
                    seoSubTab === "pages"
                      ? "bg-white text-black shadow-lg"
                      : "text-zinc-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  📄 Indexation Page Par Page
                </button>
              </div>

              <button
                onClick={handleSaveSeo}
                className="bg-gradient-to-r from-[#00209F] to-[#D21034] hover:brightness-110 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl px-5 py-2.5 flex items-center space-x-2 transition-all cursor-pointer hover:scale-[1.02] duration-200 shadow-md shadow-[#00209F]/10"
              >
                <Check className="w-4 h-4" />
                <span>Sauvegarder Configuration</span>
              </button>
            </div>

            {/* Sub-tab 1: GLOBAL */}
            {seoSubTab === "global" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form fields */}
                <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl relative overflow-hidden group space-y-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00209F]/5 to-transparent pointer-events-none" />
                  <div>
                    <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-500 animate-spin-slow" />
                      <span>Paramètres de Marque & Robots</span>
                    </h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Balises structurant l'indexation générale et l'image de fallback.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Nom du Site (Marque)</label>
                      <input
                        type="text"
                        value={seoConfig.global.siteName}
                        onChange={(e) => setSeoConfig({
                          ...seoConfig,
                          global: { ...seoConfig.global, siteName: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Directives Robots (Indexing)</label>
                      <select
                        value={seoConfig.global.metaRobots}
                        onChange={(e) => setSeoConfig({
                          ...seoConfig,
                          global: { ...seoConfig.global, metaRobots: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                      >
                        <option value="index, follow">index, follow (Recommandé - Indexer tout le site)</option>
                        <option value="noindex, follow">noindex, follow (Ne pas indexer, suivre liens)</option>
                        <option value="noindex, nofollow">noindex, nofollow (Privé - Bloquer robots)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Clé Google Search Console</label>
                      <input
                        type="text"
                        value={seoConfig.global.googleVerification}
                        onChange={(e) => setSeoConfig({
                          ...seoConfig,
                          global: { ...seoConfig.global, googleVerification: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-blue-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Chemin du Plan du Site (Sitemap URL)</label>
                      <input
                        type="text"
                        value={seoConfig.global.sitemapUrl}
                        onChange={(e) => setSeoConfig({
                          ...seoConfig,
                          global: { ...seoConfig.global, sitemapUrl: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-blue-500/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-zinc-400 uppercase block">Fallback Open Graph Sharing Image</label>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e)}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                          isDragging
                            ? "border-blue-500 bg-blue-500/5"
                            : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
                        }`}
                      >
                        <ImageIcon className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                        <p className="text-xs text-zinc-300 font-semibold mb-1">
                          Glissez-déposez l'image ici
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          Format de recommandation: 1200 x 630 pixels. (.png, .jpg)
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-550 block">OU LIEN AUDIOVISUEL SUR SERVEUR :</span>
                        <input
                          type="url"
                          value={seoConfig.global.defaultOgImage}
                          onChange={(e) => setSeoConfig({
                            ...seoConfig,
                            global: { ...seoConfig.global, defaultOgImage: e.target.value }
                          })}
                          placeholder="https://..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-zinc-400 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="space-y-6">
                  {/* Google snippet preview */}
                  <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl relative overflow-hidden space-y-4">
                    <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Visualisation Simulation Google SERP
                    </h4>

                    {/* Simulating SERP card */}
                    <div className="bg-white rounded-2xl p-5 shadow-2xl border border-zinc-200">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-750 font-extrabold border border-zinc-200">
                          HD
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-zinc-800 font-normal leading-tight">haitiandev.com</span>
                          <span className="text-[10px] text-zinc-500 leading-none">https://haitiandev.com › sitemap</span>
                        </div>
                      </div>
                      <a href="#" className="text-xl text-[#1a0dab] hover:underline font-normal tracking-tight block leading-tight mb-1 font-sans">
                        {seoConfig.global.siteName} — Elite Software Studio
                      </a>
                      <p className="text-xs text-[#4d5156] font-sans leading-relaxed">
                        Indexation active en mode <span className="font-bold text-slate-800">{seoConfig.global.metaRobots}</span>. Plan du site configuré à l'adresse relative <span className="text-emerald-700 italic">{seoConfig.global.sitemapUrl}</span>.
                      </p>
                    </div>

                    <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
                      * Ce modèle simule la structure d'indexation lue en direct par Googlebot. L'utilisation du robots de crawl indexe globalement vos balises d'affaires.
                    </p>
                  </div>

                  {/* Open Graph share block */}
                  <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl space-y-4">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Aperçu Partage Réseaux Sociaux (Open Graph)</h4>
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto">
                      {seoConfig.global.defaultOgImage ? (
                        <img 
                          src={seoConfig.global.defaultOgImage} 
                          alt="Fallback OG Share Preview" 
                          className="w-full h-36 object-cover bg-slate-900"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80";
                          }}
                        />
                      ) : (
                        <div className="w-full h-36 bg-slate-900 flex items-center justify-center text-zinc-650 font-mono text-xs">
                          Aucune image configurée
                        </div>
                      )}
                      <div className="p-4 space-y-1">
                        <span className="text-[9px] font-mono text-red-500 uppercase tracking-widest font-bold">haitiandev.com</span>
                        <h5 className="text-xs font-bold text-white tracking-tight">{seoConfig.global.siteName} | Studio Technologique</h5>
                        <p className="text-[10px] text-zinc-400 line-clamp-2">L'élite du développement de logiciels d'affaires et de systèmes automatisés sur mesure en Haïti.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: PAGE PAR PAGE */}
            {seoSubTab === "pages" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* List of Pages left-rail */}
                <div className="lg:col-span-4 space-y-2 lg:max-h-[600px] overflow-y-auto pr-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block mb-2 pl-2">SÉLECTIONNEZ LA PAGE :</span>
                  {Object.entries(seoConfig.pages).map(([key, pageObj]: [string, any]) => {
                    const isSelected = selectedSeoPageKey === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedSeoPageKey(key)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs font-mono flex flex-col space-y-1 transition-all duration-205 cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 border-red-500/30 text-white shadow-md shadow-[#D21034]/5"
                            : "bg-slate-950/50 border-slate-800 text-zinc-400 hover:text-white hover:bg-slate-900/10 hover:border-slate-700"
                        }`}
                      >
                        <span className="font-sans font-bold text-sm tracking-tight">{pageObj.name}</span>
                        <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
                          <span className="bg-black/60 border border-slate-800 px-1.5 py-0.5 rounded text-red-400 font-semibold">{pageObj.path}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Configuration form for selected page & Google Preview on right */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Slate Card Form container */}
                  <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl space-y-5 relative">
                    <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-500 bg-black/50 px-2 py-0.5 rounded border border-slate-800/80 uppercase font-bold">
                      Page Sélectionnée: {selectedSeoPageKey}
                    </div>

                    <div>
                      <h3 className="text-md font-sans font-bold text-white uppercase tracking-tight">Paramètres Méthodologiques</h3>
                      <p className="text-zinc-500 text-[11px] font-mono">Modifications structurées pour la page {seoConfig.pages[selectedSeoPageKey]?.name}.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Meta Title */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-400 uppercase flex justify-between">
                          <span>Balise Méta Titre (Meta Title)</span>
                          <span className="font-normal text-zinc-550 lowercase">60 char requis</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={seoConfig.pages[selectedSeoPageKey]?.metaTitle}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSeoConfig((prev: any) => ({
                              ...prev,
                              pages: {
                                ...prev.pages,
                                [selectedSeoPageKey]: {
                                  ...prev.pages[selectedSeoPageKey],
                                  metaTitle: val
                                }
                              }
                            }));
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/50"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-550 font-mono">
                          <span>Recommandé: &lt; 60 car.</span>
                          <span className={seoConfig.pages[selectedSeoPageKey]?.metaTitle?.length > 60 ? "text-yellow-500" : "text-emerald-500"}>
                            {seoConfig.pages[selectedSeoPageKey]?.metaTitle?.length || 0} caractères
                          </span>
                        </div>
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-400 uppercase">
                          Balise Méta Description (Meta Description)
                        </label>
                        <textarea
                          rows={4}
                          value={seoConfig.pages[selectedSeoPageKey]?.metaDescription}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSeoConfig((prev: any) => ({
                              ...prev,
                              pages: {
                                ...prev.pages,
                                [selectedSeoPageKey]: {
                                  ...prev.pages[selectedSeoPageKey],
                                  metaDescription: val
                                }
                              }
                            }));
                          }}
                          placeholder="Écrivez une description descriptive..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/50 leading-relaxed resize-none font-sans"
                        />
                        {/* Dynamic Count Indicator */}
                        <div className="flex justify-between items-center text-[10px] font-mono mt-1">
                          <span className="text-zinc-500">Target : 140 - 160 caractères</span>
                          <span 
                            className={`px-2 py-0.5 rounded font-bold ${
                              (seoConfig.pages[selectedSeoPageKey]?.metaDescription?.length || 0) > 160 
                                ? "bg-red-950/50 text-red-400 border border-red-900/30" 
                                : (seoConfig.pages[selectedSeoPageKey]?.metaDescription?.length || 0) >= 120 
                                ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/30" 
                                : "bg-yellow-950/50 text-yellow-500 border border-yellow-900/30"
                            }`}
                          >
                            {seoConfig.pages[selectedSeoPageKey]?.metaDescription?.length || 0} / 160
                          </span>
                        </div>
                      </div>

                      {/* Open Graph image of sharing */}
                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Image Open Graph Spécifique</label>
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, selectedSeoPageKey)}
                          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 ${
                            isDragging
                              ? "border-[#D21034] bg-[#D21034]/5"
                              : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
                          }`}
                        >
                          <ImageIcon className="w-6 h-6 text-zinc-500 mx-auto mb-1.5" />
                          <p className="text-[11px] text-zinc-350 font-bold mb-0.5">Glissez-déposez l'image de partage</p>
                          <p className="text-[9px] text-zinc-550">Glissez un fichier image (.png, .jpg) pour changer</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-zinc-550 block">OU PARAMÈTRE URL :</span>
                          <input
                            type="url"
                            value={seoConfig.pages[selectedSeoPageKey]?.ogImage}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSeoConfig((prev: any) => ({
                                ...prev,
                                pages: {
                                  ...prev.pages,
                                  [selectedSeoPageKey]: {
                                    ...prev.pages[selectedSeoPageKey],
                                    ogImage: val
                                  }
                                }
                              }));
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[10px] text-zinc-400 focus:outline-none focus:border-red-500/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Google Search Card Preview & Share View right column */}
                  <div className="space-y-6">
                    {/* Simulator Card */}
                    <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl space-y-4">
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-zinc-400">
                        <span className="uppercase font-semibold tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Google SERP Mobile Preview
                        </span>
                        <span className="text-zinc-500 lowercase">recherche interactive</span>
                      </div>

                      {/* Google Search simulator layout */}
                      <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xl font-sans">
                        <div className="flex items-center gap-1.5 mb-1.5 text-xs text-[#202124]">
                          <span className="text-[#3c4043] font-medium text-xs leading-none">haitiandev.com</span>
                          <span className="text-zinc-400 leading-none">&#8250;</span>
                          <span className="text-zinc-500 text-[11px] leading-none font-normal lowercase">{selectedSeoPageKey}</span>
                        </div>
                        <h4 className="text-lg text-[#1a0dab] font-medium leading-snug hover:underline block cursor-pointer">
                          {seoConfig.pages[selectedSeoPageKey]?.metaTitle || "Aucun titre configuré"}
                        </h4>
                        <p className="text-[11px] text-[#4d5156] leading-relaxed mt-1 line-clamp-2">
                          <span className="text-zinc-450 mr-1">Jun 9, 2026 —</span>
                          {seoConfig.pages[selectedSeoPageKey]?.metaDescription || "Veuillez saisir une description méta pour alimenter l'indexeur Google crawler."}
                        </p>
                      </div>

                      <div className="text-[10px] text-zinc-500 leading-normal font-mono">
                        * Le classement dans l'algorithme repose sur la présence de mots clés stratégiques liés à votre cible dans les premiers 120 caractères.
                      </div>
                    </div>

                    {/* Social networks share simulator */}
                    <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl space-y-3">
                      <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Social Sharing Card Previews</h4>
                      
                      <div className="bg-[#0f1115] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                        {seoConfig.pages[selectedSeoPageKey]?.ogImage ? (
                          <img 
                            src={seoConfig.pages[selectedSeoPageKey]?.ogImage} 
                            alt="Facebook/LinkedIn Share Preview" 
                            className="w-full h-32 object-cover bg-slate-950"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80";
                            }}
                          />
                        ) : (
                          <div className="w-full h-32 bg-slate-950 flex items-center justify-center text-zinc-650 font-mono text-xs">
                            Aucune image spécifique
                          </div>
                        )}
                        <div className="p-4 space-y-1">
                          <span className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-widest">HAITIANDEV.COM{seoConfig.pages[selectedSeoPageKey]?.path}</span>
                          <h5 className="text-xs font-bold text-white leading-tight line-clamp-1">{seoConfig.pages[selectedSeoPageKey]?.metaTitle}</h5>
                          <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{seoConfig.pages[selectedSeoPageKey]?.metaDescription}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* ==================== PROJECT CRUD MODAL ================= */}
      {/* ========================================================= */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsProjectModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00209F] to-[#D21034] uppercase">
                {editingProject ? "Modifier le projet" : "Nouveau projet d'élite"}
              </h3>
              <p className="text-zinc-500 text-xs">Configurez les caractéristiques du projet.</p>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Titre du Projet</label>
                <div className="relative">
                  <Type className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="Sofa App ou Digicel Redux"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Catégorie</label>
                  <div className="relative">
                    <Layers className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 cursor-pointer"
                    >
                      <option value="Fintech">Fintech</option>
                      <option value="AI">AI</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Education">Education</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Media">Media</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Année</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                    <input
                      type="text"
                      required
                      value={projectForm.year}
                      onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Client</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="text"
                    required
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    placeholder="Sogebank / Ministère de l'Éducation"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Image de Couverture (URL)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="url"
                    required
                    value={projectForm.imageUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Lien d'Action (URL / Route)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="text"
                    required
                    value={projectForm.actionUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, actionUrl: e.target.value })}
                    placeholder="/services ou externe URL"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 md:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Description Courte</label>
                <textarea
                  required
                  rows={3}
                  value={projectForm.shortDesc}
                  onChange={(e) => setProjectForm({ ...projectForm, shortDesc: e.target.value })}
                  placeholder="Expliquez brièvement l'impact technologique du projet..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-[#00209F] to-[#D21034] py-3 text-sm font-semibold rounded-xl text-white hover:brightness-110 shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Enregistrer le Projet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ================== FORMATION CRUD MODAL ================= */}
      {/* ========================================================= */}
      {isFormationModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[92vh] overflow-y-auto w-almost-full">
            <button 
              onClick={() => setIsFormationModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900/60 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00209F] to-[#D21034] uppercase">
                {editingFormation ? "Modifier la Formation" : "Créer un Cursus Formation"}
              </h3>
              <p className="text-zinc-500 text-xs text-left">Propulsez les talents en Haïti en gérant cette fiche de formation.</p>
            </div>

            <form onSubmit={handleSaveFormation} className="space-y-4">
              {/* Titre */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Titre de la Formation</label>
                <div className="relative">
                  <Type className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="text"
                    required
                    value={formationForm.titre}
                    onChange={(e) => setFormationForm({ ...formationForm, titre: e.target.value })}
                    placeholder="Saisissez le titre de la formation d'élite..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Formateur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Enseignant / Formateur</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                    <input
                      type="text"
                      required
                      value={formationForm.formateur}
                      onChange={(e) => setFormationForm({ ...formationForm, formateur: e.target.value })}
                      placeholder="Dr. Davidson Altema"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Organisme Certificateur</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                    <input
                      type="text"
                      required
                      value={formationForm.organisme}
                      onChange={(e) => setFormationForm({ ...formationForm, organisme: e.target.value })}
                      placeholder="ESIH ou HaitianDev Academy"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Durée */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Date de Lancement / Début</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                    <input
                      type="text"
                      required
                      value={formationForm.dateDebut}
                      onChange={(e) => setFormationForm({ ...formationForm, dateDebut: e.target.value })}
                      placeholder="2026-10-15 ou Fin Septembre"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Durée Estimée</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                    <input
                      type="text"
                      required
                      value={formationForm.duree}
                      onChange={(e) => setFormationForm({ ...formationForm, duree: e.target.value })}
                      placeholder="4 Mois (120 heures)"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Niveau Exigé / Difficulté */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Niveau requis / Difficulté</label>
                <div className="grid grid-cols-3 gap-2">
                  {["DÉBUTANT", "INTERMÉDIAIRE", "AVANCÉ"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormationForm({ ...formationForm, niveau: lvl as any })}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        formationForm.niveau === lvl
                          ? "bg-red-500/10 border-red-500/40 text-red-400 shadow-md shadow-red-950/25"
                          : "bg-slate-900 text-zinc-450 border-slate-800 hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image de Couverture */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">URL de l'image de couverture</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="url"
                    required
                    value={formationForm.urlImage}
                    onChange={(e) => setFormationForm({ ...formationForm, urlImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Lien d'inscription (Optionnel) */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Lien d'inscription externe (Optionnel)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="url"
                    value={formationForm.lienInscription}
                    onChange={(e) => setFormationForm({ ...formationForm, lienInscription: e.target.value })}
                    placeholder="https://forms.gle/... (laisser vide pour la candidature native de l'app)"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  * Si vous laissez ce champ vide, le bouton affiché sur l'onglet formation ouvrira le formulaire de candidature interne, stocké directement en base de données.
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsFormationModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-zinc-400 hover:text-white hover:bg-slate-900/40 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#00209F] to-[#D21034] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer shadow-lg shadow-black/30 transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ================= TESTIMONIAL CRUD MODAL ================ */}
      {/* ========================================================= */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsTestimonialModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00209F] to-[#D21034] uppercase">
                {editingTestimonial ? "Modifier le Témoignage" : "Ajouter un Avis Client"}
              </h3>
              <p className="text-zinc-500 text-xs">Gérez le retour d'expérience client d'élite.</p>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Nom Complet</label>
                <div className="relative">
                  <Type className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="text"
                    required
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    placeholder="Jean-Jacques Chauvet"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Poste / Entreprise</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="text"
                    required
                    value={testimonialForm.roleCompany}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, roleCompany: e.target.value })}
                    placeholder="Directeur Finance @ Sogexpress"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">URL de l'Avatar Client</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="url"
                    required
                    value={testimonialForm.avatarUrl}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Citation / Avis client</label>
                <textarea
                  required
                  rows={4}
                  value={testimonialForm.quote}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                  placeholder="Leur accompagnement sur l'architecture réseau nous a permis de supporter une vague de 100 000 requêtes concomitantes..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 resize-none animate-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-[#00209F] to-[#D21034] py-3 text-sm font-semibold rounded-xl text-white hover:brightness-110 shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Enregistrer le Témoignage
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ================== EDUCATION CRUD MODAL ================= */}
      {/* ========================================================= */}
      {isEducationModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          
          {/* WINDOW 1: FORMATION (TRAINING MODULE) */}
          {educationForm.type === "Formation" && (
            <div className="w-full max-w-xl bg-slate-950 border border-emerald-500/20 shadow-2xl shadow-emerald-950/20 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsEducationModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 border-b border-slate-905 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-850/40 text-emerald-400">
                    <GraduationCap className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 uppercase tracking-wide">
                    {editingEducation ? "Modifier la Formation" : "Nouvelle Formation académique"}
                  </h3>
                </div>
                <p className="text-zinc-500 text-xs">Configurez un parcours académique d'élite ou un cours technique de haut niveau.</p>
              </div>

              <form onSubmit={handleSaveEducation} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Titre de la Formation d'élite</label>
                  <div className="relative">
                    <Type className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={educationForm.title}
                      onChange={(e) => setEducationForm({ ...educationForm, title: e.target.value })}
                      placeholder="Ex: Masterclass Intégration MonCash Avancée"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/55 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Formateur / Enseignant</label>
                    <input
                      type="text"
                      required
                      value={educationForm.author}
                      onChange={(e) => setEducationForm({ ...educationForm, author: e.target.value })}
                      placeholder="Ex: HaitianDev Academy"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/55 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Date de début / Lancement</label>
                    <input
                      type="date"
                      required
                      value={educationForm.date}
                      onChange={(e) => setEducationForm({ ...educationForm, date: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/55 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Durée estimée</label>
                    <input
                      type="text"
                      required
                      value={educationForm.duration || ""}
                      onChange={(e) => setEducationForm({ ...educationForm, duration: e.target.value })}
                      placeholder="Ex: 15h de cours, 6 mois"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/55 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase font-bold">Niveau exigé / Difficulté</label>
                    <select
                      value={educationForm.difficulty || "Intermédiaire"}
                      onChange={(e) => setEducationForm({ ...educationForm, difficulty: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/55 transition-colors"
                    >
                      <option value="Débutant" className="bg-slate-950">Débutant (Sans prérequis)</option>
                      <option value="Intermédiaire" className="bg-slate-950">Intermédiaire</option>
                      <option value="Avancé" className="bg-slate-950">Avancé (Architectes d'élite)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Organisme Certificateur</label>
                  <input
                    type="text"
                    required
                    value={educationForm.certifyingBody || ""}
                    onChange={(e) => setEducationForm({ ...educationForm, certifyingBody: e.target.value })}
                    placeholder="Ex: École Supérieure d'Infotronique d'Haïti"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/55 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Lien d'inscription (URL du Bouton S'inscrire)</label>
                  <input
                    type="text"
                    value={educationForm.registrationUrl || ""}
                    onChange={(e) => setEducationForm({ ...educationForm, registrationUrl: e.target.value })}
                    placeholder="Ex: https://forms.gle/xyz ou vide pour afficher le formulaire de candidature interne"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/55 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">URL de l'image de couverture</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-550" />
                    <input
                      type="url"
                      required
                      value={educationForm.bannerUrl}
                      onChange={(e) => setEducationForm({ ...educationForm, bannerUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/55 transition-colors"
                    />
                  </div>
                </div>

                {/* Tags associated */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Thématiques & Mots-clés requis</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Ex: Fintech"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-zinc-450 hover:text-white cursor-pointer transition-all"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(educationForm.tags || []).map(t => (
                      <span 
                        key={t} 
                        className="px-2 py-1 rounded bg-slate-900 border border-zinc-800/60 text-[10px] font-mono text-zinc-300 hover:line-through cursor-pointer flex items-center space-x-1"
                        onClick={() => handleRemoveTag(t)}
                        title="Cliquer pour supprimer"
                      >
                        <span>#{t}</span>
                        <X className="w-2.5 h-2.5 text-red-500" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5ed">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Programme & Descriptif du cours</label>
                  <RichTextEditor
                    value={educationForm.content}
                    onChange={(val) => setEducationForm({ ...educationForm, content: val })}
                    placeholder="Synthétisez l'organisation des modules et le programme de la formation d'élite (Soutenu par l'IA et Markdown)..."
                    themeColor="emerald"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => setIsEducationModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-800 hover:bg-slate-900 hover:border-slate-750 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-650 to-teal-600 hover:brightness-115 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-950/30"
                  >
                    {editingEducation ? "Mettre à jour" : "Publier le Cours"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* WINDOW 2: BLOG (NEWSLETTER / ARTICLES) */}
          {educationForm.type === "Blog" && (
            <div className="w-full max-w-xl bg-slate-950 border border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto w-full">
              <button 
                onClick={() => setIsEducationModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 border-b border-slate-905 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-blue-950/50 border border-blue-800/40 text-blue-400">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase tracking-wide">
                    {editingEducation ? "Modifier l'Article de Blog" : "Nouvel Article du Blog d'élite"}
                  </h3>
                </div>
                <p className="text-zinc-500 text-xs">Partagez vos analyses de l'écosystème tech, rapports statistiques d'ingénieurs et actualités.</p>
              </div>

              <form onSubmit={handleSaveEducation} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Titre de la Publication</label>
                  <div className="relative">
                    <Type className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={educationForm.title}
                      onChange={(e) => setEducationForm({ ...educationForm, title: e.target.value })}
                      placeholder="Ex: L'État de l'Ingénierie Logicielle en Haïti"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/55 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Auteur Rédactionnel / Rédacteur</label>
                    <input
                      type="text"
                      required
                      value={educationForm.author}
                      onChange={(e) => setEducationForm({ ...educationForm, author: e.target.value })}
                      placeholder="Ex: Rodney Altidor"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/55 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Date de publication</label>
                    <input
                      type="date"
                      required
                      value={educationForm.date}
                      onChange={(e) => setEducationForm({ ...educationForm, date: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/55 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Temps de lecture estimé</label>
                  <input
                    type="text"
                    required
                    value={educationForm.readingTime || ""}
                    onChange={(e) => setEducationForm({ ...educationForm, readingTime: e.target.value })}
                    placeholder="Ex: 5 min de lecture, 10 min"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/55 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase font-bold">Chapeau / Résumé d'en-tête (Court)</label>
                  <textarea
                    required
                    rows={2}
                    value={educationForm.summary || ""}
                    onChange={(e) => setEducationForm({ ...educationForm, summary: e.target.value })}
                    placeholder="Saisissez un teaser accrocheur de l'article pour les réseaux et aperçus..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/55 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">URL de l'image d'illustration</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-550" />
                    <input
                      type="url"
                      required
                      value={educationForm.bannerUrl}
                      onChange={(e) => setEducationForm({ ...educationForm, bannerUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/55 transition-colors"
                    />
                  </div>
                </div>

                {/* Tags associated */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Indexation & Mots-clés (Tags)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Ex: Carrière, React"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-zinc-450 hover:text-white cursor-pointer transition-all"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(educationForm.tags || []).map(t => (
                      <span 
                        key={t} 
                        className="px-2 py-1 rounded bg-slate-900 border border-zinc-800/60 text-[10px] font-mono text-zinc-300 hover:line-through cursor-pointer flex items-center space-x-1"
                        onClick={() => handleRemoveTag(t)}
                        title="Cliquer pour supprimer"
                      >
                        <span>#{t}</span>
                        <X className="w-2.5 h-2.5 text-red-500" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Contenu principal de l'article</label>
                  <RichTextEditor
                    value={educationForm.content}
                    onChange={(val) => setEducationForm({ ...educationForm, content: val })}
                    placeholder="Rédigez le texte complet de votre article d'élite en utilisant du Markdown (Soutenu par le Co-pilote IA)..."
                    themeColor="blue"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => setIsEducationModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-800 hover:bg-slate-900 hover:border-slate-750 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-650 to-indigo-650 hover:brightness-115 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-950/35"
                  >
                    {editingEducation ? "Mettre à jour" : "Publier l'Article"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* WINDOW 3: DOCUMENTATION (SUPPORT GUIDES & SPECIFICATIONS) */}
          {educationForm.type === "Doc" && (
            <div className="w-full max-w-xl bg-slate-950 border border-amber-500/20 shadow-2xl shadow-amber-500/10 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto w-full">
              <button 
                onClick={() => setIsEducationModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 border-b border-slate-905 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-amber-950/50 border border-amber-800/40 text-amber-400">
                    <FileText className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 uppercase tracking-wide">
                    {editingEducation ? "Modifier la Documentation" : "Créer une Fiche Technique"}
                  </h3>
                </div>
                <p className="text-zinc-500 text-xs">Générez des guides d'intégration pour nos SDKs, des manuels d'utilisation d'API locales ou des rapports.</p>
              </div>

              <form onSubmit={handleSaveEducation} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Titre du Guide de Support / Doc API</label>
                  <div className="relative">
                    <Type className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={educationForm.title}
                      onChange={(e) => setEducationForm({ ...educationForm, title: e.target.value })}
                      placeholder="Ex: Configuration du Webhook MonCash en v2"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/55 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Auteur technique / Équipe</label>
                    <input
                      type="text"
                      required
                      value={educationForm.author}
                      onChange={(e) => setEducationForm({ ...educationForm, author: e.target.value })}
                      placeholder="Ex: HaitianDev Core Team"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/55 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Dernière mise à jour</label>
                    <input
                      type="date"
                      required
                      value={educationForm.date}
                      onChange={(e) => setEducationForm({ ...educationForm, date: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/55 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Version Technique</label>
                    <input
                      type="text"
                      required
                      value={educationForm.version || ""}
                      onChange={(e) => setEducationForm({ ...educationForm, version: e.target.value })}
                      placeholder="Ex: v1.0, v2.1-beta"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/55 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Catégorie Technique</label>
                    <input
                      type="text"
                      required
                      value={educationForm.category || ""}
                      onChange={(e) => setEducationForm({ ...educationForm, category: e.target.value })}
                      placeholder="Ex: API Integration, Webhooks, Setup"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/55 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Audience visée / Public requis</label>
                  <input
                    type="text"
                    required
                    value={educationForm.targetAudience || ""}
                    onChange={(e) => setEducationForm({ ...educationForm, targetAudience: e.target.value })}
                    placeholder="Ex: Développeurs API, Débutants, Tous Niveaux"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/55 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Icône / Image d'illustration</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-550" />
                    <input
                      type="url"
                      required
                      value={educationForm.bannerUrl}
                      onChange={(e) => setEducationForm({ ...educationForm, bannerUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/55 transition-colors"
                    />
                  </div>
                </div>

                {/* Tags associated */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Mots-clés de l'index d'aide (Tags)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Ex: Webhooks, Node"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-zinc-450 hover:text-white cursor-pointer transition-all"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(educationForm.tags || []).map(t => (
                      <span 
                        key={t} 
                        className="px-2 py-1 rounded bg-slate-900 border border-zinc-800/60 text-[10px] font-mono text-zinc-300 hover:line-through cursor-pointer flex items-center space-x-1"
                        onClick={() => handleRemoveTag(t)}
                        title="Cliquer pour supprimer"
                      >
                        <span>#{t}</span>
                        <X className="w-2.5 h-2.5 text-red-500" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Document Technique</label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${docDragActive ? 'border-amber-500 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'}`}
                    onDragEnter={(e) => { e.preventDefault(); setDocDragActive(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDocDragActive(false); }}
                    onDragOver={(e) => { e.preventDefault(); setDocDragActive(true); }}
                    onDrop={(e) => { 
                      e.preventDefault(); 
                      setDocDragActive(false); 
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setDocFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => document.getElementById('doc-upload')?.click()}
                  >
                    <input 
                      type="file" 
                      id="doc-upload" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setDocFile(e.target.files[0]);
                        }
                      }}
                    />
                    {docFile ? (
                      <>
                        <FileText className="w-8 h-8 text-amber-500 mb-2" />
                        <span className="text-xs text-white font-mono">{docFile.name}</span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); setDocFile(null); }}
                          className="mt-2 text-[10px] text-zinc-500 hover:text-red-400 underline"
                        >
                          Supprimer
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-zinc-600 mb-2" />
                        <span className="text-xs text-zinc-400 font-mono">Glissez-déposez le PDF/Doc, ou cliquez pour charger</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => setIsEducationModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-800 hover:bg-slate-900 hover:border-slate-750 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isDocUploading}
                    className={`px-6 py-2.5 ${isDocUploading ? 'bg-zinc-700' : 'bg-gradient-to-r from-amber-650 to-yellow-650 hover:brightness-115'} text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-950/35`}
                  >
                    {isDocUploading ? "Publication..." : (editingEducation ? "Mettre à jour" : "Publier le Manuel")}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* ================= CREATE ACCOUNT MODAL ================== */}
      {/* ========================================================= */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsAccountModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00209F] to-[#D21034] uppercase">
                Créer un Compte
              </h3>
              <p className="text-zinc-500 text-xs">Configurez un nouvel accès de membre d'élite pour la plateforme.</p>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Nom Complet</label>
                <div className="relative">
                  <Type className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
                  <input
                    type="text"
                    required
                    value={accountForm.fullName}
                    onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })}
                    placeholder="Jean-Jacques Dessalines"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Adresse Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={accountForm.email}
                    onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                    placeholder="dessalines@haitiandev.com"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Rôle Associé</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Étudiant", "Client", "Admin"] as const).map(roleOption => (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => setAccountForm({ ...accountForm, role: roleOption })}
                      className={`py-2.5 text-xs font-mono font-extrabold rounded-xl border tracking-widest uppercase transition-all cursor-pointer ${
                        accountForm.role === roleOption
                          ? "bg-gradient-to-r from-[#00209F]/20 to-[#D21034]/20 border-red-500/65 text-white shadow-lg shadow-red-500/10 scale-[1.02]"
                          : "bg-slate-900/40 border-slate-800 text-zinc-500 hover:text-zinc-350"
                      }`}
                    >
                      {roleOption}
                    </button>
                  ))}
                </div>
              </div>

              {accountForm.role === "Client" && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Nom de l'Entreprise</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required={accountForm.role === "Client"}
                      value={accountForm.companyName || ""}
                      onChange={(e) => setAccountForm({ ...accountForm, companyName: e.target.value })}
                      placeholder="Ex: K-Tech Haiti"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Statut Initial</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Active", "Suspended"] as const).map(statusOption => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setAccountForm({ ...accountForm, accessStatus: statusOption })}
                      className={`py-2 text-xs font-mono font-extrabold rounded-xl border tracking-widest uppercase transition-all cursor-pointer ${
                        accountForm.accessStatus === statusOption
                          ? statusOption === "Active"
                            ? "bg-emerald-950/30 border-emerald-500/55 text-emerald-400 shadow-lg shadow-emerald-500/5"
                            : "bg-red-950/30 border-red-500/55 text-red-500 shadow-lg shadow-red-500/5"
                          : "bg-slate-900/40 border-slate-800 text-zinc-500 hover:text-zinc-350"
                      }`}
                    >
                      {statusOption === "Active" ? "Actif" : "Suspendu"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-[#00209F] to-[#D21034] py-3 text-sm font-semibold rounded-xl text-white hover:brightness-110 shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Créer le Compte
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ================== ACCES PROJET CRUD MODAL ============== */}
      {/* ========================================================= */}
      {isAccessModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-850 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-8">
            <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <span>{editingAccess ? "Modifier l'Accès Projet CMS" : "Créer un Nouvel Accès Projet CMS"}</span>
              </h3>
              <button
                onClick={() => setIsAccessModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-zinc-450 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAccess} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Nom du Client *
                  </label>
                  <input
                    type="text"
                    required
                    value={accessClientName}
                    onChange={(e) => setAccessClientName(e.target.value)}
                    placeholder="Ex: Jean Dupont"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Nom du Projet *
                  </label>
                  <input
                    type="text"
                    required
                    value={accessProjectName}
                    onChange={(e) => setAccessProjectName(e.target.value)}
                    placeholder="Ex: E-commerce Haïti"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Adresse Email Client *
                </label>
                <input
                  type="email"
                  required
                  value={accessClientEmail}
                  onChange={(e) => setAccessClientEmail(e.target.value)}
                  placeholder="Ex: jean.dupont@gmail.com"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Important : L'accès ne s'affichera que dans l'espace client correspondant à cet e-mail.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Lien Administration CMS *
                </label>
                <input
                  type="url"
                  required
                  value={accessAdminLink}
                  onChange={(e) => setAccessAdminLink(e.target.value)}
                  placeholder="Ex: https://monprojet.com/admin"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Identifiant Administration *
                  </label>
                  <input
                    type="text"
                    required
                    value={accessUsername}
                    onChange={(e) => setAccessUsername(e.target.value)}
                    placeholder="Ex: admin"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Mot de Passe *
                  </label>
                  <input
                    type="text"
                    required
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    placeholder="Ex: P@ssword123"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-4">
                <span className="text-xs font-bold text-slate-350 block">connexion api sil y en a (Optionnels)</span>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    API Token (api token)
                  </label>
                  <input
                    type="text"
                    value={accessApiToken}
                    onChange={(e) => setAccessApiToken(e.target.value)}
                    placeholder="Ex: htd_live_token_73849x..."
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    URL Connexion (url connectiom)
                  </label>
                  <input
                    type="url"
                    value={accessDbUri}
                    onChange={(e) => setAccessDbUri(e.target.value)}
                    placeholder="Ex: https://api.monprojet.com/v1"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAccessModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-zinc-400 hover:text-white transition-colors text-sm cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-550 to-yellow-500 text-slate-950 font-bold transition-all hover:scale-[1.01] text-sm cursor-pointer"
                >
                  {editingAccess ? "Enregistrer" : "Créer l'accès"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ================== POPUP CRUD MODAL ===================== */}
      {/* ========================================================= */}
      {isPopupModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsPopupModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00209F] to-[#D21034] uppercase">
                {editingPopup ? "Modifier la boîte de dialogue" : "Créer une alerte d'élite (Popup)"}
              </h3>
              <p className="text-zinc-500 text-xs">Ajustez les conditions d'affichage et l'audience cible.</p>
            </div>

            <form onSubmit={handleSavePopup} className="space-y-4">
              
              {/* Variant Type picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["info", "warning", "promo", "success"] as const).map(styleOpt => (
                    <button
                      key={styleOpt}
                      type="button"
                      onClick={() => setPopupForm({ ...popupForm, type: styleOpt } as any)}
                      className={`py-2 text-[10px] font-mono font-extrabold rounded-xl border tracking-widest uppercase transition-all cursor-pointer ${
                        (popupForm as any).type === styleOpt
                          ? styleOpt === "info" ? "bg-blue-950/30 border-blue-500/55 text-blue-400"
                            : styleOpt === "warning" ? "bg-amber-950/30 border-amber-500/55 text-amber-400"
                            : styleOpt === "promo" ? "bg-red-950/30 border-red-500/55 text-red-500"
                            : "bg-emerald-950/30 border-emerald-500/55 text-emerald-400"
                          : "bg-slate-900/40 border-slate-850 text-zinc-500 hover:text-zinc-350"
                      }`}
                    >
                      {styleOpt}
                    </button>
                  ))}
                </div>
              </div>

               {/* Criticality picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Niveau de criticité</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Basse", "Moyenne", "Haute", "Critique"] as const).map(critOpt => (
                    <button
                      key={critOpt}
                      type="button"
                      onClick={() => setPopupForm({ ...(popupForm as any), criticalityLevel: critOpt })}
                      className={`py-2 text-[10px] font-mono font-extrabold rounded-xl border tracking-widest uppercase transition-all cursor-pointer ${
                        (popupForm as any).criticalityLevel === critOpt
                          ? "bg-slate-800 border-red-500 text-white"
                          : "bg-slate-900/40 border-slate-850 text-zinc-500"
                      }`}
                    >
                      {critOpt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Audience Select */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Audience Cible</label>
                  <select
                    value={popupForm.targetAudience}
                    onChange={(e) => setPopupForm({ ...popupForm, targetAudience: e.target.value as any })}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 cursor-pointer"
                  >
                    <option value="Tous">Tous les Visiteurs</option>
                    <option value="Étudiant">Étudiants Uniquement</option>
                    <option value="Client">Clients Uniquement</option>
                    <option value="Admin">Administrateurs Uniquement</option>
                  </select>
                </div>

                {/* Delay setting */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Délai avant déclenchement</label>
                  <select
                    value={popupForm.delaySeconds}
                    onChange={(e) => setPopupForm({ ...popupForm, delaySeconds: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 cursor-pointer font-mono"
                  >
                    <option value={0}>Immédiat (0 seconde)</option>
                    <option value={1}>1 seconde</option>
                    <option value={2}>2 secondes</option>
                    <option value={3}>3 secondes</option>
                    <option value={5}>5 secondes</option>
                    <option value={10}>10 secondes</option>
                  </select>
                </div>
              </div>

              {/* Popup Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Titre de l'Alerte</label>
                <div className="relative">
                  <Type className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={popupForm.title}
                    onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                    placeholder="Ex: 🚀 Lancement Web d'Élite"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                  />
                </div>
              </div>

              {/* Popup Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Contenu du message</label>
                <textarea
                  required
                  rows={4}
                  value={popupForm.content}
                  onChange={(e) => setPopupForm({ ...popupForm, content: e.target.value })}
                  placeholder="Écrivez le message de communication ici..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 resize-none animate-none"
                />
              </div>

              {/* Call to action details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Texte du Bouton (Optionnel)</label>
                  <div className="relative">
                    <Bookmark className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={popupForm.buttonText}
                      onChange={(e) => setPopupForm({ ...popupForm, buttonText: e.target.value })}
                      placeholder="Ex: Revenir aux Projets"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">URL de Redirection / Chemin</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={popupForm.buttonUrl}
                      onChange={(e) => setPopupForm({ ...popupForm, buttonUrl: e.target.value })}
                      placeholder="Ex: /portfolio"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Active Toggle Option */}
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={popupForm.isActive}
                  onChange={(e) => setPopupForm({ ...popupForm, isActive: e.target.checked })}
                  className="w-4 h-4 bg-zinc-900 hover:bg-zinc-800 accent-red-500 border border-slate-800 justify-center rounded cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-mono font-bold text-zinc-300 uppercase cursor-pointer select-none">
                  Activer immédiatement l'affichage sur la plateforme
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-[#00209F] to-[#D21034] py-3.5 text-xs tracking-wider uppercase font-extrabold font-mono rounded-xl text-white hover:brightness-110 shadow-lg shadow-blue-500/10 cursor-pointer duration-300 hover:scale-[1.01]"
              >
                {editingPopup ? "Enregistrer les modifications" : "Publier l'alerte interactive"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ================== BANNER CRUD MODAL ===================== */}
      {/* ========================================================= */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">

            <div className="space-y-1">
              <h3 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00209F] to-[#D21034] uppercase">
                {editingBanner ? "Modifier la Bannière" : "Créer une Bannière"}
              </h3>
              <p className="text-zinc-500 text-xs">Configurez l'emplacement et le contenu de votre message d'élite.</p>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              
              {/* Variant Type picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Style Visual Preset</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["info", "warning", "promo", "success"] as const).map(styleOpt => (
                    <button
                      key={styleOpt}
                      type="button"
                      onClick={() => setBannerForm({ ...bannerForm, styleVisualPreset: styleOpt })}
                      className={`py-2 text-[10px] font-mono font-extrabold rounded-xl border tracking-widest uppercase transition-all cursor-pointer ${
                        bannerForm.styleVisualPreset === styleOpt
                          ? styleOpt === "info" ? "bg-blue-950/30 border-blue-500/55 text-blue-400"
                            : styleOpt === "warning" ? "bg-amber-950/30 border-amber-500/55 text-amber-400"
                            : styleOpt === "promo" ? "bg-red-950/30 border-red-500/55 text-red-500"
                            : "bg-emerald-950/30 border-emerald-500/55 text-emerald-400"
                          : "bg-slate-900/40 border-slate-850 text-zinc-500 hover:text-zinc-350"
                      }`}
                    >
                      {styleOpt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emplacement / Positioning Switch */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Emplacement de la Bannière</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, emplacementBaniere: "above_navbar" })}
                    className={`py-3 text-[10px] font-mono font-extrabold rounded-xl border tracking-wider uppercase transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      bannerForm.emplacementBaniere === "above_navbar"
                        ? "bg-slate-900 border-red-500/70 text-red-400 shadow-md"
                        : "bg-slate-900/40 border-slate-850 text-zinc-500 hover:text-zinc-350"
                    }`}
                  >
                    <span>🔼 Au-dessus de Navbar</span>
                    <span className="text-[8px] font-normal lowercase text-zinc-550">(Sommet de la page)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, emplacementBaniere: "above_footer" })}
                    className={`py-3 text-[10px] font-mono font-extrabold rounded-xl border tracking-wider uppercase transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      bannerForm.emplacementBaniere === "above_footer"
                        ? "bg-slate-900 border-red-500/70 text-red-400 shadow-md"
                        : "bg-slate-900/40 border-slate-850 text-zinc-500 hover:text-zinc-350"
                    }`}
                  >
                    <span>🔽 Au-dessus du Footer</span>
                    <span className="text-[8px] font-normal lowercase text-zinc-550">(Pied de la page)</span>
                  </button>
                </div>
              </div>

              {/* Target Audience Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Audience Cible</label>
                <select
                  value={bannerForm.targetAudience}
                  onChange={(e) => setBannerForm({ ...bannerForm, targetAudience: e.target.value as any })}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 cursor-pointer h-10"
                >
                  <option value="Tous">Tous les Utilisateurs</option>
                  <option value="Étudiant">Étudiants Uniquement</option>
                  <option value="Client">Clients Uniquement</option>
                  <option value="Admin">Administrateurs Uniquement</option>
                </select>
              </div>

              {/* Text content of banner */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Contenu du Message de la Bannière</label>
                <textarea
                  required
                  rows={3}
                  value={bannerForm.contenuMessage}
                  onChange={(e) => setBannerForm({ ...bannerForm, contenuMessage: e.target.value })}
                  placeholder="Saisissez le texte d'assistance, d'alerte, de promo etc..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 font-mono resize-none"
                />
              </div>

              {/* CTA details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Texte CTA (Optionnel)</label>
                  <div className="relative">
                    <Bookmark className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={bannerForm.texteCta}
                      onChange={(e) => setBannerForm({ ...bannerForm, texteCta: e.target.value })}
                      placeholder="Ex: Découvrir d'Élite"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase">Chemin / URL CTA (Optionnel)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={bannerForm.urlRedirection}
                      onChange={(e) => setBannerForm({ ...bannerForm, urlRedirection: e.target.value })}
                      placeholder="Ex: /services"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/55 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Active Toggle Option */}
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="isBannerActive"
                  checked={bannerForm.isActive}
                  onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                  className="w-4 h-4 bg-zinc-900 hover:bg-zinc-800 accent-red-500 border border-slate-800 justify-center rounded cursor-pointer"
                />
                <label htmlFor="isBannerActive" className="text-xs font-mono font-bold text-zinc-300 uppercase cursor-pointer select-none">
                  Activer immédiatement l'affichage de la bannière
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-[#00209F] to-[#D21034] py-3.5 text-xs tracking-wider uppercase font-extrabold font-mono rounded-xl text-white hover:brightness-110 shadow-lg shadow-blue-500/10 cursor-pointer duration-300 hover:scale-[1.01]"
              >
                {editingBanner ? "Enregistrer les modifications" : "Publier la bannière d'élite"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ================= COMPOSE MESSAGE MODAL ================= */}
      {/* ========================================================= */}
      {isNewMessageModalOpen && selectedRecipient && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto w-id" id="compose-message-modal">
            <button 
              type="button"
              onClick={() => setIsNewMessageModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 uppercase flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-500" />
                <span>Rédiger un Message Directeur</span>
              </h3>
              <p className="text-zinc-500 text-xs">
                À : <strong className="text-white">{selectedRecipient.name}</strong> ({selectedRecipient.role}) — {selectedRecipient.email}
              </p>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Objet du Message</label>
                <input
                  type="text"
                  required
                  value={newMessageSubject}
                  onChange={(e) => setNewMessageSubject(e.target.value)}
                  placeholder="Ex : Notification importante concernant votre devis"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/55 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Contenu de la notification</label>
                <textarea
                  required
                  rows={6}
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  placeholder="Écrivez le message ici..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500/55 font-mono leading-relaxed resize-none"
                />
                <p className="text-[10px] text-zinc-500 italic mt-1 font-mono">
                  * Note : Ce message sera visible immédiatement sur l'espace client/étudiant de {selectedRecipient.name} et envoyé par simulation courriel SMTP.
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-red-650 py-3.5 text-xs tracking-wider uppercase font-extrabold font-mono rounded-xl text-white hover:brightness-110 shadow-lg shadow-pink-500/10 cursor-pointer duration-300 hover:scale-[1.01]"
              >
                Expédier le Message &amp; l'Email
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ================== EDIT MESSAGE MODAL =================== */}
      {/* ========================================================= */}
      {editingMessage && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto w-id" id="edit-message-modal">
            <button 
              type="button"
              onClick={() => setEditingMessage(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-900 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 uppercase flex items-center gap-2">
                <Edit className="w-5 h-5 text-pink-500" />
                <span>Modifier le Message</span>
              </h3>
              <p className="text-zinc-500 text-xs">
                Modification du message d'ID : <strong className="text-white">{editingMessage.id}</strong>
              </p>
            </div>

            <form onSubmit={handleSaveEditedMessage} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Destinataire</label>
                <input
                  type="text"
                  required
                  value={editMessageRecipient}
                  onChange={(e) => setEditMessageRecipient(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/55 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Adresse Email</label>
                <input
                  type="email"
                  required
                  value={editMessageEmail}
                  onChange={(e) => setEditMessageEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/55 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Objet du Message</label>
                <input
                  type="text"
                  required
                  value={editMessageSubject}
                  onChange={(e) => setEditMessageSubject(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/55 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Contenu de la notification</label>
                <textarea
                  required
                  rows={5}
                  value={editMessageContent}
                  onChange={(e) => setEditMessageContent(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500/55 font-mono leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Statut</label>
                <select
                  value={editMessageStatus}
                  onChange={(e) => setEditMessageStatus(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500/55 font-mono"
                >
                  <option value="Envoyé" className="bg-slate-950 text-white font-mono">Envoyé</option>
                  <option value="En attente" className="bg-slate-950 text-white font-mono">En attente</option>
                  <option value="Lu" className="bg-slate-950 text-white font-mono">Lu</option>
                  <option value="Archivé" className="bg-slate-950 text-white font-mono">Archivé</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-red-650 py-3.5 text-xs tracking-wider uppercase font-extrabold font-mono rounded-xl text-white hover:brightness-110 shadow-lg shadow-pink-500/10 cursor-pointer duration-300 hover:scale-[1.01]"
              >
                Sauvegarder les modifications
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ============= SIMULATED EMAIL PREVIEW OVERLAY ============ */}
      {/* ========================================================= */}
      {simulatedEmail && simulatedEmail.isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#141517] border border-zinc-800 rounded-2xl p-0 shadow-2xl overflow-hidden relative w-id" id="email-preview-modal">
            
            {/* Window control bar (macOS style) */}
            <div className="bg-[#1e1f22] px-6 py-4 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span className="text-zinc-550 font-mono text-[10px] uppercase font-bold tracking-widest pl-3">Simulateur SMTP Dispatch</span>
              </div>
              <button 
                type="button"
                onClick={() => setSimulatedEmail(null)}
                className="text-zinc-400 hover:text-white transition-colors text-xs font-mono tracking-wide uppercase px-2 py-1 bg-zinc-900/60 rounded-md border border-zinc-800/80 cursor-pointer"
              >
                Fermer l'alerte
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Email dispatch header animation */}
              <div className="flex items-center space-x-3 bg-emerald-950/15 border border-emerald-950/40 p-4 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l8-4a2 2 0 011.61 0l8 4A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Courrier SMTP Envoyé</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Le serveur de messagerie a dispatché un email authentifié vers le domaine du récipiendaire.</p>
                </div>
              </div>

              {/* Email Fields */}
              <div className="space-y-2 text-xs font-mono border-b border-zinc-900 pb-4">
                <div className="flex"><span className="w-20 text-zinc-550 uppercase">De :</span> <span className="text-white font-semibold">HaitianDev Team &lt;contact@haitiandev.org&gt;</span></div>
                <div className="flex"><span className="w-20 text-zinc-550 uppercase">À :</span> <span className="text-yellow-450 font-bold">{simulatedEmail.recipientName} &lt;{simulatedEmail.to}&gt;</span></div>
                <div className="flex"><span className="w-20 text-zinc-550 uppercase">Objet :</span> <span className="text-pink-400 font-extrabold">{simulatedEmail.subject}</span></div>
              </div>

              {/* Email Content Body */}
              <div className="bg-[#0b0c0d] border border-zinc-900 p-5 rounded-xl font-sans text-xs text-zinc-350 whitespace-pre-line leading-relaxed max-h-[250px] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-zinc-900">
                  <img src="https://i.postimg.cc/xT9tmPsn/haitiandev-(1).png" alt="Haitian D.E.V." className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                  <span className="text-[10px] font-mono text-zinc-550">HAITIANDEV ELITE NOTIFIER</span>
                </div>
                {simulatedEmail.content}
                <div className="mt-8 pt-4 border-t border-zinc-900/50 text-[11px] text-zinc-550 font-mono">
                  Cordialement,
                  <br />
                  Le conseil d'administration HaitianDev S.A.
                  <br />
                  Port-au-Prince, Haïti • https://haitiandev.com
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* DELETION CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-950 border border-red-900/30 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(220,38,38,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Trash2 className="w-24 h-24 text-red-500" />
              </div>
              
              <div className="relative z-10 space-y-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500 border border-red-500/20">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Suppression Définitive</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Voulez-vous vraiment supprimer <span className="text-red-400 font-bold">"{deleteConfirmation.title}"</span> ? Cette action est irréversible et sera propagée sur Firestore.
                  </p>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
                    className="flex-1 px-6 py-4 bg-zinc-900 text-zinc-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmExecuteDelete}
                    className="flex-1 px-6 py-4 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.3)] cursor-pointer"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
};

// ==========================================
// INTERACTIVE STATS COMPONENTS HELPERS
// ==========================================

const InteractiveBarChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = [
    { name: "Haitian Diaspora Commerce", clics: 420 },
    { name: "Ayiti Tech LMS Academy", clics: 310 },
    { name: "Karabela Fashion Hub", clics: 245 },
    { name: "Resto Lakay Engine", clics: 180 },
    { name: "Haiti Tour App", clics: 129 }
  ];

  const maxClicks = Math.max(...data.map(d => d.clics));

  return (
    <div className="space-y-5">
      <div className="space-y-4 pt-2">
        {data.map((project, idx) => {
          const widthPercentage = Math.max(12, Math.round((project.clics / maxClicks) * 100));
          const isSelected = hoveredIdx === idx;

          return (
            <div 
              key={idx} 
              className="space-y-1 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span className={`transition-colors font-semibold ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                  {project.name}
                </span>
                <span className={`font-bold transition-colors ${isSelected ? 'text-[#D21034]' : 'text-zinc-550'}`}>
                  {project.clics} vues
                </span>
              </div>
              <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-900 group relative">
                <div 
                  className="h-full rounded-full transition-all duration-300 relative"
                  style={{ 
                    width: `${widthPercentage}%`,
                    background: "linear-gradient(90deg, #00209F 0%, #D21034 100%)",
                    filter: isSelected ? "brightness(1.25) drop-shadow(0 0 6px rgba(210,16,52,0.4))" : "none"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950/50 rounded-2xl p-3 border border-slate-900 flex justify-between items-center text-[10px] font-mono text-zinc-500">
        <span>Source: Clics de tracking logs</span>
        <span>{hoveredIdx !== null ? `Focus: ${data[hoveredIdx].name}` : "Survolez une barre pour analyser"}</span>
      </div>
    </div>
  );
};

const InteractiveLineChart: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(6);

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const visits = [85, 120, 145, 110, 192, 160, 230];
  const messages = [2, 1, 4, 2, 3, 5, 12];

  const getX = (idx: number) => {
    return 40 + idx * 65;
  };

  const getYVisits = (val: number) => {
    return 140 - (val / 250) * 110;
  };

  const getYMessages = (val: number) => {
    return 140 - (val / 15) * 110;
  };

  const visitsPath = days.map((_, i) => `${getX(i)},${getYVisits(visits[i])}`).join(" L ");
  const visitsArea = `${getX(0)},140 L ${visitsPath} L ${getX(6)},140 Z`;

  const messagesPath = days.map((_, i) => `${getX(i)},${getYMessages(messages[i])}`).join(" L ");
  const messagesArea = `${getX(0)},140 L ${messagesPath} L ${getX(6)},140 Z`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-2xl">
        <div>
          <span className="text-[10px] text-zinc-500 font-mono block">DÉTAIL {days[activeIdx].toUpperCase()}</span>
          <div className="flex gap-4 mt-1">
            <div>
              <p className="text-xs text-zinc-400">Visites</p>
              <p className="text-lg font-bold font-display text-[#00D2FF]">{visits[activeIdx]}</p>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <p className="text-xs text-zinc-400 font-display">Messages</p>
              <p className="text-lg font-bold font-display text-[#D21034]">{messages[activeIdx]}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.02] border border-white/5 px-2.5 py-1.5 rounded-xl">
            Cliquez un point pour filtrer
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox="0 0 480 160" className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="visits-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="messages-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D21034" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#D21034" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <line x1="40" y1="30" x2="430" y2="30" stroke="#1e293b" strokeDasharray="3,3" />
          <line x1="40" y1="85" x2="430" y2="85" stroke="#1e293b" strokeDasharray="3,3" />
          <line x1="40" y1="140" x2="430" y2="140" stroke="#334155" strokeWidth="1" />

          {days.map((day, idx) => (
            <text 
              key={idx} 
              x={getX(idx)} 
              y="156" 
              fontSize="9" 
              fontFamily="monospace" 
              fill={activeIdx === idx ? "#ffffff" : "#64748b"} 
              textAnchor="middle"
              className="cursor-pointer font-bold transition-colors"
              onClick={() => setActiveIdx(idx)}
            >
              {day}
            </text>
          ))}

          <polygon points={visitsArea} fill="url(#visits-grad)" />
          <path 
            d={`M ${visitsPath}`} 
            fill="none" 
            stroke="#00D2FF" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          <polygon points={messagesArea} fill="url(#messages-grad)" />
          <path 
            d={`M ${messagesPath}`} 
            fill="none" 
            stroke="#D21034" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {days.map((_, idx) => {
            const xv = getX(idx);
            const yv = getYVisits(visits[idx]);
            const ym = getYMessages(messages[idx]);
            const isActive = activeIdx === idx;

            return (
              <g key={idx} className="cursor-pointer" onClick={() => setActiveIdx(idx)}>
                {isActive && (
                  <line x1={xv} y1="15" x2={xv} y2="140" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
                )}

                <circle 
                  cx={xv} 
                  cy={yv} 
                  r={isActive ? 4.5 : 3} 
                  fill="#020617" 
                  stroke="#00D2FF" 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                />

                <circle 
                  cx={xv} 
                  cy={ym} 
                  r={isActive ? 4.5 : 3} 
                  fill="#020617" 
                  stroke="#D21034" 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                />

                <rect 
                  x={xv - 15} 
                  y="10" 
                  width="30" 
                  height="130" 
                  fill="transparent" 
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex gap-4 justify-center text-[9px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
          <span className="text-zinc-550">Visites du Site</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#D21034]" />
          <span className="text-zinc-550">Messages de contact</span>
        </div>
      </div>
    </div>
  );
};
