import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Clock, Award, CheckCircle, ChevronDown, BookOpen, Send, UserCheck, X, User, Calendar, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { FormationItem } from "../data/staticData";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SEO } from "../components/SEO/SEO";
import { getTrainingSchema } from "../utils/seoSchemas";
import { saveCollectionItem, loadCollection, subscribeToCollection } from "../utils/firebaseSync";

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

export const Training: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [formations, setFormations] = useState<FormationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrollingFormation, setEnrollingFormation] = useState<FormationItem | null>(null);
  const [studentInfo, setStudentInfo] = useState({ name: "", email: "", motivation: "" });
  const [enrollSubmitted, setEnrollSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const initFormations = async () => {
      const data = await loadCollection<FormationItem>("formations", "haitiandev_formations_local", DEFAULT_FORMATIONS);
      setFormations(data);
      setLoading(false);
    };
    initFormations();

    const unsubscribe = subscribeToCollection<FormationItem>("formations", "haitiandev_formations_local", (data) => {
      setFormations(data);
    }, DEFAULT_FORMATIONS);

    return () => unsubscribe();
  }, []);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInfo.name || !studentInfo.email) return;

    try {
      const newEnrollment = {
        id: `enroll_${Date.now()}`,
        clientName: studentInfo.name,
        email: studentInfo.email,
        company: "Student",
        specs: `Motivation: ${studentInfo.motivation}\nCourse: ${enrollingFormation?.titre}`,
        estimatedBudget: "Training Program",
        desiredDeadline: enrollSubmitted ? "Immediate" : "Variable",
        serviceType: `Formation: ${enrollingFormation?.titre}`,
        status: "Nouveau / En attente" as const,
        createdAt: new Date().toISOString()
      };

      // Save to Firestore 'devis' collection as requested (all funnels)
      await saveCollectionItem("devis", "haitian_dev_devis_local", newEnrollment, []);

      // Also mirror to legacy local storage if needed
      const existingLegacy = JSON.parse(localStorage.getItem("haitian_dev_devis") || "[]");
      localStorage.setItem("haitian_dev_devis", JSON.stringify([...existingLegacy, newEnrollment]));

      setEnrollSubmitted(true);
      setTimeout(() => {
        setEnrollSubmitted(false);
        setEnrollingFormation(null);
        setStudentInfo({ name: "", email: "", motivation: "" });
      }, 2500);
    } catch (error) {
      console.error("Failed to enroll student in Firestore:", error);
    }
  };

  return (
    <div className="py-16 bg-zinc-950 relative overflow-hidden dot-grid min-h-[90vh]">
      <SEO
        title={isEn ? "Elite Software Engineering Bootcamps — HaitianDev" : "Formations & Bootcamps en Ingénierie Logicielle — HaitianDev"}
        description={isEn 
          ? "Enroll in elite training courses to master fullstack web, mobile, and AI architectures in Haiti. Build live projects with industry standards." 
          : "Inscrivez-vous aux bootcamps et formations d'excellence en développement Web, applications mobiles et IA de HaitianDev Academy."}
        schema={getTrainingSchema()}
      />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-red-955/5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
          <Link to="/" className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-500 hover:text-white transition-colors">
            <span>{isEn ? "← Home" : "← Accueil"}</span>
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pb-2 uppercase tracking-tight">
            {isEn ? "TRAINING" : "FORMATIONS"}
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {isEn 
              ? "A futuristic university portal — Infotronique-certified programs that turn Haitian talent into world-class software engineers." 
              : "Un portail universitaire futuriste — des programmes certifiés Infotronique qui transforment le talent haïtien en ingénieurs de classe mondiale."}
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-t-red-500 border-r-transparent border-red-500/20 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-500 font-mono text-xs">{isEn ? "LOADING PROGRAMS..." : "CHARGEMENT DES PROGRAMMES..."}</p>
          </div>
        ) : (
          /* Cursus listings */
          <div className="space-y-6">
            {formations.map((f) => {
              const imageToUse = f.urlImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80";

              return (
                <Card
                  key={f.id}
                  variant="glass"
                  className="bg-slate-900/30 backdrop-blur-xl border border-white/5 p-0 hover:border-red-500/20 overflow-hidden text-left shadow-2xl transition-all duration-300 rounded-3xl"
                  hoverable={false}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Cover Image Part */}
                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-zinc-950">
                      <img
                        src={imageToUse}
                        alt={f.titre}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-red-600/90 text-white font-mono text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        {f.niveau}
                      </div>
                    </div>

                    {/* Content Info Part */}
                    <div className="md:w-2/3 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="font-mono text-[10px] text-blue-500 font-bold uppercase tracking-widest block">
                          {f.organisme}
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight">
                          {f.titre}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-zinc-400 pt-1">
                          <span className="flex items-center space-x-1.5 text-zinc-450">
                            <User className="w-4 h-4 text-red-500" />
                            <span>{isEn ? "Instructor:" : "Formateur :"} <strong className="text-zinc-200">{f.formateur}</strong></span>
                          </span>
                          <span className="flex items-center space-x-1.5 text-zinc-450">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>{isEn ? "Launches:" : "Lancement :"} <strong className="text-zinc-200">{f.dateDebut}</strong></span>
                          </span>
                          <span className="flex items-center space-x-1.5 text-zinc-450">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            <span>{isEn ? "Duration:" : "Durée :"} <strong className="text-zinc-200">{f.duree}</strong></span>
                          </span>
                          <span className="flex items-center space-x-1.5 text-zinc-450">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span>{isEn ? "Required Level:" : "Difficulté :"} <strong className="text-zinc-200">{f.niveau}</strong></span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="text-[11px] font-mono text-zinc-500">
                          {isEn ? "Official Infotronique Certificate and ESIH endorsement eligible" : "Certificat officiel et agréments ESIH inclus"}
                        </span>
                        <div>
                          {f.lienInscription ? (
                            <a
                              href={f.lienInscription}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center font-display gap-1 rounded-xl font-bold transition-colors focus:outline-none cursor-pointer border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 text-white hover:bg-zinc-900 px-4 py-2 text-xs tracking-wider uppercase"
                            >
                              <span>{isEn ? "Apply to program" : "S'inscrire au cursus"}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <Button variant="secondary" size="sm" onClick={() => setEnrollingFormation(f)} className="cursor-pointer font-bold uppercase tracking-wider text-xs">
                              {isEn ? "Apply to program" : "S'inscrire au cursus"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Dynamic Enrollment Registration Modal Overlay */}
        <AnimatePresence>
          {enrollingFormation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-md w-full bg-zinc-900 border border-zinc-805 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setEnrollingFormation(null)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white cursor-pointer z-50 animate-fade-in"
                >
                  <X className="w-4 h-4" />
                </button>

                {enrollSubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <UserCheck className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                    <h3 className="font-display text-lg font-bold text-white">
                      {isEn ? "Application Registered!" : "Demande enregistrée !"}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      {isEn 
                        ? `Your student application checks for ${enrollingFormation.titre} have been successfully logs registered. Administration will contact you shortly.`
                        : `Votre demande de candidature pour ${enrollingFormation.titre} a été enregistrée. L'administration prendra contact avec vous.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-1 text-left">
                      <span className="font-mono text-[10px] text-blue-500 uppercase tracking-widest">{enrollingFormation.niveau}</span>
                      <h3 className="font-display text-lg font-extrabold text-white">
                        {isEn ? "Student registration" : "Inscription d'étudiant"}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {isEn 
                          ? `Apply to the elite program ${enrollingFormation.titre}.`
                          : `Postulez au programme d'élite ${enrollingFormation.titre}.`}
                      </p>
                    </div>

                    <form onSubmit={handleEnrollSubmit} className="space-y-4 text-left">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                          {isEn ? "Full Name" : "Nom complet"}
                        </label>
                        <input
                          type="text"
                          required
                          value={studentInfo.name}
                          onChange={(e) => setStudentInfo((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder={isEn ? "Alexander Dessalines" : "Jean"}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                          {isEn ? "Email Address" : "Adresse Email"}
                        </label>
                        <input
                          type="email"
                          required
                          value={studentInfo.email}
                          onChange={(e) => setStudentInfo((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="client@mail.com"
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                          {isEn ? "Motivations (Why this curriculum?)" : "Motivations (Pourquoi ce cursus ?)"}
                        </label>
                        <textarea
                          rows={3}
                          value={studentInfo.motivation}
                          onChange={(e) => setStudentInfo((prev) => ({ ...prev, motivation: e.target.value }))}
                          placeholder={isEn 
                            ? "Describe your future career path or your current tech experience..."
                            : "Décrivez votre projet d'avenir ou votre bagage technique actuel..."}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 resize-none"
                        />
                      </div>

                      <Button type="submit" variant="secondary" size="sm" className="w-full mt-2 cursor-pointer font-bold uppercase tracking-wider text-xs">
                        {isEn ? "Submit my application" : "Soumettre mon dossier"}
                      </Button>
                    </form>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

