import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, MessageSquare, CreditCard, FileText, Settings, LogOut, Plus, ChevronRight, Activity, Clock, Server, Home, UserCheck, Search, Loader2, Key, ExternalLink, Eye, EyeOff, Copy, Check, Lock, ShieldCheck } from "lucide-react";
import { db, isFirebaseEnabled, auth, storage } from "../lib/firebase";
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, addDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { handleFirestoreError, OperationType } from "../utils/firebaseSync";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const TABS = [
  { id: "projects", label: "Mes Projets", icon: Briefcase },
  { id: "cms-access", label: "Codes Accès E-CMS", icon: Key },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "billing", label: "Facturation", icon: CreditCard },
  { id: "settings", label: "Paramètres", icon: Settings },
];

const PROJECTS = [
  {
    id: "demo1",
    name: "Application Mobile E-Commerce",
    status: "En Développement",
    progress: 75,
    lastUpdate: "Il y a 2 heures",
    tech: ["React Native", "Firebase", "Node.js"],
    adminLink: "https://admin-ecommerce-haiti.haitiandev.com",
    credentials: {
      username: "admin_commerce_haiti",
      passCode: "HT_Ecom_Secured_2026",
      apiToken: "hd_live_77a11e89ceea0012",
      dbUri: "postgresql://ecom_haiti:*****@db.haitiandev.com/prod"
    }
  },
  {
    id: "demo2",
    name: "Refonte Site Vitrine Corporate",
    status: "Maintenance",
    progress: 100,
    lastUpdate: "Le 14 Juin 2024",
    tech: ["Next.js", "Tailwind", "Sanity CMS"],
    adminLink: "https://corporate-haiti.haitiandev.com/admin",
    credentials: {
      username: "editor_corp_haiti",
      passCode: "HT_Corp_Classic_92A",
      apiToken: "hd_live_da21034f0092ac91",
      dbUri: "mongodb+srv://corp_haiti_db:*****@cluster0.sanity.io"
    }
  }
];

interface ClientInvoiceCardProps {
  inv: any;
  db: any;
  storage: any;
  isFirebaseEnabled: boolean;
  clientInfo: any;
}

const ClientInvoiceCard: React.FC<ClientInvoiceCardProps> = ({ inv, db, storage, isFirebaseEnabled, clientInfo }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      let downloadURL = "";

      if (isFirebaseEnabled && db && storage) {
        // Upload to Firebase Storage
        const fileRef = ref(storage, `invoice_proofs/${inv.id}_${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        downloadURL = await getDownloadURL(fileRef);

        // Update Firestore
        const invRef = doc(db, "invoices", inv.id);
        await updateDoc(invRef, {
          file: downloadURL,
          status: "En attente de vérification"
        });
      } else {
        // LocalStorage mock fallback
        const getBase64 = (f: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(f);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = err => reject(err);
          });
        };
        const base64 = await getBase64(file);
        downloadURL = base64;

        const savedInvoicesRaw = localStorage.getItem("haitiandev_invoices_local");
        if (savedInvoicesRaw) {
          const cached = (function(val){ try { return JSON.parse(val); } catch(e) { return null; } })(savedInvoicesRaw);
          const index = cached.findIndex((i: any) => i.id === inv.id);
          if (index >= 0) {
            cached[index].file = downloadURL;
            cached[index].status = "En attente de vérification";
            localStorage.setItem("haitiandev_invoices_local", JSON.stringify(cached));
          }
        }
      }

      setSuccess("Preuve de paiement soumise avec succès ! Nos administrateurs vont la vérifier sous peu.");
      window.dispatchEvent(new Event("haitian_invoices_updated"));
    } catch (err: any) {
      console.error("Error uploading payment proof:", err);
      setError("Erreur lors du téléversement. Veuillez réessayer.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        setError("Veuillez sélectionner une image (JPG, PNG) ou un fichier PDF.");
        return;
      }
      await handleUpload(file);
    }
  };

  const isNatType = inv.paymentMethod === "Natcash" || inv.paymentMethod === "Moncash";

  return (
    <div className="bg-[#0c0c12] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-all space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-bold text-white tracking-tight">{inv.projectName}</h4>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Service • {inv.paymentMethod}</span>
        </div>
        <div className="text-right sm:text-right">
          <span className="text-lg font-bold text-blue-400 font-mono">{inv.amount}</span>
          <div className="text-[10px] text-[#00E5FF] font-mono mt-0.5">Status: {inv.status || "En attente de paiement"}</div>
        </div>
      </div>

      <div className="text-sm text-zinc-400 font-sans border-t border-white/5 pt-4 space-y-2">
        <p className="flex justify-between">
          <span className="text-zinc-500">Client:</span>
          <span className="text-zinc-300 font-medium">{inv.clientName || clientInfo?.name || "Client de HaitianDev"}</span>
        </p>

        {inv.paymentLink && (
          <p className="flex justify-between items-center">
            <span className="text-zinc-500">Lien Direct:</span>
            <a href={inv.paymentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5" /> Payer via le portail
            </a>
          </p>
        )}
      </div>

      {isNatType && (
        <div className="mt-4 p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 space-y-3">
          <h5 className="text-[11px] font-bold text-white uppercase tracking-widest text-[#00E5FF]">Instructions pour {inv.paymentMethod}</h5>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans mt-1">
            Faites le transfert de <span className="text-white font-mono font-bold">{inv.amount}</span> vers notre compte {inv.paymentMethod} au numéro :
            <br />
            <span className="text-red-400 font-mono font-bold tracking-wider text-sm mt-1 inline-block">
              {inv.paymentMethod === "Natcash" ? "+509 42 42 66 39" : "+509 42 42 66 39"}
            </span>
            <br />
            <span className="text-zinc-400 font-sans text-[11px]">
              Nom du compte: <strong className="text-zinc-200">Cadet John Kervensley</strong>
            </span>
          </p>

          <div className="mt-4 pt-2">
            {inv.status !== "Payé" && inv.status !== "En attente de vérification" ? (
              <button
                onClick={async () => {
                  setUploading(true);
                  setError(null);
                  setSuccess(null);
                  try {
                    if (isFirebaseEnabled && db) {
                      const invRef = doc(db, "invoices", inv.id);
                      await updateDoc(invRef, {
                        status: "En attente de vérification"
                      });
                    } else {
                      const savedInvoicesRaw = localStorage.getItem("haitiandev_invoices_local");
                      if (savedInvoicesRaw) {
                        const cached = (function(val){ try { return JSON.parse(val); } catch(e) { return null; } })(savedInvoicesRaw);
                        const index = cached.findIndex((i: any) => i.id === inv.id);
                        if (index >= 0) {
                          cached[index].status = "En attente de vérification";
                          localStorage.setItem("haitiandev_invoices_local", JSON.stringify(cached));
                        }
                      }
                    }
                    setSuccess("Notification de paiement enregistrée ! Nos administrateurs vont vérifier le transfert.");
                    window.dispatchEvent(new Event("haitian_invoices_updated"));
                  } catch (err: any) {
                    console.error("Error confirming payment:", err);
                    setError("Erreur lors de la confirmation. Veuillez réessayer.");
                  } finally {
                    setUploading(false);
                  }
                }}
                disabled={uploading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-2 border border-blue-500/30"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Confirmation en cours...
                  </>
                ) : (
                  "J'ai effectué le paiement / transfert"
                )}
              </button>
            ) : inv.status === "En attente de vérification" ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-xs font-sans">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Paiement en cours de vérification par un administrateur.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-blue-400 bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-xs font-sans">
                <Check className="w-4 h-4 text-blue-400" />
                <span>Facture réglée avec succès. Merci pour votre confiance !</span>
              </div>
            )}

            {error && (
              <p className="text-[10px] text-red-500 font-mono mt-2 flex items-center gap-1">
                <span>⚠</span> {error}
              </p>
            )}

            {success && (
              <p className="text-[10px] text-emerald-400 font-mono mt-2">
                ✓ {success}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const ClientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const navigate = useNavigate();

  // Project access control and visibility states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [projectsSubView, setProjectsSubView] = useState<"tracking" | "credentials">("tracking");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Project Access states
  const [projectAccesses, setProjectAccesses] = useState<any[]>([]);
  const [accessesLoading, setAccessesLoading] = useState(true);

  // User details (retrieved from localStorage if logged in, falling back to demo state)
  // Auth state tracking
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
    } catch(e) {}
    localStorage.removeItem("haitiandev_user");
    navigate('/login');
  };

  const clientInfo = useMemo(() => {
    const savedUserRaw = localStorage.getItem("haitiandev_user");
    const savedUser = savedUserRaw ? (function(val){ try { return JSON.parse(val); } catch(e) { return null; } })(savedUserRaw) : null;
    return {
      name: userProfile?.fullName || firebaseUser?.displayName || savedUser?.name || "Haiti Innovate",
      email: firebaseUser?.email || savedUser?.email || "contact@haiti-innovate.ht"
    };
  }, [firebaseUser, userProfile]);

  const [seenMap, setSeenMap] = useState<Record<string, string[]>>({});

  // Synchronize seen status with Firestore data loading and tab changes
  useEffect(() => {
    const syncTabSeen = (tabId: string, currentList: any[], storageKey: string) => {
      const currentIds = currentList.map(item => String(item.id));
      const raw = localStorage.getItem(storageKey);
      
      if (raw === null) {
        // First run initialization: think of all current items as already read
        localStorage.setItem(storageKey, JSON.stringify(currentIds));
        setSeenMap(prev => {
          if (JSON.stringify(prev[tabId]) !== JSON.stringify(currentIds)) {
            return { ...prev, [tabId]: currentIds };
          }
          return prev;
        });
        return;
      }

      try {
        const storedSeenIds = (function(val){ try { return JSON.parse(val); } catch(e) { return []; } })(raw) as string[];
        
        // If the tab is currently active, mark all items as seen immediately
        if (activeTab === tabId) {
          const newSeen = Array.from(new Set([...storedSeenIds, ...currentIds]));
          localStorage.setItem(storageKey, JSON.stringify(newSeen));
          setSeenMap(prev => {
            if (JSON.stringify(prev[tabId]) !== JSON.stringify(newSeen)) {
              return { ...prev, [tabId]: newSeen };
            }
            return prev;
          });
        } else {
          // If not active tab, just read what's in local storage
          setSeenMap(prev => {
            if (JSON.stringify(prev[tabId]) !== JSON.stringify(storedSeenIds)) {
              return { ...prev, [tabId]: storedSeenIds };
            }
            return prev;
          });
        }
      } catch (e) {
        // Fallback
        setSeenMap(prev => {
          if (JSON.stringify(prev[tabId]) !== JSON.stringify([])) {
            return { ...prev, [tabId]: [] };
          }
          return prev;
        });
      }
    };

    syncTabSeen("projects", projects, "haitiandev_seen_projects");
    syncTabSeen("cms-access", projectAccesses, "haitiandev_seen_cms_access");
    syncTabSeen("messages", messages, "haitiandev_seen_messages");
    syncTabSeen("billing", invoices, "haitiandev_seen_billing");
  }, [activeTab, projects, projectAccesses, messages, invoices]);

  // Notification badge calculation of unseen elements per tab
  const unseenCounts = useMemo(() => {
    const getCount = (tabId: string, currentList: any[]) => {
      const seenIds = seenMap[tabId] || [];
      const unseen = currentList.filter(item => !seenIds.includes(String(item.id)));
      return unseen.length;
    };

    return {
      projects: getCount("projects", projects),
      "cms-access": getCount("cms-access", projectAccesses),
      messages: getCount("messages", messages),
      billing: getCount("billing", invoices),
      settings: 0
    };
  }, [seenMap, projects, projectAccesses, messages, invoices]);

  // Settings states
  const [editName, setEditName] = useState("");
  const [editProfilePicture, setEditProfilePicture] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState({ text: "", type: "" }); // { text, type: "success" | "error" }

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
      // Offline fallback
      const savedUserRaw = localStorage.getItem("haitiandev_user");
      if (savedUserRaw) {
        const savedUser = (function(val){ try { return JSON.parse(val); } catch(e) { return {}; } })(savedUserRaw);
        setUserProfile({
          fullName: savedUser.name || "Haiti Innovate",
          profilePicture: savedUser.profilePicture || "",
          email: savedUser.email || "contact@haiti-innovate.ht"
        });
        setEditName(savedUser.name || "");
      }
      setIsAuthInitialized(true);
      setProfileLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setIsAuthInitialized(true);
      
      if (user && db) {
        setProfileLoading(true);
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile(data);
            setEditName(data.fullName || user.displayName || "");
          } else {
            setEditName(user.displayName || "");
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setEditName(user.displayName || "");
        } finally {
          setProfileLoading(false);
        }
      } else {
        // Simulated local storage user session
        const savedUserRaw = localStorage.getItem("haitiandev_user");
        if (savedUserRaw) {
          const savedUser = (function(val){ try { return JSON.parse(val); } catch(e) { return {}; } })(savedUserRaw);
          setUserProfile({
            fullName: savedUser.name || "Haiti Innovate",
            profilePicture: savedUser.profilePicture || "",
            email: savedUser.email || "contact@haiti-innovate.ht"
          });
          setEditName(savedUser.name || "");
        }
        setProfileLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setProfileUpdateLoading(true);
    setSettingsMessage({ text: "", type: "" });
    
    try {
      const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      let photoURL = userProfile?.profilePicture || firebaseUser?.photoURL || "";

      if (editProfilePicture) {
        try {
          const base64Data = await getBase64(editProfilePicture);
          photoURL = base64Data;
          
          if (firebaseUser && storage) {
            try {
              const storageRef = ref(storage, `users/${firebaseUser.uid}/profile.jpg`);
              await uploadBytes(storageRef, editProfilePicture);
              const downloadURL = await getDownloadURL(storageRef);
              photoURL = downloadURL;
            } catch (storageErr) {
              console.warn("Storage upload failed (possibly unconfigured rules), using Base64:", storageErr);
            }
          }
        } catch (readErr) {
          console.error("Error reading file:", readErr);
        }
      }

      if (firebaseUser && db) {
        // Real user updates
        if (auth) {
          try {
            await updateProfile(firebaseUser, { displayName: editName, photoURL: photoURL });
          } catch (profileErr) {
            console.warn("Failed to update auth profile display name:", profileErr);
          }
        }
        
        const userRef = doc(db, "users", firebaseUser.uid);
        await setDoc(userRef, {
          fullName: editName,
          profilePicture: photoURL,
          email: firebaseUser.email || ""
        }, { merge: true });
        
        setUserProfile(prev => ({ 
          ...prev, 
          fullName: editName, 
          profilePicture: photoURL, 
          email: firebaseUser.email || prev?.email || "" 
        }));
      }

      // Sync with LocalStorage for both simulated and real users
      const savedUserRaw = localStorage.getItem("haitiandev_user");
      if (savedUserRaw) {
        const savedUser = (function(val){ try { return JSON.parse(val); } catch(e) { return {}; } })(savedUserRaw);
        savedUser.name = editName;
        if (photoURL) {
          savedUser.profilePicture = photoURL;
        }
        localStorage.setItem("haitiandev_user", JSON.stringify(savedUser));
        
        if (!firebaseUser) {
          // If mock session, update the state directly
          setUserProfile(prev => ({
            ...prev,
            fullName: editName,
            profilePicture: photoURL,
            email: savedUser.email || ""
          }));
        }
      } else {
        localStorage.setItem("haitiandev_user", JSON.stringify({
          name: editName,
          email: firebaseUser?.email || "contact@haiti-innovate.ht",
          profilePicture: photoURL,
          role: "Client"
        }));
      }

      // Notify Navbar and entire layout to apply the changes
      window.dispatchEvent(new Event("haitian_popups_updated"));
      setSettingsMessage({ text: "Profil mis à jour avec succès !", type: "success" });
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setSettingsMessage({ text: `Erreur: ${err.message}`, type: "error" });
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  const handleSendPasswordResetEmail = async () => {
    if (!firebaseUser?.email || !auth) {
      setSettingsMessage({ text: "Erreur: Utilisateur non authentifié ou email manquant.", type: "error" });
      return;
    }
    
    setPasswordUpdateLoading(true);
    setSettingsMessage({ text: "", type: "" });
    try {
      await sendPasswordResetEmail(auth, firebaseUser.email);
      setSettingsMessage({ text: "Un email de réinitialisation a été envoyé à votre adresse.", type: "success" });
    } catch (err: any) {
      console.error("Error sending password reset email:", err);
      setSettingsMessage({ text: `Erreur: ${err.message}`, type: "error" });
    } finally {
      setPasswordUpdateLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      setSettingsMessage({ text: "Les nouveaux mots de passe ne correspondent pas.", type: "error" });
      return;
    }
    
    if (newPassword.length < 6) {
      setSettingsMessage({ text: "Le nouveau mot de passe doit contenir au moins 6 caractères.", type: "error" });
      return;
    }

    setPasswordUpdateLoading(true);
    setSettingsMessage({ text: "", type: "" });
    
    try {
      if (firebaseUser && auth) {
        // Real user change password
        const credential = EmailAuthProvider.credential(firebaseUser.email!, currentPassword);
        await reauthenticateWithCredential(firebaseUser, credential);
        await updatePassword(firebaseUser, newPassword);
        
        if (db) {
          const userRef = doc(db, "users", firebaseUser.uid);
          await setDoc(userRef, {
            password: newPassword
          }, { merge: true });
        }
      } else {
        // Simulated mock user session password update
        console.info("Simulating password change for offline/local storage user...");
        const savedUserRaw = localStorage.getItem("haitiandev_user");
        if (savedUserRaw) {
          const savedUser = (function(val){ try { return JSON.parse(val); } catch(e) { return {}; } })(savedUserRaw);
          savedUser.password = newPassword;
          localStorage.setItem("haitiandev_user", JSON.stringify(savedUser));
        }
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSettingsMessage({ text: "Mot de passe mis à jour avec succès !", type: "success" });
    } catch (err: any) {
      console.error("Error updating password:", err);
      let errorMsg = err.message;
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errorMsg = "L'ancien mot de passe est incorrect.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "Le nouveau mot de passe est trop faible (6 caractères minimum).";
      }
      setSettingsMessage({ text: `Erreur: ${errorMsg}`, type: "error" });
    } finally {
      setPasswordUpdateLoading(false);
    }
  };

  // Sync client credentials / access projects from Firestore based on client email
  useEffect(() => {
    if (!isAuthInitialized) {
      return;
    }

    if (!isFirebaseEnabled || !db) {
      setProjectAccesses([]);
      setAccessesLoading(false);
      return;
    }

    // Load mock database list from LocalStorage for unauthenticated simulation sessions
    const loadLocalFallback = () => {
      const rawLocal = localStorage.getItem("haitiandev_acces_projets");
      let localAccesses: any[] = [];
      if (rawLocal) {
        try {
          const parsed = (function(val){ try { return JSON.parse(val); } catch(e) { return []; } })(rawLocal);
          if (Array.isArray(parsed)) {
            localAccesses = parsed
              .filter((item: any) => item && item.clientEmail === clientInfo.email)
              .map((docData: any) => ({
                id: docData.id || `local-${Math.random()}`,
                name: docData.projectName || "Projet Sans Nom",
                projectName: docData.projectName || "Projet Sans Nom",
                clientName: docData.clientName || "",
                clientEmail: docData.clientEmail || "",
                status: "Actif / Hébergé",
                progress: 100,
                tech: ["CMS d'élite", "Vite", "Node.js"],
                lastUpdate: "Accès configuré",
                adminLink: docData.adminLink || "",
                credentials: {
                  username: docData.username || "",
                  passCode: docData.password || docData.passCode || "",
                  apiToken: docData.apiToken || "",
                  dbUri: docData.dbUri || ""
                }
              }));
          }
        } catch (e) {
          console.warn("Failed parsing local acces_projets storage", e);
        }
      }
      setProjectAccesses(localAccesses);
      setAccessesLoading(false);
    };

    // If there is no authenticated user (simulation / testing), use fallback directly to prevent firestore rule block
    if (!firebaseUser) {
      loadLocalFallback();
      return;
    }

    const q = query(
      collection(db, "acces_projets"),
      where("clientEmail", "==", clientInfo.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAccesses = snapshot.docs.map(doc => {
        const docData = doc.data() as any;
        return {
          id: doc.id,
          name: docData.projectName || "Projet Sans Nom",
          projectName: docData.projectName || "Projet Sans Nom",
          clientName: docData.clientName || "",
          clientEmail: docData.clientEmail || "",
          status: "Actif / Hébergé",
          progress: 100,
          tech: ["CMS d'élite", "Vite", "Node.js"],
          lastUpdate: "Accès configuré",
          adminLink: docData.adminLink || "",
          credentials: {
            username: docData.username || "",
            passCode: docData.password || "",
            apiToken: docData.apiToken || "",
            dbUri: docData.dbUri || ""
          }
        };
      });
      setProjectAccesses(fetchedAccesses);
      setAccessesLoading(false);
    }, (error) => {
      console.warn("Error fetching project accesses from Firestore:", error);
      loadLocalFallback();
      handleFirestoreError(error, OperationType.LIST, "acces_projets");
    });

    return () => unsubscribe();
  }, [clientInfo.email, isAuthInitialized, firebaseUser]);

  useEffect(() => {
    if (!isAuthInitialized) {
      return;
    }

    if (!isFirebaseEnabled || !db) {
      setProjects([]);
      setLoading(false);
      return;
    }

    const loadLocalDevisFallback = () => {
      const rawLocal = localStorage.getItem("haitian_dev_devis");
      let localDevis: any[] = [];
      if (rawLocal) {
        try {
          const parsed = (function(val){ try { return JSON.parse(val); } catch(e) { return []; } })(rawLocal);
          if (Array.isArray(parsed)) {
            localDevis = parsed
              .filter((item: any) => item && (item.email === clientInfo.email || item.clientEmail === clientInfo.email))
              .map((docData: any) => {
                const dummyId = docData.id || `local-devis-${Math.random()}`;
                const shortId = dummyId.slice(-5);
                return {
                  id: dummyId,
                  name: docData.serviceType || "Projet Custom",
                  status: docData.status || "Nouveau / En attente",
                  progress: docData.status === "Accepté / Validé" ? 100 : 
                            docData.status === "Chiffrage / Proposition Prête" ? 50 : 25,
                  tech: docData.serviceType ? [docData.serviceType, "Firebase", "TailwindCSS"] : ["Next.js", "App Web Security"],
                  lastUpdate: "Soumission locale",
                  createdAt: docData.createdAt || new Date().toISOString(),
                  adminLink: `https://admin-${shortId}.haitiandev.com`,
                  credentials: {
                    username: `admin_haitian_${shortId}`,
                    passCode: `HT_Secured_${shortId}`,
                    apiToken: `hd_live_local_${shortId}`,
                    dbUri: `postgresql://db_client_local_haiti:*****@db.haitiandev.com/production`
                  }
                };
              });
          }
        } catch (e) {
          console.warn("Failed parsing local devis storage", e);
        }
      }
      setProjects(localDevis);
      setLoading(false);
    };

    if (!firebaseUser) {
      loadLocalDevisFallback();
      return;
    }

    // Subscribing without sorting to avoid composite index requirements
    const q = query(
      collection(db, "devis"),
      where("clientName", "==", clientInfo.name),
      where("email", "==", clientInfo.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProjects = snapshot.docs.map(doc => {
        const docData = doc.data() as any;
        const shortId = doc.id.slice(0, 5).toLowerCase();
        return {
          id: doc.id,
          name: docData.serviceType || "Projet Custom",
          status: docData.status || "En cours",
          progress: docData.status === "Accepté / Validé" ? 100 : 
                    docData.status === "Chiffrage / Proposition Prête" ? 50 : 25,
          tech: docData.serviceType ? [docData.serviceType, "Firebase", "TailwindCSS"] : ["Next.js", "App Web Security"],
          lastUpdate: "Récemment synchronisé",
          createdAt: docData.createdAt || "",
          adminLink: `https://admin-${shortId}.haitiandev.com`,
          credentials: {
            username: `admin_haitian_${shortId}`,
            passCode: `HT_Secured_${doc.id.slice(-5) || "2026_Ok"}`,
            apiToken: `hd_live_${doc.id.slice(0, 8) || "8f3c77a1"}${doc.id.slice(-4) || "eec"}`,
            dbUri: `postgresql://db_client_${shortId}_haiti:*****@db.haitiandev.com/production`
          }
        };
      });

      // Sort in-memory by createdAt descending
      fetchedProjects.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      setProjects(fetchedProjects);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      loadLocalDevisFallback();
      handleFirestoreError(error, OperationType.LIST, "devis");
    });

    return () => unsubscribe();
  }, [clientInfo.email, clientInfo.name, isAuthInitialized, firebaseUser]);

  // Sync messages from Firestore filtered by client email
  useEffect(() => {
    if (!isFirebaseEnabled || !db) {
      setMessagesLoading(false);
      return;
    }

    const q = query(
      collection(db, "messages"),
      where("recipientEmail", "==", clientInfo.email)
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
      setMessagesLoading(false);
      handleFirestoreError(error, OperationType.LIST, "messages");
    });

    return () => unsubscribe();
  }, [clientInfo.email]);

  // Fetch invoices for the client
  useEffect(() => {
    const fetchInvoicesLocal = () => {
      const savedInvoicesRaw = localStorage.getItem("haitiandev_invoices_local");
      if (savedInvoicesRaw) {
        const cached = (function(val){ try { return JSON.parse(val); } catch(e) { return null; } })(savedInvoicesRaw);
        const filtered = cached.filter((inv: any) => inv && inv.email === clientInfo.email);
        setInvoices(filtered);
      }
    };

    if (!isFirebaseEnabled || !db) {
      fetchInvoicesLocal();
      setInvoicesLoading(false);
      window.addEventListener("haitian_invoices_updated", fetchInvoicesLocal);
      return () => {
        window.removeEventListener("haitian_invoices_updated", fetchInvoicesLocal);
      };
    }

    const q = query(
      collection(db, "invoices"),
      where("email", "==", clientInfo.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedInvoices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInvoices(fetchedInvoices);
      setInvoicesLoading(false);
    }, (error) => {
      console.error("Error fetching invoices:", error);
      fetchInvoicesLocal();
      setInvoicesLoading(false);
    });

    window.addEventListener("haitian_invoices_updated", fetchInvoicesLocal);
    return () => {
      unsubscribe();
      window.removeEventListener("haitian_invoices_updated", fetchInvoicesLocal);
    };
  }, [clientInfo.email]);

  return (
    <div className="min-h-screen bg-[#050508] text-white pt-20 lg:pt-12 pb-12 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-red-600 p-[1px] shrink-0">
              <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center overflow-hidden">
                {userProfile?.profilePicture || firebaseUser?.photoURL ? (
                  <img src={userProfile?.profilePicture || firebaseUser?.photoURL} alt="Client Logo" className="w-full h-full object-cover" />
                ) : (
                  <img src="https://i.postimg.cc/xT9tmPsn/haitiandev-(1).png" alt="Client Logo" className="w-5 h-5 brightness-200 grayscale opacity-45" />
                )}
              </div>
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-200 uppercase tracking-widest text-[10px]">Espace Client</span>
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-blue-600 p-[1px] shrink-0">
                    <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center overflow-hidden">
                      {userProfile?.profilePicture || firebaseUser?.photoURL ? (
                        <img src={userProfile?.profilePicture || firebaseUser?.photoURL} alt="Client Logo" className="w-full h-full object-cover" />
                      ) : (
                        <img src="https://i.postimg.cc/xT9tmPsn/haitiandev-(1).png" alt="Client Logo" className="w-6 h-6 grayscale brightness-200 opacity-45" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold text-white tracking-tight">{clientInfo.name}</h2>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Secteur Tech</p>
                  </div>
                </div>

                <nav className="space-y-2 flex-grow">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const tabUnseen = unseenCounts[tab.id as keyof typeof unseenCounts] || 0;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-medium transition-all
                          ${activeTab === tab.id 
                            ? "bg-white text-black shadow-lg" 
                            : "text-zinc-500 hover:text-white hover:bg-white/5"}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </div>
                        {tabUnseen > 0 && (
                          <span className={`
                            h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-black rounded-full border shadow-md animate-pulse transition-all
                            ${activeTab === tab.id
                              ? "bg-[#D21034] text-white border-black/10"
                              : "bg-[#D21034] text-white border-white/10"}
                          `}>
                            {tabUnseen}
                          </span>
                        )}
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
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all">
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Sidebar Nav - Desktop only */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="bg-[#0c0c12] border border-white/5 rounded-3xl p-6 sticky top-28">
            <button 
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all mb-4 border border-white/5"
            >
              <Home className="w-3.5 h-3.5" />
              Retour à Home
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4 group lowercase">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-blue-600 p-[1px] shrink-0">
                  <div className="w-full h-full bg-black rounded-[15px] flex items-center justify-center overflow-hidden">
                    {userProfile?.profilePicture || firebaseUser?.photoURL ? (
                      <img src={userProfile?.profilePicture || firebaseUser?.photoURL} alt="Client Logo" className="w-full h-full object-cover" />
                    ) : (
                      <img src="https://i.postimg.cc/xT9tmPsn/haitiandev-(1).png" alt="Client Logo" className="w-10 h-10 opacity-60 grayscale brightness-200" />
                    )}
                  </div>
                </div>
              </div>
              <h2 className="font-bold text-lg tracking-tight">{clientInfo.name}</h2>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Secteur Tech</p>
            </div>

            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const tabUnseen = unseenCounts[tab.id as keyof typeof unseenCounts] || 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all
                      ${activeTab === tab.id 
                        ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] scale-[1.02]" 
                        : "text-zinc-500 hover:text-white hover:bg-white/5"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tabUnseen > 0 && (
                      <span className={`
                        h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-black rounded-full border shadow-md animate-pulse transition-all
                        ${activeTab === tab.id
                          ? "bg-[#D21034] text-white border-black/10"
                          : "bg-[#D21034] text-white border-white/10"}
                      `}>
                        {tabUnseen}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="flex-grow space-y-8">
          
          {activeTab === "projects" && (() => {
            const displayProjects: any[] = Array.from(new Map<string, any>(projects.map((p: any) => [p.id, p])).values());
            return (
              <div className="space-y-6">
                {/* Header with Sub-tabs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4 gap-4 px-4">
                  <div>
                    <h3 className="text-xl font-bold border-l-4 border-blue-600 pl-4">Mes Projets</h3>
                    <p className="text-xs text-zinc-500 mt-1 pl-4">Pilotez vos chantiers et accédez à vos identifiants d'administration.</p>
                  </div>
                  
                  {/* Toggle Mode */}
                  <div className="flex bg-[#0c0c12]/80 border border-white/5 p-1 rounded-2xl w-full sm:w-auto self-stretch sm:self-auto">
                    <button
                      onClick={() => setProjectsSubView("tracking")}
                      className={`flex-grow sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        projectsSubView === "tracking" 
                          ? "bg-white text-black shadow-lg" 
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Suivi & Statut
                    </button>
                  </div>
                </div>

                {/* Sub View 1: Tracking */}
                {projectsSubView === "tracking" && (
                  <div className="grid grid-cols-1 gap-6">
                    {loading && projects.length === 0 ? (
                      <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Récupération de vos projets...</p>
                      </div>
                    ) : displayProjects.length === 0 ? (
                      <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-12 md:p-16 flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                          <Briefcase className="w-8 h-8 text-zinc-500" />
                        </div>
                        <div className="space-y-2 max-w-md">
                          <h4 className="text-base font-bold text-white">Aucun projet ou devis trouvé</h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            Nous n'avons trouvé aucune demande de devis ni aucun accès projet lié à l'adresse e-mail <span className="text-zinc-300 font-mono">{clientInfo.email}</span>.
                          </p>
                        </div>
                        <button 
                          onClick={() => navigate("/services")}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 shadow-lg shadow-blue-900/20"
                        >
                          Demander un devis personnalisé
                        </button>
                      </div>
                    ) : (
                      displayProjects.map((project) => (
                        <div key={project.id} className="bg-[#0c0c12] border border-white/5 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 lg:p-10 hover:border-white/10 transition-all flex flex-col md:flex-row gap-6 md:gap-10 items-center group">
                          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl md:rounded-3xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-white/10 transition-colors">
                            <Server className="w-8 h-8 md:w-10 md:h-10 text-blue-500/30 group-hover:text-blue-500 transition-colors" />
                          </div>
                          
                          <div className="flex-grow space-y-4 md:space-y-6 text-center md:text-left w-full">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                              <h4 className="text-lg md:text-xl font-bold tracking-tight">{project.name}</h4>
                              <span className={`self-center md:self-auto px-4 py-1.5 rounded-xl text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-red-600`}>
                                {project.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                              {project.tech?.map((t: string, idx: number) => (
                                <span key={`${t}-${idx}`} className="px-3 py-1.5 bg-white/5 rounded-xl text-[10px] font-bold text-zinc-500 border border-white/5 uppercase tracking-tighter">{t}</span>
                              ))}
                            </div>

                            <div className="space-y-3 pt-2">
                              <div className="flex justify-between items-end">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">État du Déploiement</span>
                                <span className="text-sm font-black text-white">{project.progress}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${project.progress}%` }}
                                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                                />
                              </div>
                            </div>
                          </div>


                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Sub View 2: Credentials & Administration Access */}
                {projectsSubView === "credentials" && (
                  <div className="grid grid-cols-1 gap-8 animate-fadeIn">
                    {displayProjects.length === 0 ? (
                      <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-12 md:p-16 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                          <Lock className="w-8 h-8 text-zinc-500" />
                        </div>
                        <div className="space-y-2 max-w-md">
                          <h4 className="text-base font-bold text-white">Aucun code d'accès</h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            Aucun code d'accès d'administration n'a été provisionné car aucun projet actif n'a été trouvé pour le compte <span className="text-zinc-300 font-mono">{clientInfo.email}</span>.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-[#10b981]/5 border border-[#10b981]/10 rounded-2xl p-4 md:p-6 flex items-center gap-4 text-left">
                          <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#10b981]">Espace Administration Sécurisé</h4>
                            <p className="text-xs text-zinc-400 mt-1 leading-normal">
                              Retrouvez ci-dessous vos identifiants d'administration, clés de connexion d'API, et liens d'administration CMS provisionnés par HaitianDev.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {displayProjects.map((project) => {
                            return (
                              <div 
                                key={`cred-${project.id}`} 
                                className="bg-[#0c0c12] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 hover:border-white/10 transition-all relative overflow-hidden group"
                              >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-600/10 transition-all" />
                                
                                {/* Title & Badges */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 text-left">
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-500">Accès Projet</span>
                                    <h4 className="text-xl font-bold text-white tracking-tight">{project.name}</h4>
                                  </div>
                                  
                                  <button
                                    onClick={() => {
                                      if (project.adminLink) {
                                        window.open(project.adminLink, "_blank", "noopener,noreferrer");
                                      }
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-600 rounded-xl text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 shadow-lg shadow-blue-955/40 transition-all self-start sm:self-auto"
                                  >
                                    <span>Ouvrir le Dashboard Admin</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Credentials Fields Block */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                  {/* Left Column: Identifiants de connexion */}
                                  <div className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-4 md:p-5">
                                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/5">
                                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                                      <span>Accès Backoffice / CMS</span>
                                    </div>

                                    <div className="space-y-3">
                                      {/* URL du CMS */}
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Lien d'Administration</span>
                                        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                                          <span className="text-xs text-zinc-300 font-mono select-all truncate max-w-[180px] sm:max-w-none">{project.adminLink}</span>
                                          <button 
                                            onClick={() => handleCopy(project.adminLink || "", `${project.id}-link`)}
                                            className="text-zinc-500 hover:text-white transition-colors p-1"
                                            title="Copier le lien"
                                          >
                                            {copiedKey === `${project.id}-link` ? (
                                              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scaleIn" />
                                            ) : (
                                              <Copy className="w-3.5 h-3.5" />
                                            )}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Username */}
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Identifiant / Admin User</span>
                                        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                                          <span className="text-xs text-white font-mono select-all">{project.credentials?.username}</span>
                                          <button 
                                            onClick={() => handleCopy(project.credentials?.username || "", `${project.id}-user`)}
                                            className="text-zinc-500 hover:text-white transition-colors p-1"
                                            title="Copier l'identifiant"
                                          >
                                            {copiedKey === `${project.id}-user` ? (
                                              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scaleIn" />
                                            ) : (
                                              <Copy className="w-3.5 h-3.5" />
                                            )}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Password */}
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Mot de Passe Sécurisé</span>
                                        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                                          <span className="text-xs text-white font-mono select-all tracking-wider">
                                            {revealedPasswords[`${project.id}-pwd`] ? project.credentials?.passCode : "•••••••••••••"}
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <button 
                                              onClick={() => togglePasswordVisibility(`${project.id}-pwd`)}
                                              className="text-zinc-500 hover:text-white transition-colors p-1"
                                              title={revealedPasswords[`${project.id}-pwd`] ? "Masquer" : "Afficher"}
                                            >
                                              {revealedPasswords[`${project.id}-pwd`] ? (
                                                <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                                              ) : (
                                                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                                              )}
                                            </button>
                                            <button 
                                              onClick={() => handleCopy(project.credentials?.passCode || "", `${project.id}-pwd`)}
                                              className="text-zinc-500 hover:text-white transition-colors p-1"
                                              title="Copier le mot de passe"
                                            >
                                              {copiedKey === `${project.id}-pwd` ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-400 animate-scaleIn" />
                                              ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right Column: API Keys & Dev connections */}
                                  <div className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-4 md:p-5">
                                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/5">
                                      <Server className="w-3.5 h-3.5 text-indigo-400" />
                                      <span>Connexions & API Devs</span>
                                    </div>

                                    <div className="space-y-3">
                                      {/* API Client Token */}
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">API Token de Service (Live)</span>
                                        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                                          <span className="text-xs text-blue-400 font-mono select-all truncate max-w-[150px] sm:max-w-none">{project.credentials?.apiToken}</span>
                                          <button 
                                            onClick={() => handleCopy(project.credentials?.apiToken || "", `${project.id}-token`)}
                                            className="text-zinc-500 hover:text-white transition-colors p-1"
                                            title="Copier le token"
                                          >
                                            {copiedKey === `${project.id}-token` ? (
                                              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scaleIn" />
                                            ) : (
                                              <Copy className="w-3.5 h-3.5" />
                                            )}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Database connection URI */}
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">URI de Connexion Client</span>
                                        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                                          <span className="text-xs text-zinc-400 font-mono select-all truncate max-w-[150px] sm:max-w-none">{project.credentials?.dbUri}</span>
                                          <button 
                                            onClick={() => handleCopy(project.credentials?.dbUri || "", `${project.id}-dburi`)}
                                            className="text-zinc-500 hover:text-white transition-colors p-1"
                                            title="Copier l'URI"
                                          >
                                            {copiedKey === `${project.id}-dburi` ? (
                                              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scaleIn" />
                                            ) : (
                                              <Copy className="w-3.5 h-3.5" />
                                            )}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Support Tech Shortcut */}
                                      <div className="bg-blue-500/5 rounded-xl p-3 border border-blue-500/10 flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                          <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                                          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">État : Production Active</span>
                                        </div>
                                        <span className="text-[9px] font-mono bg-zinc-900 border border-white/5 text-zinc-500 px-2 py-0.5 rounded">SSL Valide</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === "cms-access" && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4 px-4">
                <h3 className="text-xl font-bold border-l-4 border-amber-500 pl-4 uppercase flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-500" />
                  <span>Codes d'Accès E-CMS</span>
                </h3>
                <p className="text-xs text-zinc-505 mt-1 pl-4 font-mono">
                  Sécurisé : Chaque client ne voit que ses codes d'accès de projet attribués.
                </p>
              </div>

              {accessesLoading ? (
                <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                  <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Récupération de vos clés d'accès...</p>
                </div>
              ) : projectAccesses.length === 0 ? (
                <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center">
                  <ShieldCheck className="w-12 h-12 text-zinc-500 mb-4 animate-pulse" />
                  <p className="text-white font-bold text-sm">Aucun accès CMS disponible</p>
                  <p className="text-zinc-550 text-xs mt-1 max-w-sm">
                    Dès que notre équipe aura finalisé ou provisionné vos codes d'accès et API, ils s'afficheront instantanément ici.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {Array.from(new Map<string, any>(projectAccesses.map((p: any) => [p.id, p])).values()).map((project: any) => {
                    return (
                      <div 
                        key={`direct-cms-${project.id}`} 
                        className="bg-[#0c0c12] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 hover:border-white/10 transition-all relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-550/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-amber-500/10 transition-all" />
                        
                        {/* Title & Badges */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 text-left">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-500">Accès Projet E-CMS Actif</span>
                            <h4 className="text-xl font-bold text-white tracking-tight">{project.name}</h4>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (project.adminLink) {
                                window.open(project.adminLink, "_blank", "noopener,noreferrer");
                              }
                            }}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 hover:brightness-110 shadow-lg shadow-amber-950/20 transition-all self-start sm:self-auto cursor-pointer font-bold"
                          >
                            <span>Ouvrir l'Espace Admin CMS</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-955" />
                          </button>
                        </div>

                        {/* Credentials Fields Block */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          {/* Left Column: Identifiants de connexion */}
                          <div className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-4 md:p-5">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/5">
                              <Lock className="w-3.5 h-3.5 text-amber-500" />
                              <span>Login Backoffice CMS</span>
                            </div>

                            <div className="space-y-3">
                              {/* URL du CMS */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Lien d'Administration</span>
                                <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                                  <span className="text-xs text-zinc-350 font-mono select-all truncate max-w-[180px] sm:max-w-none">{project.adminLink}</span>
                                  <button 
                                    onClick={() => handleCopy(project.adminLink, `${project.id}-link`)}
                                    className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer animate-scaleIn"
                                    title="Copier le lien"
                                  >
                                    {copiedKey === `${project.id}-link` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Username */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Identifiant / Admin User</span>
                                <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                                  <span className="text-xs text-white font-mono select-all">{project.credentials?.username}</span>
                                  <button 
                                    onClick={() => handleCopy(project.credentials?.username || "", `${project.id}-user`)}
                                    className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer"
                                    title="Copier l'identifiant"
                                  >
                                    {copiedKey === `${project.id}-user` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-550" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Password */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Mot de Passe Sécurisé</span>
                                <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                                  <span className="text-xs text-white font-mono select-all tracking-wider">
                                    {revealedPasswords[`${project.id}-pwd`] ? project.credentials?.passCode : "••••••••••••••"}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => togglePasswordVisibility(`${project.id}-pwd`)}
                                      className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer"
                                      title={revealedPasswords[`${project.id}-pwd`] ? "Masquer" : "Afficher"}
                                    >
                                      {revealedPasswords[`${project.id}-pwd`] ? (
                                        <EyeOff className="w-3.5 h-3.5 text-zinc-500" />
                                      ) : (
                                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                                      )}
                                    </button>
                                    <button 
                                      onClick={() => handleCopy(project.credentials?.passCode || "", `${project.id}-pwd`)}
                                      className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer animate-scaleIn"
                                      title="Copier le mot de passe"
                                    >
                                      {copiedKey === `${project.id}-pwd` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-550" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: API Keys & Dev connections */}
                          <div className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-4 md:p-5">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/5">
                              <Server className="w-3.5 h-3.5 text-amber-500" />
                              <span>Informations de Connexion API</span>
                            </div>

                            <div className="space-y-3">
                              {/* API Client Token */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">api token (Jeton de l'API)</span>
                                {project.credentials?.apiToken ? (
                                  <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                                    <span className="text-xs text-blue-400 font-mono select-all truncate max-w-[150px] sm:max-w-none">{project.credentials?.apiToken}</span>
                                    <button 
                                      onClick={() => handleCopy(project.credentials?.apiToken || "", `${project.id}-token`)}
                                      className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer hover:border-white/20"
                                      title="Copier le token"
                                    >
                                      {copiedKey === `${project.id}-token` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-550" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <p className="text-xs italic text-zinc-600 p-2 pl-0">Aucun token API configuré pour ce projet.</p>
                                )}
                              </div>

                              {/* Database connection URI */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">url connection (URL de connexion)</span>
                                {project.credentials?.dbUri ? (
                                  <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                                    <span className="text-xs text-zinc-400 font-mono select-all truncate max-w-[150px] sm:max-w-none">{project.credentials?.dbUri}</span>
                                    <button 
                                      onClick={() => handleCopy(project.credentials?.dbUri || "", `${project.id}-dburi`)}
                                      className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer"
                                      title="Copier l'URI"
                                    >
                                      {copiedKey === `${project.id}-dburi` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-550" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <p className="text-xs italic text-zinc-650 p-2 pl-0 font-sans">Aucune URL de connexion API configurée.</p>
                                )}
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4 pb-2">
                <h3 className="text-xl font-bold border-l-4 border-blue-600 pl-4">Messages & Communications</h3>
              </div>

              {messagesLoading ? (
                <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                  <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Récupération de vos messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-20 text-center">
                  <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from(new Map<string, any>(messages.map((m: any) => [m.id, m])).values()).map((msg: any) => (
                    <div key={msg.id} className="bg-[#0c0c12] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-all space-y-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">De : {msg.senderName || "Admin HaitianDev"}</div>
                          <h4 className="text-lg font-bold text-white">{msg.subject}</h4>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">{new Date(msg.timestamp).toLocaleDateString("fr-FR", { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                      </div>
                      <p className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4 pb-2">
                <h3 className="text-xl font-bold border-l-4 border-blue-600 pl-4">Facturation</h3>
              </div>

              {invoicesLoading ? (
                <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                  <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Récupération de vos factures...</p>
                </div>
              ) : invoices.length === 0 ? (
                <div className="bg-[#0c0c12] border border-white/5 rounded-[2.5rem] p-20 text-center">
                  <CreditCard className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 text-sm">Aucune facture en attente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from(new Map<string, any>(invoices.map((i: any) => [i.id, i])).values()).map((inv: any) => (
                    <ClientInvoiceCard 
                      key={inv.id} 
                      inv={inv} 
                      db={db} 
                      storage={storage} 
                      isFirebaseEnabled={isFirebaseEnabled} 
                      clientInfo={clientInfo} 
                    />
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
                <div className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-[#0c0c12] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h3 className="text-base md:text-lg font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-blue-500" />
                    <span>Profil de l'Entreprise</span>
                  </h3>
 
                  <form className="space-y-4 md:space-y-6" onSubmit={handleUpdateProfile}>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center mb-6 md:mb-8">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 p-[1px] shrink-0">
                        <div className="w-full h-full bg-black rounded-[15px] flex items-center justify-center overflow-hidden">
                          {avatarPreview || userProfile?.profilePicture || firebaseUser?.photoURL ? (
                              <img src={avatarPreview || userProfile?.profilePicture || firebaseUser?.photoURL} alt="Client Logo" className="w-full h-full object-cover" />
                          ) : (
                              <img src="https://i.postimg.cc/xT9tmPsn/haitiandev-(1).png" alt="Client Logo" className="w-10 h-10 md:w-12 md:h-12 grayscale opacity-40 brightness-200" />
                          )}
                        </div>
                      </div>
                      <div className="flex-grow space-y-2">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setEditProfilePicture(file);
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setAvatarPreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setAvatarPreview(null);
                            }
                          }} 
                          className="text-xs text-white" 
                        />
                        <p className="text-[9px] md:text-[10px] text-zinc-600 font-mono uppercase tracking-widest">SVG, PNG ou JPG • Format Carré</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-1">Nom Complet / Contact</label>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="Votre nom ou nom de l'entreprise"
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-1">Email de Facturation</label>
                      <input 
                        type="email" 
                        value={firebaseUser?.email || userProfile?.email || ""} 
                        readOnly 
                        autoComplete="email"
                        className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-xs md:text-sm text-zinc-500 focus:outline-none cursor-not-allowed opacity-60 font-sans" 
                      />
                      <p className="text-[8px] md:text-[9px] text-blue-500/60 font-mono uppercase tracking-tighter ml-1">Email compte principal géré par l'admin.</p>
                    </div>

                    <button 
                      type="submit" 
                      disabled={profileUpdateLoading}
                      className="w-full py-3 md:py-4 bg-white/5 hover:bg-white text-zinc-400 hover:text-black rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all mt-4 border border-white/10 hover:border-white shadow-lg flex items-center justify-center gap-2"
                    >
                      {profileUpdateLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Enregistrer"}
                    </button>
                  </form>
                </div>

                {/* Security */}
                <div className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-[#0c0c12] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <h3 className="text-base md:text-lg font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-red-600 animate-pulse" />
                    <span>Sécurité & Accès</span>
                  </h3>
 
                  <form className="space-y-4 md:space-y-6" onSubmit={handleUpdatePassword}>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-1">Mot de passe actuel</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        placeholder="••••••••" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-xs md:text-sm text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all font-mono" 
                      />
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      <label className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-1 text-red-500/70">Nouveau mot de passe</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        placeholder="Nouveau" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-xs md:text-sm text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all font-mono" 
                      />
                    </div>
 
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-1">Confirmer le nouveau mot de passe</label>
                      <input 
                        type="password" 
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        placeholder="Répétez" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-xs md:text-sm text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all font-mono" 
                      />
                    </div>
 
                    <button 
                      type="submit" 
                      disabled={passwordUpdateLoading}
                      className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all mt-4 hover:brightness-110 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                    >
                      {passwordUpdateLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Mettre à jour le mot de passe"}
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={handleSendPasswordResetEmail}
                      disabled={passwordUpdateLoading}
                      className="w-full py-3 md:py-4 bg-white/5 border border-white/10 hover:bg-white text-zinc-400 hover:text-black rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all mt-2 shadow-lg flex items-center justify-center gap-2"
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
    </div>
  );
};
