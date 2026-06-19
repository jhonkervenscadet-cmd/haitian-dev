export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  tags: string[];
  features: string[];
  process: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  code: string;
  subtitle: string;
  category: "Fintech" | "AI" | "Logistics" | "Education" | "SaaS" | "Media";
  description: string;
  fullDesc?: string;
  image: string;
  stats?: { label: string; value: string }[];
  client?: string;
  year?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  color: string;
  aspect: string;
  desc: string;
}

export interface ProcessItem {
  step: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface DocItem {
  id: string;
  category: string;
  title: string;
  description: string;
  sections: { title: string; content: string }[];
}

export interface CourseItem {
  id: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  curriculum: string[];
  certifyingBody: string;
  registrationUrl?: string;
}

export interface FormationItem {
  id: string;
  titre: string;
  formateur: string;
  dateDebut: string;
  duree: string;
  niveau: string;
  organisme: string;
  lienInscription?: string;
  urlImage?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  type: string;
  location: string;
  description: string;
  time: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "web-design",
    slug: "web-design",
    title: "Web Design & Site Vitrine",
    description: "Sites premium, e-commerce, plateformes SaaS sur mesure.",
    longDescription: "Nous créons des plateformes web ultra-rapides, adaptées aux environnements à faible bande passante comme la 3G d'Haïti, sans jamais faire de compromis sur le design ni l'interaction tactile.",
    icon: "Globe",
    tags: ["React & Next.js", "Tailwind CSS", "SaaS & Cloud Backend", "E-commerce MonCash"],
    features: [
      "Optimisation bande-passante extrême (sous 200KB par route)",
      "Intégrations fintech locales (MonCash & cartes internationales)",
      "Design d'exception axé sur les taux de conversion",
      "Hébergement haut de gamme résistant aux pannes réseau"
    ],
    process: ["Spécifications", "Maquettes UX d'élite", "Codage sémantique TypeScript", "Tests de charge 3G/4G", "Mise en service"]
  },
  {
    id: "app-dev",
    slug: "app-dev",
    title: "Mobile App Development",
    description: "iOS et Android natifs — performance et design haut de gamme.",
    longDescription: "Applications natives conçues pour s'intégrer harmonieusement et offrir une fluidité absolue sur tous les écrans, dotées d'un mode hors-ligne intelligent pour s'adapter au contexte haïtien.",
    icon: "Smartphone",
    tags: ["Flutter & React Native", "iOS / Swift", "Android / Kotlin", "Offline-first Engine"],
    features: [
      "Persistance locale des données (SQLite/SupaBase)",
      "Expérience utilisateur fluide à 120 FPS",
      "Notifications push adaptitives par SMS de secours",
      "Optimisation de l'utilisation de la batterie"
    ],
    process: ["Prototypage Figma", "Architecture MVVM", "Sprints Agile", "Publication App Store & Play Store"]
  },
  {
    id: "ai-automation",
    slug: "ai-automation",
    title: "IA & Business Automation",
    description: "Modèles, agents intelligents et automatisation sur-mesure.",
    longDescription: "Nous entraînons et déployons des modèles d'IA sur le cloud ou en local pour accroître l'efficacité de vos équipes, automatiser vos documents et analyser vos données financières.",
    icon: "Sparkles",
    tags: ["Modèles Kreyòl-natifs", "Agents d'automatisation", "Machine Learning", "Vision par ordinateur"],
    features: [
      "Traduction et modélisation de texte créole de pointe",
      "Automatisation intelligente des flux de données",
      "Agents autonomes connectés à vos bases d'affaires",
      "Tableaux de bord d'analyses prédictives"
    ],
    process: ["Ingénierie de données", "Fine-tuning & Entraînement", "Déploiement API", "Supervision des performances"]
  },
  {
    id: "game-dev",
    slug: "game-dev",
    title: "Jeux Vidéos & WebGL 3D",
    description: "Expériences ludiques 2D/3D pour mobile et web.",
    longDescription: "Jeux interactifs immersifs, du casual game mobile 2D au mini-monde 3D en WebGL, parfaits pour engager vos communautés ou éduquer par le divertissement.",
    icon: "Gamepad2",
    tags: ["Unity & WebGL", "Physics Engines", "3D Modeling Pro", "Interactive Branding"],
    features: [
      "Jeux promotionnels de marketing viral à fort impact",
      "Expériences 3D interactives de marque sur le web",
      "Serious games à but éducationnel et d'entraînement",
      "Optimisation graphique mobile maximale"
    ],
    process: ["Game Design & Storyboard", "Direction Artistique", "Séquençage physique", "Déploiement cross-platform"]
  }
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "mwa-fintech",
    code: "MWAFintech",
    title: "MonCash Wallet App",
    subtitle: "Digital Wallet Redefined",
    category: "Fintech",
    description: "Une application de portefeuille électronique d'élite, redéfinissant l'accès mobile à MonCash en Haïti. Plus rapide, plus sûre, avec intégration d'empreintes digitales et transferts instandannés.",
    image: "fintech_wallet",
    stats: [
      { label: "Temps de chargement", value: "< 1.2s" },
      { label: "Taux de satisfaction", value: "98.7%" },
      { label: "Sécurité", value: "Bancaire AES-256" }
    ],
    client: "MWAMoney S.A.",
    year: "2025"
  },
  {
    id: "kreyol-voice-ai",
    code: "KVAIA",
    title: "Kreyòl Voice AI",
    subtitle: "Conversational Creole Assistant",
    category: "AI",
    description: "Reconnaissance vocale et synthèse de pointe pour la langue créole. Permet de piloter des robots ou de transcrire des messages audio directement en kreyòl.",
    image: "voice_ai_bg",
    stats: [
      { label: "Précision BLEU", value: "94.2%" },
      { label: "Temps de latence", value: "180ms" },
      { label: "Vocabulaire local", value: "1.2M mots" }
    ],
    client: "AI For Haiti Fund",
    year: "2026"
  },
  {
    id: "global-shipping-tracker",
    code: "GSTLogistique",
    title: "Global Shipping Tracker",
    subtitle: "Supply Chain Live Map",
    category: "Logistics",
    description: "Plateforme de suivi des cargaisons en temps réel pour le fret maritime et aérien entrant en Haïti. Cartographie en direct et notifications automatisées.",
    image: "shipping_tracker",
    stats: [
      { label: "Précision GPS", value: "Métrique" },
      { label: "Actualisation", value: "30s" },
      { label: "Conteneurs suivis", value: "15k+/mois" }
    ],
    client: "Haitian Shipping Logistics",
    year: "2025"
  },
  {
    id: "e-infotronique-portal",
    code: "EPWeb",
    title: "E-Infotronique Portal",
    subtitle: "Next-Gen Academic Hub",
    category: "Education",
    description: "Le portail universitaire d'apprentissage en ligne de l'École Supérieure d'Infotronique, doté de fonctionnalités de classe virtuelle interactive et de gestion des notes.",
    image: "infotronique_main",
    stats: [
      { label: "Étudiants actifs", value: "3,500+" },
      { label: "Uptime serveur", value: "99.98%" },
      { label: "Taille totale du bundle", value: "145KB" }
    ],
    client: "École Supérieure d'Infotronique d'Haïti",
    year: "2026"
  },
  {
    id: "restaurant-cloud-system",
    code: "RCSSaaŠ",
    title: "Restaurant Cloud System",
    subtitle: "Fluid POS Solution",
    category: "SaaS",
    description: "Gérez votre restaurant à l'aide d'une solution de point de vente basée sur le cloud. Suivi des stocks, commandes de cuisine et facturation en kreyòl.",
    image: "restaurant_cloud",
    stats: [
      { label: "Transactions journalières", value: "450k+" },
      { label: "Réduction des pertes", value: "22%" },
      { label: "Prise en main", value: "15 mins" }
    ],
    client: "Lakay Food Group",
    year: "2025"
  },
  {
    id: "hr-management-tool",
    code: "HMTEntreprise",
    title: "HR Management Tool",
    subtitle: "Low-Bandwidth Workplace System",
    category: "SaaS",
    description: "Outils de gestion d'équipe adaptés aux environnements à faible bande passante, optimisant les plannings et les processus RH régionaux.",
    image: "hr_management",
    stats: [
      { label: "Équipe trackée", value: "1,200+" },
      { label: "Gain administratif", value: "35%" },
      { label: "Mode hors-ligne", value: "SQLite-backed" }
    ],
    client: "Sogebank Corporate Partners",
    year: "2025"
  },
  {
    id: "haiti-news-hub",
    code: "HNHMédia",
    title: "Haïti News Hub",
    subtitle: "3G-Fast Press Network",
    category: "Media",
    description: "Un portail de nouvelles ultra-léger conçu pour charger en 3G, regroupant toutes les actualités technologiques et économiques d'Haïti.",
    image: "news_hub",
    stats: [
      { label: "Visites uniques", value: "1.5M/mois" },
      { label: "Poids de page", value: "85KB" },
      { label: "Vitesse d'affichage", value: "450ms" }
    ],
    client: "Press Tech Haiti",
    year: "2024"
  },
  {
    id: "edukreyol-lms",
    code: "ELÉducation",
    title: "EduKreyòl LMS",
    subtitle: "Creole Digital Education Portal",
    category: "Education",
    description: "Système de gestion de l'apprentissage entièrement traduit en créole haïtien, permettant l'éducation numérique universelle même hors ligne.",
    image: "edukreyol_lms",
    stats: [
      { label: "Leçons gratuites", value: "450+" },
      { label: "Écoles équipées", value: "32" },
      { label: "Langue", value: "Kreyòl Natif" }
    ],
    client: "Ministère de l'Éducation Nationale (Mènfp)",
    year: "2025"
  },
  {
    id: "pay-lakay-gateway",
    code: "PGPaiement",
    title: "Pay-Lakay Gateway",
    subtitle: "Haiti Combined Checkout API",
    category: "Fintech",
    description: "Passerelle de paiement unifiée facilitant l'acceptation de MonCash, Stripe, et Sogexpress sur n'importe quel site e-commerce.",
    image: "pay_lakay_checkout",
    stats: [
      { label: "Succès d'API", value: "99.95%" },
      { label: "Intégration", value: "En 3 lignes" },
      { label: "Devises", value: "HTG & USD" }
    ],
    client: "Haitian E-commerce Assembly",
    year: "2026"
  },
  {
    id: "agritech-dashboard",
    code: "ADAgriculture",
    title: "AgriTech Dashboard",
    subtitle: "Coffee Crop Analytics Platform",
    category: "SaaS",
    description: "Tableau de bord de capteurs IoT et d'analyses météorologiques pour l'agriculture haïtienne, améliorant le rendement des cultures de café.",
    image: "agritech_dash",
    stats: [
      { label: "Fermes connectées", value: "150+" },
      { label: "Rendement de café", value: "+18%" },
      { label: "Capteurs autonomes", value: "LoRaWAN" }
    ],
    client: "Fédération des Producteurs de Café d'Haïti",
    year: "2025"
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  { id: "g1", title: "Brand Identity System", category: "Fintech", color: "from-blue-600 to-indigo-800", aspect: "aspect-video", desc: "Charte graphique moderne intégrant la vision d'une fintech inclusive." },
  { id: "g2", title: "3D Morphing Shapes WebGL", category: "Interactive Design", color: "from-purple-600 to-pink-700", aspect: "aspect-square", desc: "Recherche sur l'animation fluide interactive de particules." },
  { id: "g3", title: "Haitian Pride Poster Layout", category: "Graphic Design", color: "from-red-600 to-orange-600", aspect: "aspect-[3/4]", desc: "Affiche célébrant le bicentenaire et la fierté technologique." },
  { id: "g4", title: "MonCash App UI Dark Mode", category: "UI/UX Design", color: "from-neutral-850 to-zinc-950", aspect: "aspect-square", desc: "Design d'interface d'application bancaire ultra-sombre pour soulager les yeux." },
  { id: "g5", title: "EduKreyol Learning App UI", category: "UI/UX Design", color: "from-emerald-600 to-teal-800", aspect: "aspect-[4/3]", desc: "Composants de gamification pour stimuler l'apprentissage scolaire." },
  { id: "g6", title: "Kreyol Speak Chatbot Design", category: "AI UI", color: "from-cyan-600 to-sky-800", aspect: "aspect-video", desc: "Composant d'assistant d'IA vocale interactif avec vagues sonores animées." },
  { id: "g7", title: "Crypto-Lakay Mobile Wallet", category: "Tech UI", color: "from-violet-600 to-fuchsia-800", aspect: "aspect-[9/16]", desc: "Concept de portefeuille blockchain cryptographique minimaliste." },
  { id: "g8", title: "Infotronique Smart Campus 3D Card", category: "Web3D", color: "from-amber-600 to-rose-700", aspect: "aspect-square", desc: "Rendu tridimensionnel des bâtiments universitaires en CSS standard." }
];

export const PROCESS_DATA: ProcessItem[] = [
  {
    step: "01",
    title: "Découverte",
    description: "Nous écoutons votre vision et vos objectifs.",
    icon: "Compass",
    details: [
      "Prise de contact sous 24h ouvrées",
      "Sessions d'idéation approfondies",
      "Écoute de vos besoins commerciaux particuliers",
      "Analyse de l'environnement concurrentiel"
    ]
  },
  {
    step: "02",
    title: "Stratégie",
    description: "Architecture, stack et roadmap définies.",
    icon: "Target",
    details: [
      "Choix de l'architecture logicielle optimale",
      "Modélisation de la base de données",
      "Spécifications de bande passante fine (Digicel/Natcom friendly)",
      "Définition précise des jalons de livraison"
    ]
  },
  {
    step: "03",
    title: "Design",
    description: "Maquettes haut de gamme et prototypes interactifs.",
    icon: "Layers",
    details: [
      "Création de maquettes Figma pixel-perfect",
      "Construction de prototypes haute fidélité cliquables",
      "Tests d'utilisabilité mobiles interactifs",
      "Validation de l'identité visuelle de marque"
    ]
  },
  {
    step: "04",
    title: "Développement",
    description: "Sprints agiles avec démos hebdomadaires.",
    icon: "Code",
    details: [
      "Développement en TypeScript strict d'élite",
      "Sprints agiles de 1 à 2 semaines",
      "Revue de code bidirectionnelle et tests automatisés",
      "Démos client régulières en environnement d'essai"
    ]
  },
  {
    step: "05",
    title: "Lancement",
    description: "Mise en production, tests et formation.",
    icon: "Rocket",
    details: [
      "Passage en revue sécurité exhaustif",
      "Optimisation SEO et vitesse de chargement (FCP, LCP)",
      "Configuration CDN pour faible temps de latence en Haïti",
      "Formation personnalisée de vos équipes internes"
    ]
  },
  {
    step: "06",
    title: "Croissance",
    description: "Support, optimisations et évolutions continues.",
    icon: "TrendingUp",
    details: [
      "Maintenance réactive et support 7/7 jours",
      "Suivi analytique du comportement des utilisateurs",
      "Améliorations de performance continues",
      "Déploiement incrémental de nouvelles fonctionnalités"
    ]
  }
];

export const BLOG_DATA: BlogItem[] = [
  {
    id: "b1",
    slug: "haiti-next-decade-tech-led",
    title: "Why Haiti's next decade will be tech-led",
    summary: "Découvrez notre essai fondateur explorant comment le saut technologique et l'IA permettent à Haïti de se positionner comme un hub d'innovation compétitif à l'international.",
    content: "L'histoire mondiale montre que les pays en développement peuvent sauter des étapes d'infrastructure en adoptant directement les technologies du futur. L'Afrique a sauté les lignes téléphoniques terrestres pour devenir le leader mondial du mobile money. Haïti s'apprête à faire de même avec l'intelligence artificielle et le développement d'applications décentralisées.\n\nEn formant une armée d'ingénieurs hautement qualifiés via l'École Supérieure d'Infotronique et en concevant des logiciels suivant les standards de la Silicon Valley, Haitian D.E.V. crée la structure d'accueil de cette révolution technologique. Les pannes de réseau et l'électricité instable ne sont pas des barrières infranchissables, mais plutôt des paramètres d'ingénierie que nous intégrons en concevant des architectures résilientes (offline-first, bases SQLite cryptées, communications SMS d'urgence). L'excellence haïtienne s'exportera mondialement.",
    date: "2026-05-12",
    category: "Vision",
    readTime: "5 min",
    author: {
      name: "Jean-Eudes Pierre",
      role: "Co-Fondateur & Principal Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    }
  },
  {
    id: "b2",
    slug: "building-kreyol-native-llms",
    title: "Building Kreyòl-native LLMs",
    summary: "Nos notes de recherche détaillées sur le perfectionnement (fine-tuning) de modèles de langage open-source pour comprendre et parler couramment le créole haïtien.",
    content: "La plupart des grands modèles de langage sont entraînés sur d'immenses corpus internet occidentaux. Le créole haïtien y est extrêmement sous-représenté, ce qui conduit à des traductions robotiques, des contresens culturels ou un manque complet d’empathie conversationnelle.\n\nChez Haitian Dev, nous collectons des ensembles de données exclusifs, éditons des dictionnaires linguistiques précis, et procédons au fine-tuning (perfectionnement) de modèles tels que Llama-3 et Mistral pour les rendre Kreyòl-natifs. En mesurant les taux de précision BLEU et en menant des évaluations linguistiques locales, nous concevons des chatbots capables d'aider un agriculteur des Cayes ou un commerçant de Pétion-Ville dans leur propre langue de manière fluide et vocale.",
    date: "2026-04-30",
    category: "IA & R&D",
    readTime: "8 min",
    author: {
      name: "Tania Jean-Baptiste",
      role: "Directrice IA & Data Research",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    }
  },
  {
    id: "b3",
    slug: "moncash-deep-dive",
    title: "MonCash deep-dive: real engineering notes",
    summary: "Comprendre de manière technique et de bout en bout l'intégration de MonCash : gestion des webhooks de paiement, retry policy, et sécurisation des signatures d'API.",
    content: "L'API MonCash de la Digicel est indispensable pour toute entreprise souhaitant automatiser son activité en Haïti. Cependant, l'intégration brute dans un environnement de production présente de nombreux défis techniques.\n\nDans cet article, nous décrivons notre architecture de webhooks sans serveur (serverless webhooks) capable d'encaisser des pics de transactions sans faillir. Nous détaillons la logique cryptographique HMAC permettant de valider les requêtes de notification de paiement, notre file d'attente à reprise automatique pour re-partir sur des erreurs temporaires de réseau, et comment concevoir de formidables interfaces utilisateur optimisées pour mobile afin de réduire les abandons au moment du checkout.",
    date: "2026-03-15",
    category: "Engineering",
    readTime: "12 min",
    author: {
      name: "Jean-Eudes Pierre",
      role: "Co-Fondateur & Principal Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    }
  },
  {
    id: "b4",
    slug: "performance-on-3g-checklist",
    title: "Performance on 3G: our checklist",
    summary: "Notre checklist technique interne pour maintenir le chargement des applications web sous les 200KB et réactives même sur un réseau Digicel ou Natcom saturé.",
    content: "Concevoir des applications lourdes avec de gigantesques images de plusieurs mégaoctets est une erreur fondamentale en Haïti. L'accès à internet y est facturé au mégaoctet et s'exécute le plus souvent sur des connexions 3G partagées et instables.\n\nNotre checklist de performance inclut :\n1. Le partitionnement systématique du code (Dynamic Code Splitting)\n2. La conversion de toutes les images au format WebP/AVIF compressé de haute qualité\n3. L'élimination radicale des librairies superflues au profit d'alternatives légères ou de code brut native-ES\n4. L'utilisation agressive du cache de service (Service Worker cache)\nGrâce à ces techniques, nos sites s'affichent instantanément en moins de 1,5 seconde n'importe où en Haïti.",
    date: "2026-02-05",
    category: "Performance",
    readTime: "6 min",
    author: {
      name: "Fabrice Michel",
      role: "Lead Frontend Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    }
  },
  {
    id: "b5",
    slug: "why-we-open-sourced-our-design-system",
    title: "Why we open-sourced our design system",
    summary: "Retour d’expérience sur l’ouverture de notre bibliothèque de composants UI Haitian-Design-System au grand public et l’impact sur les startups locales.",
    content: "La cohérence et le poli d'une interface sont trop souvent réservés aux grandes entreprises disposant de designers dédiés. Pour relever le niveau général du web haïtien, nous avons pris la décision de rendre notre système de design interne entièrement open-source.\n\nCe système réunit des directives d'accessibilité WCAG, des palettes thématisées fondées sur la symbolique des couleurs d'Haïti, et un ensemble de composants React et Tailwind CSS prêts à l’emploi. En ouvrant ce code, nous permettons aux créateurs et développeurs indépendants de prototyper des services visuellement remarquables en un clin d'œil, tout en consolidant l'écosystème d'ingénierie open-source haïtien.",
    date: "2025-12-18",
    category: "Design",
    readTime: "4 min",
    author: {
      name: "Tania Jean-Baptiste",
      role: "Directrice IA & Data Research",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    }
  },
  {
    id: "b6",
    slug: "ecole-superieure-infotronique-year-one",
    title: "École Supérieure d'Infotronique: year one",
    summary: "Un bilan statistique et d'impact de notre première année de partenariat d'enseignement d'ingénierie avancée dotant les étudiants d'un tremplin mondial.",
    content: "L'accès à l'apprentissage de la programmation de pointe est un droit fondamental pour éveiller le génie collectif haïtien. Par ce partenariat étroit, notre studio a développé des cursus d'ingénierie logicielle basés sur des projets de production réels.\n\nAprès un an d'activité, nous célébrons nos premiers succès : 85 étudiants certifiés Fullstack, 12 applications mobiles lancées publiquement sur l'App Store, et 18 stages d'insertion professionnelle décrochés directement au sein de notre studio ou auprès de nos partenaires à l'étranger. Nous poursuivons sur cette lancée pour quintupler ces chiffres dès la rentrée prochaine.",
    date: "2025-11-04",
    category: "Impact",
    readTime: "7 min",
    author: {
      name: "Jean-Eudes Pierre",
      role: "Co-Fondateur & Principal Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    }
  }
];

export const DOCS_DATA: DocItem[] = [
  {
    id: "getting-started",
    category: "Guides",
    title: "Getting Started",
    description: "Set up your environment, deploy your first app, ship in 10 minutes.",
    sections: [
      { title: "Introduction", content: "Bienvenue dans l'environnement de développement Haitian D.E.V. Nous utilisons des outils modernes axés sur la vitesse de développement et la résilience réseau." },
      { title: "Configuration requise", content: "Assurez-vous de posséder Node.js (version 20+) et pnpm ou npm d'installé. Clonez le dépôt et exécutez `npm install`." },
      { title: "Déploiement rapide", content: "Exécutez `npm run build` puis déployez d'un clic vers notre infrastructure CDN edge optimisée pour un chargement instantané." }
    ]
  },
  {
    id: "frontend-guides",
    category: "Conventions",
    title: "Frontend Guides",
    description: "React, TanStack, Tailwind — patterns and conventions we live by.",
    sections: [
      { title: "Philosophie CSS", content: "Nous utilisons exclusivement Tailwind CSS v4 pour garantir le bundle CSS le plus léger possible. Utilisez les variables de thème `@theme` pour les couleurs globales." },
      { title: "Gestion d'état", content: "Favorisez l'état local ou React Context. Pour les appels API asynchrones complexes, utilisez TanStack Query qui gère nativement la persistance et le cache hors-ligne." },
      { title: "Accessibilité", content: "Chaque élément interactif doit posséder un label aria-label explicite, et la navigation au clavier via tab-index doit être préservée." }
    ]
  },
  {
    id: "ai-bots",
    category: "IA",
    title: "AI & Bots",
    description: "Build Kreyòl-aware bots, fine-tune models, deploy at the edge.",
    sections: [
      { title: "API Kreyòl Voice AI", content: "Utilisez notre point de terminaison de synthèse vocale pour transcrire de l'audio créole ou synthétiser des fichiers audio d'accueil personnalisés." },
      { title: "Intégration WhatsApp Chatbots", content: "Nos modèles d'agents d'automatisation se connectent en direct à l'API Cloud de WhatsApp. Configurez les jetons webhooks d'événement dans l'espace projet." }
    ]
  },
  {
    id: "data-backend",
    category: "Bases de données",
    title: "Data & Backend",
    description: "PostgreSQL, edge functions, realtime — rock-solid foundations.",
    sections: [
      { title: "Configuration Database", content: "Pour stocker des masses de transactions, nos projets utilisent PostgreSQL sur Google Cloud SQL combiné avec Prisma ou Drizzle ORM." },
      { title: "Sécurité de Lignes (RLS)", content: "Toutes les tables utilisateur doivent appliquer l'isolation par clé utilisateur à l'aide de politiques Row-Level Security (RLS) strictes." }
    ]
  },
  {
    id: "integrations",
    category: "Code Snippets",
    title: "Integrations",
    description: "MonCash, Stripe, WhatsApp, Twilio — copy-paste ready snippets.",
    sections: [
      { title: "MonCash Checkout API", content: "Snippet de création de paiement d'élite :\n```ts\nimport { createPayment } from '@haitiandev/moncash';\nconst payment = await createPayment({\n  amount: 2500,\n  orderId: 'ORDER_098'\n});\n```" },
      { title: "Webhooks Stripe", content: "Validation et traitement immédiat des paiements internationaux Stripe par signature cryptée." }
    ]
  },
  {
    id: "security",
    category: "Sécurité",
    title: "Security",
    description: "Auth, RLS, secrets management — protect what matters.",
    sections: [
      { title: "Authentification Double Facteur", content: "Intégrez des sessions sécurisées à haute résistance avec déconnexion automatique lors de doutes réseau." },
      { title: "Gestion des secrets", content: "Ne commitez jamais de jetons d'accès d'API dans votre dépôt Git. Stockez-les de manière sécurisée dans des variables d'environnement (`process.env`)." }
    ]
  }
];

export const COURSES_DATA: CourseItem[] = [
  {
    id: "fullstack",
    title: "Fullstack Web Engineering",
    duration: "6 mois — Intensif",
    level: "Intermédiaire à Avancé",
    description: "Maîtrisez React, Node.js, l'optimisation des performances de bande passante et la modélisation de bases de données cloud de production.",
    curriculum: [
      "Semaine 1-4 : HTML Sémantique, TypeScript strict & Tailwind CSS d'élite",
      "Semaine 5-12 : React Avancé, Hooks personnalisés & Gestion d'état",
      "Semaine 13-18 : Backend avec Express/Node.js, PostgreSQL & Drizzle ORM",
      "Semaine 19-24 : Projet de synthèse réel, audits de sécurité et déploiement final"
    ],
    certifyingBody: "École Supérieure d'Infotronique d'Haïti"
  },
  {
    id: "mobile",
    title: "Mobile Development (iOS & Android)",
    duration: "4 mois",
    level: "Débutant à Intermédiaire",
    description: "Développez des applications fluides et pérennes grâce à Flutter et React Native avec mode hors-ligne complet.",
    curriculum: [
      "Dart & structure fondamentales de Flutter",
      "Gestion d'interfaces adaptatives et gestes tactiles",
      "Persistance locale et synchronisation périodique avec le cloud",
      "Soumission des builds d'applications dans les stores Apple et Google"
    ],
    certifyingBody: "École Supérieure d'Infotronique d'Haïti & Haitian D.E.V."
  },
  {
    id: "creole-llm",
    title: "AI & Kreyòl LLMs",
    duration: "3 mois",
    level: "Avancé (Prérequis Python/Maths)",
    description: "Plongez dans le traitement du langage naturel, le fine-tuning de modèles pré-entraînés et le déploiement d'agents de messagerie locaux.",
    curriculum: [
      "Théorie des Transformers et architectures de réseaux de neurones",
      "Techniques de tokenisation et extraction de données linguistiques en kreyòl",
      "Fine-tuning supervisé (LoRA/QLoRA) et ingénierie de prompts",
      "Mise en service et hébergement à faible coût d'API d'IA"
    ],
    certifyingBody: "Haitian D.E.V. AI Lab"
  },
  {
    id: "game-unity",
    title: "Game Development with Unity",
    duration: "4 mois",
    level: "Débutant",
    description: "Devenez créateur de jeux interactifs en 2D et 3D pour stimuler le marketing interactif et l'esprit créatif.",
    curriculum: [
      "Interface de Unity et scripts C# fondamentaux",
      "Gestion de la physique 2D, collisions et événements de jeu",
      "Création d'environnements et éclairages 3D légers",
      "Optimisation de compilation WebGL pour le chargement navigateur mobile"
    ],
    certifyingBody: "École Supérieure d'Infotronique d'Haïti"
  },
  {
    id: "game-advanced",
    title: "Conception de Jeux & Moteurs 3D (Godot, Unreal)",
    duration: "3 mois",
    level: "Avancé",
    description: "Maîtrisez les moteurs de jeu professionnels Godot et Unreal, la physique 3D temps réel, et la programmation réseau multijoueur.",
    curriculum: [
      "Introduction aux moteurs Godot et Unreal Engine 5",
      "Programmation de shaders avancés et effets visuels (VFX)",
      "Architecture réseau pour jeux multijoueurs en temps réel",
      "Optimisation des performances GPU/CPU et compilation cross-platform"
    ],
    certifyingBody: "Haitian D.E.V. Games Studio"
  },
  {
    id: "security-ethics",
    title: "Cybersecurity & Ethical Hacking",
    duration: "4 mois",
    level: "Intermédiaire à Avancé",
    description: "Apprenez à auditer et verrouiller des applications web et réseaux face aux attaques persistantes.",
    curriculum: [
      "Cryptographie appliquée et protocoles réseau sécurisés",
      "Recherche active de failles (OWASP Top 10) et injections SQL",
      "Tests d'intrusion éthiques (Penetration testing)",
      "Mise en place de systèmes de détection d'intrusions (IDS)"
    ],
    certifyingBody: "École Supérieure d'Infotronique d'Haïti"
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    id: "summit2026",
    title: "Haitian D.E.V. Summit 2026",
    date: "2026-10-18",
    type: "Conférence physique & Stream",
    location: "Hôtel Karibe, Pétion-Ville, Haïti",
    description: "Le sommet annuel phare réunissant ingénieurs, designers, entrepreneurs et étudiants de toute la Caraïbe pour discuter d'IA, de fintech et de souveraineté numérique.",
    time: "09:00 - 18:00"
  },
  {
    id: "ai-workshop",
    title: "Kreyòl AI Workshop",
    date: "2026-07-22",
    type: "Atelier pratique interactif",
    location: "En ligne via Zoom",
    description: "Atelier de codage pratique : entraînez et déployez de bout en bout votre premier agent conversationnel capable de comprendre et de répondre vocalement au créole haïtien.",
    time: "14:00 - 17:00"
  },
  {
    id: "hackathon-moncash",
    title: "MonCash Hackathon",
    date: "2026-08-14",
    type: "Hackathon de 48 heures",
    location: "Campus de l'École Supérieure d'Infotronique, Port-au-Prince",
    description: "Montez une équipe, réfléchissez à une solution fintech résolvant un cas d'usage national réel, et codez un produit fonctionnel reposant sur l'API MonCash en 48h chrono.",
    time: "Début Vendredi 18:00"
  },
  {
    id: "open-classroom",
    title: "Infotronique Open Day",
    date: "2026-06-25",
    type: "Portes ouvertes physiques",
    location: "Port-au-Prince, Haïti",
    description: "Venez visiter les salles de classe physiques, échangez avec les professeurs certifiés et assistez en direct à des projets de fin d'études remarquables présentés par les étudiants.",
    time: "10:00 - 15:00"
  }
];
