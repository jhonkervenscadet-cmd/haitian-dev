import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Mail, KeyRound, Terminal, RefreshCw, Layers, CheckCircle2, ChevronRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../lib/firebase";
import { hashPassword } from "../utils/hash";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect if already authenticated
  useEffect(() => {
    const session = localStorage.getItem("haitiandev_admin_session");
    if (session) {
      setIsAuthenticated(true);
      setTimeout(() => navigate("/admin"), 500);
    }
  }, [navigate]);

  // Simulated metrics inside Admin panel
  const [nodes, setNodes] = useState([
    { name: "MonCash API Proxy Gateway", status: "ONLINE", speed: "23ms" },
    { name: "Kreyòl Voice-to-Text Transcription", status: "ONLINE", speed: "114ms" },
    { name: "Sankofa CMS Core Engine", status: "OFFLINE", speed: "N/A" },
    { name: "EduKreyòl Static Asset Bundle", status: "ONLINE", speed: "8ms" }
  ]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoading(true);
    setError(null);
    try {
      const emailObj = formData.email.trim().toLowerCase();
      const passwordObj = formData.password.trim();
      const hashedInput = await hashPassword(passwordObj);

      let isFirebaseAuthenticated = false;

      // Primary: Try Firebase Authentication
      try {
        await signInWithEmailAndPassword(auth, emailObj, passwordObj);
        isFirebaseAuthenticated = true;
      } catch (authErr) {
        console.warn("Firebase Auth failed, checking custom admins1 collection:", authErr);
      }

      let matchedAdmin = null;
      
      // Secondary: Try custom admins1 collection
      try {
        const adminQ = query(collection(db, "admins1"), where("email", "==", emailObj));
        const allAdminsSnapshot = await getDocs(adminQ);
        allAdminsSnapshot.forEach(doc => {
          const data = doc.data();
          const dbPassword = String(data.password || "").trim();
          
          if (dbPassword === passwordObj || dbPassword === hashedInput) {
            matchedAdmin = data;
          }
        });
      } catch(dbErr) {
         console.warn("Failed to check admins1 collection", dbErr);
      }
      
      if (!isFirebaseAuthenticated && matchedAdmin) {
         // Auto-provision Firebase Auth account to ensure Firestore rules work
         try {
            const userCred = await createUserWithEmailAndPassword(auth, emailObj, passwordObj);
            await setDoc(doc(db, "users", userCred.user.uid), {
               email: emailObj,
               role: "Admin",
               name: matchedAdmin.name || "Admin",
               createdAt: new Date().toISOString()
            });
            isFirebaseAuthenticated = true;
         } catch (createErr: any) {
            console.warn("Failed to auto-provision Firebase Auth user:", createErr);
         }
      }
      
      if (isFirebaseAuthenticated || matchedAdmin) {
        // Persist session
        const adminSession = {
          email: emailObj,
          loginTime: new Date().toISOString(),
          role: "Admin"
        };
        localStorage.setItem("haitiandev_admin_session", JSON.stringify(adminSession));
        setIsAuthenticated(true);
        
        setTimeout(() => navigate("/admin"), 1000);
      } else {
        setError(isEn ? "Invalid credentials." : "Identifiants invalides.");
      }
    } catch (e: any) {
      console.error(e);
      setError(isEn ? "An error occurred." : "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNode = (idx: number) => {
    setNodes((prev) =>
      prev.map((node, i) =>
        i === idx ? { ...node, status: node.status === "ONLINE" ? "OFFLINE" : "ONLINE" } : node
      )
    );
  };

  const getTranslatedNodeName = (name: string) => {
    if (!isEn) return name;
    if (name.includes("MonCash")) return "MonCash API Proxy Gateway";
    if (name.includes("Transcription")) return "Kreyòl Voice Speech NLP Model";
    if (name.includes("Sankofa")) return "Sankofa CMS Core Engine Node";
    if (name.includes("EduKreyòl")) return "EduKreyòl Static Asset Bundlers";
    return name;
  };

  return (
    <div className="py-20 bg-zinc-950 relative overflow-hidden dot-grid flex items-center justify-center min-h-[90vh]">
      <SEO
        title={isEn ? "Secure Staff Terminal — HaitianDev" : "Portail de Sécurité Staff — HaitianDev"}
        description={isEn 
          ? "Connect to your administrative panels secure gateways to configure real-time project schedules, grades, and static site indexes." 
          : "Connectez-vous à la passerelle d'administration sécurisée de HaitianDev pour administrer les ressources logicielles rattachées."}
        schema={getOrganizationSchema()}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-red-955/5 blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full px-4 relative z-10 text-center">

        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            /* SECURE PORTAL LOGIN */
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-md mx-auto space-y-8"
            >
              <div className="space-y-3">
                <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-550 hover:text-white transition-colors">
                  <span>{isEn ? "← Back" : "← Retour"}</span>
                </Link>
                <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-500 rounded-full w-max mx-auto mt-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 uppercase tracking-tight pb-1">
                  {isEn ? "STAFF GATEWAY" : "PORTAIL INFRASTRUCTURE"}
                </h1>
                <p className="text-zinc-500 text-xs sm:text-sm">
                  {isEn 
                    ? "Secured area for administration, system diagnostics, and server integrations." 
                    : "Section réservée d'administration technique d'Haitian Dev et diagnostic d'infrastructure."}
                </p>
              </div>

              <Card className="bg-zinc-900/15 border-zinc-902 p-8 sm:p-10 shadow-2xl glass-panel text-left animate-pulse" hoverable={false}>
                <form onSubmit={handleAdminSubmit} className="space-y-5">
                  {error && <p className="text-red-500 text-xs text-center font-bold font-mono">{error}</p>}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                      {isEn ? "Admin Email" : "Email Administrateur"}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-650" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="admin@haitiandev.org"
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-105 placeholder-zinc-700 font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                      {isEn ? "Master Password" : "Mot de passe Maître"}
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-zinc-650" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••••••••"
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-105 placeholder-zinc-700 font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    size="md"
                    disabled={isLoading}
                    className="w-full justify-center text-red-500 border-red-950 hover:bg-red-950/10 hover:border-red-500 pt-2 cursor-pointer font-bold uppercase tracking-wider text-xs"
                  >
                    {isLoading 
                      ? (isEn ? "Cryptographic verification..." : "Vérification cryptographique...") 
                      : (isEn ? "Initiate Staff Connection" : "Forcer l'authentification")}
                  </Button>
                </form>
              </Card>
            </motion.div>
          ) : (
            /* SUCCESSFUL COGNITIVE ADMIN DASHBOARD */
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8 text-left"
            >
              {/* Top stats info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-6 gap-4">
                <div>
                  <span className="font-mono text-xs text-red-500 uppercase tracking-widest font-bold">
                    {isEn ? "Technical Administration Board" : "Panneau d'Administration"}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    {isEn ? "Engineering Diagnostics" : "Diagnostics d'Ingénierie"}
                  </h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)} className="cursor-pointer">
                  {isEn ? "Close Session" : "Fermer la session"}
                </Button>
              </div>

              {/* Grid indices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-zinc-400">
                <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                  <span className="text-zinc-600 block">{isEn ? "TOTAL SUBMITTED BRIEFS" : "TOTAL DOSSIERS SOUMIS"}</span>
                  <strong className="text-xl text-white font-bold block pt-1">
                    {isEn ? "114 Briefs" : "114 Dossiers"}
                  </strong>
                </div>
                <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                  <span className="text-zinc-600 block">{isEn ? "ACTIVE STUDENTS CHOSEN" : "ÉLÈVES SÉLECTIONNÉS"}</span>
                  <strong className="text-xl text-white font-bold block pt-1">
                    {isEn ? "48 Students" : "48 Élèves"}
                  </strong>
                </div>
                <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                  <span className="text-zinc-600 block">{isEn ? "SYSTEM STATUS REPORT" : "ÉTAT DU SYSTÈME EN DIRECT"}</span>
                  <strong className="text-xl text-emerald-500 font-bold block pt-1">
                    {isEn ? "INTEGRATIONS FUNCTIONAL" : "INTÉGRATIONS OPÉRATIONNELLES"}
                  </strong>
                </div>
              </div>

              {/* Pipeline nodes */}
              <div className="space-y-4 pt-4">
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block font-bold">
                  {isEn ? "Real-time synchronization states of technical bricks" : "État de synchronisation des briques techniques"}
                </span>
                
                <div className="space-y-3">
                  {nodes.map((node, nIdx) => (
                    <div
                      key={nIdx}
                      className="p-4 rounded-xl border border-zinc-900 bg-zinc-950 flex items-center justify-between transition-colors uppercase font-mono text-xs hover:border-zinc-800"
                    >
                      <div className="flex items-center space-x-3">
                        <Terminal className="w-4 h-4 text-zinc-650" />
                        <span className="text-zinc-300 font-bold">{getTranslatedNodeName(node.name)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="text-zinc-600 text-[10px]">{node.speed}</span>
                        <div
                          onClick={() => toggleNode(nIdx)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer select-none transition-all ${
                            node.status === "ONLINE"
                              ? "bg-emerald-950 border border-emerald-900 text-emerald-400"
                              : "bg-red-950 border border-red-900 text-red-400"
                          }`}
                        >
                          {node.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
