import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { KeyRound, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";
// Firebase
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../utils/firebaseSync";

export const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Fetch user document
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        throw new Error("User profile not found.");
      }

      const userData = userDoc.data();

      // 3. Verify accessStatus
      if (userData.accessStatus !== "Active" && userData.accessStatus !== "Pending") {
          throw new Error(isEn ? "Account access is not active or is suspended." : "L'accès au compte n'est pas actif ou a été suspendu.");
      }

      // Login success
      localStorage.setItem("haitiandev_user", JSON.stringify({
        name: userData.fullName,
        email: userData.email,
        role: userData.role,
        company: userData.companyName || undefined
      }));
      window.dispatchEvent(new Event("haitian_popups_updated"));

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
        setIsLoading(false);
      }, 1500);

    } catch (e: any) {
      console.error("Login error:", e);
      setError(e.message || "Failed to login.");
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsLoading(true);
    setError(null);
    setResetMessage(null);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage(isEn ? "Reset email sent!" : "Email de réinitialisation envoyé !");
    } catch (e: any) {
      console.error("Reset error:", e);
      setError(e.message || "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-24 bg-zinc-950 relative overflow-hidden dot-grid flex items-center justify-center min-h-[85vh]">
      <SEO
        title={isEn ? "Login Space & Client Portal — HaitianDev" : "Espace Connexion & Portail Client — HaitianDev"}
        description={isEn 
          ? "Connect to your HaitianDev client dashboard to manage your ongoing software projects, training progress, and invoices." 
          : "Connectez-vous à votre portail HaitianDev pour suivre l'avancement de vos projets logiciels, formations tech et livrables."}
        schema={getOrganizationSchema()}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-955/10 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full px-4 relative z-10 text-center">
        
        {/* Logo and title */}
        <div className="space-y-3 mb-10">
          <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-550 hover:text-white transition-colors">
            <span>{isEn ? "← Back to home" : "← Retour à l'accueil"}</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 mt-4 uppercase tracking-tight pb-1">
            {isEn ? "MEMBER PORTAL" : "PORTAIL MEMBRE"}
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            {isEn 
              ? "Log in to track your technical briefs and elite support tickets." 
              : "Connectez-vous pour suivre vos cahiers des charges et vos tickets de support d'élites."}
          </p>
        </div>

        {/* Authentication Card */}
        <Card className="bg-zinc-900/20 border-zinc-900 p-8 sm:p-10 shadow-2xl glass-panel text-left" hoverable={false}>
          {success ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-display text-white font-bold text-lg">
                {isEn ? "Authentication approved" : "Authentification approuvée"}
              </h3>
              <p className="text-zinc-500 text-xs">
                {isEn ? "Redirecting to homepage..." : "Redirection vers l'accueil..."}
              </p>
            </div>
          ) : isForgotPasswordView ? (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <h3 className="text-lg font-display text-white font-bold text-center">
                {isEn ? "Reset Password" : "Réinitialiser mot de passe"}
              </h3>
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              {resetMessage && <p className="text-emerald-500 text-xs text-center">{resetMessage}</p>}
              
              <div className="space-y-1.5">
                 <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                  {isEn ? "Email Address" : "Adresse Email"}
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="client@mail.com"
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500/50 transition-all"
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                disabled={isLoading}
                className="w-full justify-center pt-2 cursor-pointer font-bold tracking-wider text-xs uppercase"
              >
                {isLoading ? (isEn ? "Sending..." : "Envoi...") : (isEn ? "Send Reset Email" : "Envoyer email")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsForgotPasswordView(false)}
                className="w-full justify-center text-xs text-zinc-500 hover:text-white"
              >
                {isEn ? "Back to Login" : "Retour à connexion"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              
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

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                    {isEn ? "Password" : "Mot de Passe"}
                  </label>
                  <span 
                    onClick={() => setIsForgotPasswordView(true)}
                    className="text-[10px] font-mono text-zinc-650 hover:text-white cursor-pointer select-none">
                    {isEn ? "Forgot?" : "Oublié ?"}
                  </span>
                </div>
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
                  ? (isEn ? "Authenticating..." : "Authentification...") 
                  : (isEn ? "Access My Dashboard" : "Accéder à mon espace")}
              </Button>

              <div className="text-center pt-4 border-t border-zinc-900/60 flex items-center justify-between text-xs font-mono text-zinc-550">
                <span>
                  {isEn ? "No account?" : "Pas de compte ?"}{" "}
                  <Link to="/signup" className="text-blue-500 hover:underline">
                    {isEn ? "Sign up" : "S'inscrire"}
                  </Link>
                </span>
                <Link to="/admin-login" className="text-zinc-600 hover:text-white transition-colors">
                  {isEn ? "Staff Terminal" : "Portail Staff"}
                </Link>
              </div>

            </form>
          )}
        </Card>

      </div>
    </div>
  );
};
