import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, Calendar, ArrowLeft, ArrowRight, User2, MessageSquare, Send, ChevronRight, X, Share } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BLOG_DATA, BlogItem } from "../data/staticData";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getBlogListSchema } from "../utils/seoSchemas";
import { loadCollection, subscribeToCollection } from "../utils/firebaseSync";
import { normalizeArticle, NormalizedBlogItem } from "../utils/normalizeArticle";

export const Blog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [searchParams, setSearchParams] = useSearchParams();
  const activeSlug = searchParams.get("post");
  const [posts, setPosts] = useState<NormalizedBlogItem[]>([]);
  const [activePost, setActivePost] = useState<NormalizedBlogItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await loadCollection<any>("articles", "haitiandev_articles_local", BLOG_DATA);
      setPosts(data.map(normalizeArticle));
    };
    fetchPosts();

    const unsubscribe = subscribeToCollection<any>("articles", "haitiandev_articles_local", (data) => {
      setPosts(data.map(normalizeArticle));
    }, BLOG_DATA);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeSlug && posts.length > 0) {
      const found = posts.find((p) => p.slug === activeSlug || p.id === activeSlug);
      if (found) {
        setActivePost(found);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (!activeSlug) {
      setActivePost(null);
    }
  }, [activeSlug, posts]);

  const selectPost = (slug: string) => {
    setSearchParams({ post: slug });
  };

  const closePost = () => {
    setSearchParams({});
  };

  // High fidelity translations for hardcoded static records inside GALLERY_DATA / BLOG_DATA
  const getTranslatedBlogPost = (post: NormalizedBlogItem) => {
    if (!isEn) return post;

    const englishBlogPosts: { [key: string]: { title: string; summary: string; content: string; readTime: string; category: string; author: { name: string; role: string } } } = {
      "lancement-haitiandev-studio": {
        title: "Launching Haitian Dev Studio",
        summary: "Connecting our island to international technological standards through elite engineering.",
        readTime: "5 min",
        category: "STUDIO",
        author: {
          name: "Frédéric Georges",
          role: "Director of Technical Engineering"
        },
        content: `Today, we are thrilled to officially announce the launch of Haitian Dev, a boutique digital studio headquartered in Port-au-Prince.

Our mission is straightforward: bridge the technological gap by assembling elite developers, UX archetypes, and automation experts who understand both national constraints and global performance protocols.

1. Why a local studio with global standards?
Too often, software for developing countries is treated as a secondary project — slow, built on stale templates, or relying on heavy internet bands. We reject this. Haitian Dev compiles robust, light, high-performance assets. We integrate local MonCash gateways and build Creole speech APIs, delivering international craft right here.

2. A native pedagogical backbone.
Through our structural collaboration with École Supérieure d'Infotronique, we maintain a rare academic and technical link. The standard is extremely high. Our trainees and junior engineers develop alongside international experts, certifying that our national technology becomes self-sustainable.

This project is just starting. Thank you for embarking on this innovative path with us.`
      },
      "optimisations-moncash-e-commerce": {
        title: "Optimizing MonCash integrations for e-commerce checkouts",
        summary: "How double-checking webhooks safeguards transaction states on volatile connections.",
        readTime: "8 min",
        category: "FINTECH",
        author: {
          name: "Darline Saint-Fleur",
          role: "Head of Mobile & Payments Architectures"
        },
        content: `Integrating MonCash by Digicel is a non-negotiable step for any merchant platform operating in Haiti. However, many developers encounter transaction failures due to variable mobile connections.

Here is the exact method our engineers build to lock the system states securely.

1. Robust state checkouts.
Rather than trusting the brief instant user redirection, your API must implement dual webhooks. At checkout creation, we register a pending payload inside our database. If the primary check is cut off, an automated cron checks transaction receipts via Digicel's standard payload.

2. Lightweight fallback SMS alerts.
In areas where 3G or 4G data bands drop, user confirmations drop too. By integrating automated SMS alert fallbacks, our platforms alert buyers instantly when their mobile wallet transfer succeeds.

Securing transactional code is what makes local e-commerce trustable. Let's make sure it is flawless.`
      },
      "why-haiti-next-decade-tech-led": {
        title: "Why Haiti's next decade will be tech-led",
        summary: "Discover our founding essay exploring how technical leapfrogging and AI position Haiti as an internationally competitive innovation hub.",
        readTime: "5 min",
        category: "Vision",
        author: {
          name: "Jean-Eudes Pierre",
          role: "Co-Founder & Principal Architect"
        },
        content: `World history shows that developing nations can bypass certain infrastructure stages by leaping directly to tomorrow's systems. Just as parts of Africa bypassed landlines for mobile payments, Haiti has a prime window to leap directly into advanced automation and localized full-stack software.

By cultivating elite engineering talent alongside pedagogical anchors like the École Supérieure d'Infotronique, Haitian D.E.V. builds the structural landing pads for this paradigm shift. Local network interruptions and power outages are not blockers; they are constraints that drive our architectures (offline-first sync engines, lightweight locally queried stores, and cellular fallback notifications). Elite Haitian engineering is global engineering.`
      },
      "building-kreyol-llms": {
        title: "Building Kreyòl-native LLMs",
        summary: "Our research notes on fine-tuning decentralized language models to process, understand and reply fluently in pure Haitian Creole.",
        readTime: "6 min",
        category: "AI",
        author: {
          name: "Sébastien Antoine",
          role: "Head of AI Research"
        },
        content: `Standard open models often hallucinate or fail entirely on Haitian Creole, reducing grammar to direct French translations or failing to understand localized semantics. 

Our engineering team compiled a custom training set of real-world dialogue, historic literature, and technical resources to fine-tune compact models for Edge computing. The result is a series of Creole dialogue APIs capable of guiding non-technical operators through complex workflows entirely by voice, paving the way for seamless localized AI.`
      }
    };

    const targetKey = post.slug || "";
    const eng = englishBlogPosts[targetKey];
    if (eng) {
      return {
        ...post,
        title: eng.title,
        summary: eng.summary,
        content: eng.content,
        readTime: eng.readTime,
        category: eng.category,
        author: {
          ...post.author,
          name: eng.author.name,
          role: eng.author.role
        }
      };
    }

    return post;
  };

  const transPost = activePost ? getTranslatedBlogPost(activePost) : null;
  const seoTitle = activePost
    ? `${transPost?.title} — HaitianDev Blog`
    : (isEn ? "HaitianDev Blog — Tech Innovation & Digital Strategy" : "Blog HaitianDev — Innovation Technologique & Stratégie Digitale");
  const seoDesc = activePost
    ? (transPost?.summary || "")
    : (isEn ? "Discover our latest tech insights into MonCash webhooks, web systems performance, and software pedagogy." : "Découvrez nos actualités et analyses d'experts sur MonCash, la performance web et la pédagogie logicielle en Haïti.");

  const blogListSchema = getBlogListSchema(posts.map((p) => ({
    title: p.title,
    desc: p.summary,
    url: `/blog?post=${p.slug}`,
    date: p.date || "2026-06-09"
  })));

  const activePostSchema = activePost ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": transPost?.title,
    "description": transPost?.summary,
    "url": `https://haitiandev.com/blog?post=${activePost.slug}`,
    "datePublished": transPost?.date || "2026-06-09",
    "author": {
      "@type": "Person",
      "name": transPost?.author?.name || "HaitianDev"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HaitianDev",
      "logo": "https://i.postimg.cc/MTCfPytf/haitiandev.png"
    }
  } : undefined;

  const currentSchema = activePost ? activePostSchema : blogListSchema;

  return (
    <div className="py-16 bg-zinc-950 relative overflow-hidden dot-grid min-h-[90vh]">
      <SEO
        title={seoTitle}
        description={seoDesc}
        schema={currentSchema}
        ogType={activePost ? "article" : "website"}
      />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-955/5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <AnimatePresence mode="wait">
          {activePost ? (() => {
            const transPost = getTranslatedBlogPost(activePost);
            return (
              <motion.article
                key={activePost.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-10 text-left"
              >
                {/* Back button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={closePost}
                    className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors cursor-pointer bg-zinc-900 border border-zinc-850 px-3.5 py-2.5 rounded-lg shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{isEn ? "Back to blog" : "Retour au blog"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShareUrl(window.location.href);
                      setIsShareModalOpen(true);
                    }}
                    className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors cursor-pointer bg-zinc-900 border border-zinc-850 px-3.5 py-2.5 rounded-lg shrink-0"
                    title={isEn ? "Share" : "Partager"}
                  >
                    <Share className="w-4 h-4" />
                    <span>{isEn ? "Share" : "Partager"}</span>
                  </button>
                </div>

                {/* Cover title block */}
                <div className="space-y-6 text-center sm:text-left border-b border-zinc-900 pb-10">
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-blue-500 bg-blue-950/40 border border-blue-900/50 px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-block w-max">
                    {transPost.category}
                  </span>

                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                    {transPost.title}
                  </h1>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono text-zinc-500 justify-start pt-2">
                    <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{transPost.date}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{transPost.readTime} {isEn ? "read" : "de lecture"}</span>
                    </div>
                  </div>
                </div>

                {/* Author header panel */}
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/40 backdrop-blur-xl border border-white/10 max-w-md">
                  <img
                    src={transPost.author.avatar}
                    alt={transPost.author.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full border border-zinc-800 object-cover shrink-0"
                  />
                  <div className="text-left">
                    <h4 className="text-sm font-display font-bold text-white leading-tight">{transPost.author.name}</h4>
                    <p className="text-[11px] font-mono text-zinc-500">{transPost.author.role}</p>
                  </div>
                </div>

                {/* Narrative Content */}
                <div className="prose prose-invert max-w-none text-zinc-305 text-sm sm:text-base leading-relaxed space-y-6 font-sans">
                  {transPost.content.split("\n\n").map((p: string, idx: number) => {
                    if (p.startsWith("1.")) {
                      return (
                        <ol key={idx} className="list-decimal pl-6 space-y-2 text-zinc-400">
                          {p.split("\n").map((itemMsg: string, iIdx: number) => (
                            <li key={iIdx}>{itemMsg.replace(/^\d+\.\s*/, "")}</li>
                          ))}
                        </ol>
                      );
                    }
                    return <p key={idx} className="leading-relaxed whitespace-pre-line">{p}</p>;
                  })}
                </div>

                {/* Bottom return area */}
                <div className="border-t border-zinc-900 pt-8 flex justify-between items-center text-xs font-mono">
                  <button onClick={closePost} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" /> {isEn ? "Back to index" : "Revenir à l'index"}
                  </button>
                  <div className="text-zinc-650">Haitian Dev core publications</div>
                </div>

              </motion.article>
            );
          })() : (
            /* BLOG ARTICLES LIST */
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {/* Heading */}
              <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                <Link to="/" className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-500 hover:text-white transition-colors">
                  <span>{isEn ? "← Home" : "← Accueil"}</span>
                </Link>
                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pb-2 uppercase tracking-tight">BLOG</h1>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {isEn 
                    ? "Agency news, engineering deep-dives, design notes and tech leadership stories from Haiti's premier studio."
                    : "Actualités du studio, analyses d'ingénierie approfondies, notes de design et perspectives technologiques."}
                </p>
              </div>

              {/* Blog listings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {posts.map((post) => {
                  const transP = getTranslatedBlogPost(post);
                  return (
                    <Card
                      key={post.id}
                      onClick={() => selectPost(post.slug)}
                      variant="glass"
                      className="cursor-pointer bg-slate-900/30 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 p-8 flex flex-col justify-between rounded-3xl transition-all duration-300 shadow-2xl"
                    >
                      <div className="space-y-6">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                          <span className="text-blue-400 font-bold uppercase bg-blue-950/20 border border-blue-900/50 px-2.5 py-0.5 rounded">
                            {transP.category}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{transP.date}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-left">
                          <h3 className="font-display text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {transP.title}
                          </h3>
                          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans line-clamp-3">
                            {transP.summary}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-900/50 mt-6 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-500">
                          <span>{isEn ? `Min read: ${transP.readTime}` : `Temps de lecture : ${transP.readTime}`}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-blue-500 flex items-center space-x-1 hover:text-blue-400 transition-colors cursor-pointer">
                          <span>{isEn ? "Read Article →" : "Lire l'article →"}</span>
                        </span>
                      </div>

                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Modal */}
        <AnimatePresence>
          {isShareModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsShareModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white font-display">
                    {isEn ? "Share this article" : "Partager cet article"}
                  </h3>
                  <button
                    onClick={() => setIsShareModalOpen(false)}
                    className="text-zinc-500 hover:text-white transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400 font-sans">
                    {isEn 
                      ? "Copy the link below to share this article with your network:" 
                      : "Copiez le lien ci-dessous pour partager cet article avec votre réseau :"}
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl).then(() => {
                          window.alert(isEn ? "Link copied to clipboard!" : "Lien copié dans le presse-papier !");
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-bold transition-colors shrink-0 flex items-center space-x-2"
                    >
                      <span>{isEn ? "Copy" : "Copier"}</span>
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
