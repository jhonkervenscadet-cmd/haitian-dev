import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Terminal, ChevronRight, FileText, Search, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DOCS_DATA, DocItem } from "../data/staticData";
import { Card } from "../components/ui/Card";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";
import { loadCollection, subscribeToCollection } from "../utils/firebaseSync";
import { renderMarkdownToHtml } from "../utils/markdown";
import { openOrDownloadDocument } from "../utils/localFileStore";

export const Docs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [docsList, setDocsList] = useState<any[]>(DOCS_DATA);
  const [activeDocId, setActiveDocId] = useState<string>("getting-started");

  useEffect(() => {
    const initDocs = async () => {
      try {
        const dc = await loadCollection<any>("docs", "haitiandev_docs_local", DOCS_DATA);
        const filteredDocs = (dc || []).filter(d => !d.type || d.type === "Doc");
        const uniqueDocs = Array.from(new Map(filteredDocs.map(item => [item.id, item])).values());
        setDocsList(uniqueDocs);
      } catch (err) {
        console.error("Error loading docs collection:", err);
      }
    };
    initDocs();

    const unsubscribe = subscribeToCollection<any>("docs", "haitiandev_docs_local", (data) => {
      const filteredDocs = (data || []).filter(d => !d.type || d.type === "Doc").map((d: any) => ({
        ...d,
        description: d.description || d.summary || ""
      }));
      const uniqueDocs = Array.from(new Map(filteredDocs.map(item => [item.id, item])).values());
      setDocsList(uniqueDocs);
    }, DOCS_DATA);

    return () => {
      unsubscribe();
    };
  }, []);

  const activeDoc = docsList.find((doc) => doc.id === activeDocId) || docsList[0] || DOCS_DATA[0];

  // High fidelity translations for hardcoded static records inside DOCS_DATA
  const getTranslatedDocItem = (doc: any) => {
    if (!doc) return { id: "", title: "", description: "", category: "GUIDES", sections: [] };
    if (!isEn) return doc;

    const englishDocs: { [key: string]: { title: string; description: string; category: string; sections: { title: string; content: string }[] } } = {
      "getting-started": {
        title: "Getting Started with Haitian Dev",
        description: "Core guidelines, styling pairs, routing conventions, and setup requirements.",
        category: "GUIDES",
        sections: [
          {
            title: "Development Philosophy",
            content: "We enforce absolute craftsmanship across all assets. This means avoiding unsolicited code volume (bloatware) and utilizing standard, scalable framework primitives. Our styling strategy relies exclusively on high-contrast Tailwind CSS layouts, ensuring robust variable colors and responsive padding."
          },
          {
            title: "Project Initialization",
            content: "Ensure standard environment configuration before running local builds. All secure credentials must reside server-side, accessed cleanly via specific express gateways, avoiding client exposure of API secrets. Run the development server with: \n\n```ts\nnpm run dev\n```"
          }
        ]
      },
      "moncash-api": {
        title: "MonCash API Integration Guide",
        description: "Secure wallet transaction checklists, endpoints, and dual webhook payment fallbacks.",
        category: "FINTECH",
        sections: [
          {
            title: "Access Tokens Authentication",
            content: "Acquire your verified credentials from Digicel's manager panel. All checkout creations must authenticate against the standard credential endpoints. Ensure all transaction IDs check against secondary database verification registers."
          },
          {
            title: "Dual Webhook Verification Code",
            content: "Never rely purely on immediate front redirection statuses. Always register pending transaction payloads and double check statuses asynchronously via secure background cron loops:\n\n```ts\nasync function verifyMonCashPayment(transactionId: string) {\n  const secureStatus = await callDigicelStatusVerifyAPI(transactionId);\n  if (secureStatus.confirmed) {\n    await db.updatePaymentState(transactionId, 'SUCCESS');\n  }\n}\n```"
          }
        ]
      },
      "kreyol-voice-model": {
        title: "Kreyòl Voice Assistant Integration",
        description: "Setup guidelines for Creole transcription pipelines and audio file processing routing.",
        category: "AI & ML",
        sections: [
          {
            title: "Speech Processing Pipelines",
            content: "Haitian Creole phonemes contain specific nasal properties requiring customized language weights. When deploying speech models, route active recordings into optimized high-speed audio pipelines."
          },
          {
            title: "Low Bandwidth Client Optimization",
            content: "To guarantee performance on local Digicel & Natcom networks, files must undergo compression down to low audio bitrates before upload. Transcribe voice in the background and pipe texts to standard UI loops."
          }
        ]
      }
    };

    const eng = englishDocs[doc.id];
    if (eng) {
      return {
        ...doc,
        title: eng.title,
        description: eng.description,
        category: eng.category,
        sections: eng.sections
      };
    }

    return doc;
  };

  const activeDocTrans = getTranslatedDocItem(activeDoc);

  return (
    <div className="py-16 bg-zinc-950 relative overflow-hidden dot-grid min-h-[90vh]">
      <SEO
        title={isEn ? "Developer APIs & Tech Stack Docs — HaitianDev" : "Documentation Développeurs & APIs — HaitianDev"}
        description={isEn 
          ? "Read our comprehensive developer manuals. Learn about local MonCash integrations, Kreyòl LLM fine-tunings, and web setup blueprints." 
          : "Consultez nos guides techniques : intégration MonCash, fine-tuning LLM Kreyòl et architectures web de pointe."}
        schema={getOrganizationSchema()}
      />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-955/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <Link to="/" className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-500 hover:text-white transition-colors">
            <span>{isEn ? "← Home" : "← Accueil"}</span>
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pb-2 uppercase tracking-tight">DOCS</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {isEn 
              ? "Developer resources, guides, and reference material — everything you need to build with Haitian Dev. Standardize your elite projects."
              : "Ressources développeurs, guides de démarrage et matériel de référence — tout ce dont vous avez besoin pour bâtir avec Haitian Dev. Standardisez vos projets d'élites."}
          </p>
        </div>

        {/* Documentation columns layout */}
        {docsList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gradient-to-b from-zinc-900/30 via-zinc-950/40 to-black border border-zinc-800/80 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto space-y-6 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-1/4 w-48 h-48 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-red-600/5 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="p-4 bg-zinc-900/80 rounded-2xl w-fit mx-auto border border-zinc-800/80 text-red-500/80 relative z-10">
              <BookOpen className="w-10 h-10" />
            </div>
            
            <div className="space-y-2 relative z-10">
              <h3 className="font-display font-extrabold text-2xl text-white">
                {isEn ? "No Documentation Available" : "Aucune Documentation Disponible"}
              </h3>
              <p className="text-zinc-400 text-sm font-sans max-w-md mx-auto leading-relaxed">
                {isEn 
                  ? "We are currently curating technical resources and API schemas. Please check back later or return to the homepage."
                  : "Nous concevons actuellement des ressources techniques et des schémas d'API de pointe. Veuillez revenir plus tard ou retourner à l'accueil."}
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <Link
                to="/"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider transition-opacity"
              >
                <span>{isEn ? "Back to Home" : "Retour à l'accueil"}</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Sidebar indices */}
            <aside className="lg:col-span-4 space-y-4 max-h-[85vh] overflow-y-auto pr-2">
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest block font-bold mb-2">
                {isEn ? "Reference Guides" : "Guides de référence"}
              </span>
              
              <div className="space-y-2.5">
                {docsList.map((doc) => {
                  const transItem = getTranslatedDocItem(doc);
                  const isSelected = activeDocId === doc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setActiveDocId(doc.id)}
                      className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer duration-300 ${
                        isSelected
                          ? "bg-slate-900/60 backdrop-blur-xl border-white/20 text-white shadow-lg"
                          : "bg-slate-950/20 backdrop-blur-md border-white/5 text-zinc-400 hover:border-red-500/20 hover:bg-slate-900/40"
                      }`}
                    >
                      <div className="space-y-1 text-left">
                        <span className="text-[10px] font-mono text-blue-500 font-bold uppercase tracking-wider block">[{(transItem.category || "GUIDES").toUpperCase()}]</span>
                        <h4 className="font-display text-sm font-bold">{transItem.title}</h4>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90 text-red-500" : "text-zinc-650"}`} />
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* RIGHT COLUMN: Document content */}
            <main className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDocTrans.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-slate-900/30 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl space-y-8 shadow-2xl max-h-[85vh] overflow-y-auto"
                >
                  {/* Intro */}
                  <div className="space-y-3 border-b border-zinc-900 pb-6">
                    <div className="flex items-center space-x-2 text-xs font-mono text-zinc-600">
                      <span>INDEX /</span>
                      <span>{(activeDocTrans.category || "GUIDES").toUpperCase()} /</span>
                      <span className="text-blue-500">{(activeDocTrans.title || "").toUpperCase()}</span>
                    </div>
                    <h2 className="font-display text-2xl font-extrabold text-white text-left">{activeDocTrans.title}</h2>
                    <p className="text-zinc-400 text-sm font-sans text-left">{activeDocTrans.description}</p>
                  </div>

                  {/* Subsections details */}
                  <div className="space-y-6">
                    {activeDocTrans.content ? (
                      <div 
                        className="prose prose-invert max-w-none text-sm text-zinc-350 space-y-4 font-sans text-left"
                        dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(activeDocTrans.content) }}
                      />
                    ) : activeDocTrans.sections ? (
                      activeDocTrans.sections.map((sec: any, sIdx: number) => {
                        const isCodeBlock = sec.content && sec.content.includes("```ts");
                        return (
                          <div key={sIdx} className="space-y-3 text-left">
                            <h3 className="font-display text-base font-bold text-white flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span>{sec.title}</span>
                            </h3>
                            
                            {isCodeBlock ? (
                              <div className="space-y-3 font-mono text-xs text-zinc-400 bg-zinc-950 p-4 rounded-xl border border-zinc-850 overflow-x-auto leading-relaxed">
                                <p className="text-zinc-600">// Code execution block</p>
                                <pre className="whitespace-pre-wrap">{sec.content.replace(/```ts\n|```/g, "")}</pre>
                              </div>
                            ) : (
                              <p className="text-zinc-400 text-sm font-sans leading-relaxed">
                                {sec.content}
                              </p>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-zinc-500 text-sm italic">{isEn ? "No content available." : "Aucun contenu disponible."}</p>
                    )}
                  </div>

                  {activeDocTrans.documentUrl && (
                    <div className="pt-6 border-t border-zinc-900 text-left">
                      <button
                        onClick={() => openOrDownloadDocument(activeDocTrans.documentUrl, activeDocTrans.title)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white hover:from-blue-500 hover:to-red-500 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-red-500/20 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{isEn ? "Open Technical Document (PDF)" : "Ouvrir la Fiche Technique (PDF)"}</span>
                      </button>
                    </div>
                  )}

                  {/* Developer Footer validation */}
                  <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-500">
                    <div className="flex items-center space-x-2 justify-center sm:justify-start">
                      <Terminal className="w-4 h-4 text-zinc-600" />
                      <span>{isEn ? "Compiled documentation v1.0.4" : "Documentation compilée v1.0.4"}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-emerald-500 justify-center sm:justify-start">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isEn ? "Verified cryptographic compliance checks" : "Signatures de chiffrement conformes"}</span>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </main>

          </div>
        )}

      </div>
    </div>
  );
};
