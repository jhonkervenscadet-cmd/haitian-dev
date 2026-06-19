import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, KeyRound, Briefcase, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";
// Firebase & Sync
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../utils/firebaseSync";

export const Signup: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const navigate = useNavigate();

  const [role, setRole] = useState<"Étudiant" | "Client">("Étudiant");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", company: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;
    if (role === "Client" && !formData.company) return;

    setIsLoading(true);

    try {
      // 1. Create account via Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Send email verification
      await sendEmailVerification(user);

      // 3. Save profile to Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        fullName: formData.name,
        email: formData.email,
        role: role,
        accessStatus: "Pending",
        companyName: role === "Client" ? formData.company : ""
      });

      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (e: any) {
      console.error("Signup error:", e);
      handleFirestoreError(e, OperationType.CREATE, "users");
      setIsLoading(false);
    }
  };

  return (
    <div className="py-24 bg-zinc-950 relative overflow-hidden dot-grid flex items-center justify-center min-h-[85vh]">
      <SEO
        title={isEn ? "Sign Up & Join the Academy — HaitianDev" : "Inscription & Reindre l'Académie — HaitianDev"}
        description={isEn 
          ? "Create your HaitianDev student or client account. Experience premium interactive systems and learn with elite software developers." 
          : "Créez votre compte HaitianDev (Étudiant ou Client) et accédez à nos programmes d'ingénierie logicielle d'élite."}
        schema={getOrganizationSchema()}
      />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-red-955/10 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full px-4 relative z-10 text-center">
        
        {/* Title area */}
        <div className="space-y-3 mb-10">
          <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-550 hover:text-white transition-colors">
            <span>{isEn ? "← Back to home" : "← Retour à l'accueil"}</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 mt-4 uppercase tracking-tight pb-1">
            {isEn ? "JOIN THE ELITE" : "REJOINDRE L'ÉLITE"}
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            {isEn 
              ? "Create an account to track the evolution of your technological development pipelines." 
              : "Créez un compte pour suivre l'évolution de vos pipelines de développement technologique."}
          </p>
        </div>

        {/* Signup Card */}
        <Card className="bg-zinc-900/20 border-zinc-900 p-8 sm:p-10 shadow-2xl glass-panel text-left" hoverable={false}>
          {success ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-display text-white font-bold text-lg text-center">
                {isEn ? "Your account has been forged!" : "Votre compte a été forgé !"}
              </h3>
              <p className="text-zinc-500 text-xs text-center">
                {isEn ? "Finalizing profile and redirecting..." : "Finalisation du profil et redirection..."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-5 text-left">
              
              {/* Role interactive selector - Added Étudiant vs Client toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold mb-1">
                  {isEn ? "Choose your profile" : "Choisissez votre profil"}
                </label>
                <div className="grid grid-cols-2 gap-3 pb-2">
                  <button
                    type="button"
                    onClick={() => setRole("Étudiant")}
                    className={`flex items-center justify-center space-x-2 py-3 rounded-xl border font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      role === "Étudiant"
                        ? "bg-gradient-to-r from-blue-600/15 via-red-600/10 to-red-600/20 border-red-500/50 text-white shadow-lg shadow-red-500/10"
                        : "bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{isEn ? "Student" : "Étudiant"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("Client")}
                    className={`flex items-center justify-center space-x-2 py-3 rounded-xl border font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      role === "Client"
                        ? "bg-gradient-to-r from-blue-600/15 via-red-600/10 to-red-600/20 border-red-500/50 text-white shadow-lg shadow-red-500/10"
                        : "bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>{isEn ? "Client" : "Client"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                  {isEn ? "Full Name" : "Nom Complet"}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={isEn ? "Alexander Dessalines" : "Toussaint Louverture"}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                  {isEn ? "Email Address" : "Adresse Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="client@mail.com"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Company field specifically shown ONLY for Client role */}
              <AnimatePresence initial={false}>
                {role === "Client" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden space-y-1.5"
                  >
                    <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                      {isEn ? "Company Name" : "Nom de l'entreprise"}
                    </label>
                    <div className="relative pb-1">
                      <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                      <input
                        type="text"
                        required={role === "Client"}
                        value={formData.company}
                        onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                        placeholder="Fintech Group S.A."
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                  {isEn ? "Password" : "Mot de Passe"}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={isLoading}
                className="w-full justify-center pt-2 cursor-pointer font-bold tracking-wider text-xs uppercase"
              >
                {isLoading 
                  ? (isEn ? "Registering profile..." : "Enregistrement...") 
                  : (isEn ? "Forge My Account" : "Créer mon espace")}
              </Button>

              <div className="text-center pt-4 border-t border-zinc-900/60 text-xs font-mono text-zinc-550">
                <span>
                  {isEn ? "Already registered?" : "Déjà membre ?"}{" "}
                  <Link to="/login" className="text-blue-500 hover:underline">
                    {isEn ? "Sign in" : "S'authentifier"}
                  </Link>
                </span>
              </div>

            </form>
          )}
        </Card>

      </div>
    </div>
  );
};
