import React, { useState } from "react";
import i18n from "i18next";
import { 
  X, 
  Save, 
  Globe, 
  Monitor, 
  Smartphone, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Eye, 
  FileText,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { fr } from "../i18n/fr";
import { en } from "../i18n/en";

interface LiveVisualEditorProps {
  onClose: () => void;
}

export const LiveVisualEditor: React.FC<LiveVisualEditorProps> = ({ onClose }) => {
  // Languages options
  const [activeLang, setActiveLang] = useState<"fr" | "en">(
    i18n.language.startsWith("en") ? "en" : "fr"
  );
  
  // Tab/Page Selection in the simulator
  const [simulatedPage, setSimulatedPage] = useState<"home" | "about" | "services" | "contact">("home");
  const [responsiveMode, setResponsiveMode] = useState<"desktop" | "mobile">("desktop");
  
  // Local state copy of current translation definitions to make deep edits responsive before saving
  const [localFr, setLocalFr] = useState<any>(() => {
    const stored = localStorage.getItem("haitiandev_custom_fr");
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(fr));
  });
  
  const [localEn, setLocalEn] = useState<any>(() => {
    const stored = localStorage.getItem("haitiandev_custom_en");
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(en));
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Helper function to dynamically read nested values from translation dictionary
  const getNestedValue = (obj: any, path: string): string => {
    try {
      const parts = path.split(".");
      let current = obj;
      for (const p of parts) {
        if (current === undefined || current === null) return "";
        current = current[p];
      }
      return typeof current === "string" ? current : "";
    } catch (e) {
      return "";
    }
  };

  // Helper function to deep update a nested value inside state cloningly
  const setNestedValue = (obj: any, path: string, newValue: string): any => {
    const keys = path.split(".");
    const clone = JSON.parse(JSON.stringify(obj)); // structured copy
    let current = clone;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = newValue;
    return clone;
  };

  // Save changes handler
  const handleSaveChanges = () => {
    try {
      // 1. Commit to persistent storage
      localStorage.setItem("haitiandev_custom_fr", JSON.stringify(localFr));
      localStorage.setItem("haitiandev_custom_en", JSON.stringify(localEn));
      
      // 2. Hydrate active runtime resource bundle in i18next dynamically
      i18n.addResourceBundle("fr", "translation", localFr, true, true);
      i18n.addResourceBundle("en", "translation", localEn, true, true);
      
      // 3. Inform i18n to reload active configurations
      i18n.changeLanguage(i18n.language);
      
      triggerToast("✨ Modifications enregistrées avec succès en mode live !");
    } catch (e) {
      console.error(e);
      triggerToast("❌ Échec de la sauvegarde des modifications.");
    }
  };

  // Render editable block with appropriate hover boundary and interactive edit properties
  const renderEditableText = (keyPath: string, customClasses: string = "") => {
    const currentDict = activeLang === "fr" ? localFr : localEn;
    const value = getNestedValue(currentDict, keyPath);

    const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
      const nextText = e.currentTarget.textContent || "";
      if (activeLang === "fr") {
        setLocalFr((prev: any) => setNestedValue(prev, keyPath, nextText));
      } else {
        setLocalEn((prev: any) => setNestedValue(prev, keyPath, nextText));
      }
    };

    return (
      <span
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        className={`transition-all hover:outline hover:outline-dashed hover:outline-2 hover:outline-blue-500/80 hover:bg-blue-500/5 focus:outline-solid focus:outline-2 focus:outline-emerald-500 focus:bg-emerald-500/10 px-1 py-0.5 rounded cursor-edit focus:cursor-text relative group inline shadow-sm ${customClasses}`}
        title="Double-cliquez ou cliquez pour modifier ce texte en direct (FR & EN)"
      >
        {value || <span className="text-red-500/60 font-mono text-xs italic">[Sans texte]</span>}
        
        {/* Subtle hover tooltip badge identifying translation path */}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-blue-950 border border-blue-800 text-[8px] text-blue-300 font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
          {keyPath}
        </span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#070b13] z-50 text-slate-100 flex flex-col font-sans select-none overflow-hidden h-screen w-screen">
      
      {/* Background ambient animations for visual prestige */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] rounded-full bg-[#00209F]/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] rounded-full bg-[#D21034]/10 blur-[130px] pointer-events-none z-0" />

      {/* ---------------- 1. GLASSMORPHIC TOPBAR ---------------- */}
      <header className="h-16 shrink-0 bg-slate-950/80 border-b border-slate-900 backdrop-blur-xl px-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#00209F] to-[#D21034] shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-xs font-mono tracking-widest text-[#D21034] font-bold uppercase block -mb-0.5">HaitianDev System</span>
            <h1 className="text-sm font-display font-extrabold text-white tracking-widest">
              LIVE VISUAL EDITOR
            </h1>
          </div>
        </div>

        {/* Center: Simulator Page and Responsive Controllers */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center bg-slate-900/60 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setSimulatedPage("home")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                simulatedPage === "home" 
                  ? "bg-slate-850 text-white border border-slate-700/60" 
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => setSimulatedPage("services")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                simulatedPage === "services" 
                  ? "bg-slate-850 text-white border border-slate-700/60" 
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setSimulatedPage("about")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                simulatedPage === "about" 
                  ? "bg-slate-850 text-white border border-slate-700/60" 
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              À Propos
            </button>
            <button
              onClick={() => setSimulatedPage("contact")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                simulatedPage === "contact" 
                  ? "bg-slate-850 text-white border border-slate-700/60" 
                  : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center bg-slate-900/60 border border-slate-800 p-1 rounded-xl space-x-1">
            <button
              onClick={() => setResponsiveMode("desktop")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                responsiveMode === "desktop" ? "bg-slate-850 text-blue-400" : "text-zinc-500"
              }`}
              title="Aperçu Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setResponsiveMode("mobile")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                responsiveMode === "mobile" ? "bg-slate-850 text-red-400" : "text-zinc-500"
              }`}
              title="Aperçu Mobile Étroit"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right side: Language selection & Action triggers */}
        <div className="flex items-center space-x-3">
          
          {/* Lang buttons switch */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-900">
            <button
              onClick={() => setActiveLang("fr")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer ${
                activeLang === "fr" ? "bg-gradient-to-br from-blue-900/60 to-slate-950 text-white border border-blue-900/40" : "text-zinc-500"
              }`}
              title="Éditer la version française"
            >
              FR
            </button>
            <button
              onClick={() => setActiveLang("en")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer ${
                activeLang === "en" ? "bg-gradient-to-br from-red-900/60 to-slate-950 text-white border border-red-900/40" : "text-zinc-500"
              }`}
              title="Éditer la version anglaise"
            >
              EN
            </button>
          </div>

          {/* Glowing Save trigger */}
          <button
            onClick={handleSaveChanges}
            className="bg-gradient-to-r from-[#00209F] to-[#D21034] text-white hover:opacity-90 active:scale-95 transition-all text-xs font-bold font-mono tracking-wider uppercase rounded-xl px-4 py-2.5 flex items-center space-x-1.5 shadow-lg shadow-red-500/20 border border-white/10 hover:shadow-red-500/30 cursor-pointer"
            title="Enregistrer toutes les modifications dans la base locale d'élite"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Changes</span>
          </button>

          {/* Close Editor and exit */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl border border-slate-900 hover:border-slate-800 bg-slate-950 text-zinc-400 hover:text-white hover:bg-slate-900/40 transition-colors cursor-pointer"
            title="Revenir au tableau d'administration"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ---------------- 2. INFORMATIONAL INSTRUCTIONS BAR ---------------- */}
      <div className="shrink-0 bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-red-950/40 border-b border-slate-900/50 px-6 py-2.5 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-400 z-10 font-mono">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          Langue d'édition active : <strong className="text-white bg-slate-900 px-1.5 py-0.5 rounded leading-none uppercase">{activeLang}</strong>. 
          Pour modifier un texte, cliquez simplement dessus et saisissez votre texte. Cliquez en dehors pour appliquer. Vos modifications s'enregistrent live sur le site après avoir pressé <strong className="text-white">"Save Changes"</strong>.
        </span>
      </div>

      {/* ---------------- 3. MAIN SIMULATION AREA ---------------- */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 flex justify-center bg-slate-950/40 relative z-0">
        
        {/* Toast notification wrapper */}
        {toastMessage && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2.5 px-6 py-3.5 bg-slate-900/90 border border-emerald-500/45 text-emerald-400 font-mono text-xs rounded-2xl shadow-2xl backdrop-blur-xl animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Live Simulator View frame container - responsive mock */}
        <div className={`transition-all duration-300 w-full rounded-2xl border border-slate-900 shadow-2xl p-6 bg-[#040811]/90 overflow-y-auto max-h-[80vh] ${
          responsiveMode === "mobile" ? "max-w-md border-r-4 border-l-4 border-slate-800" : "max-w-6xl"
        }`}>
          
          {/* Mobile framing camera notch simulation */}
          {responsiveMode === "mobile" && (
            <div className="w-full flex justify-center mb-6">
              <div className="w-32 h-5 bg-slate-850 rounded-b-xl border-b border-slate-700/20 flex justify-center items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
              </div>
            </div>
          )}

          {/* Quick Page switcher for mobile or non-huge screens */}
          <div className="lg:hidden flex flex-wrap gap-1.5 bg-slate-950/60 border border-slate-900 p-1 rounded-xl mb-6 justify-center">
            {["home", "services", "about", "contact"].map((p) => (
              <button
                key={p}
                onClick={() => setSimulatedPage(p as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  simulatedPage === p 
                    ? "bg-slate-900 text-white border border-slate-800" 
                    : "text-zinc-500"
                }`}
              >
                {p === "home" ? "Accueil" : p === "services" ? "Services" : p === "about" ? "À Propos" : "Contact"}
              </button>
            ))}
          </div>

          {/* Inner Simulated Simulated HTML Document mockup styling to mirror real platform design */}
          <div className="space-y-16">
            
            {/* Simulated Menu Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-6">
              <div className="flex items-center space-x-2 font-display font-black text-white text-base">
                <span className="w-2 h-2 rounded-full bg-[#00209F]" />
                <span>HAITIAN DEV</span>
              </div>
              <div className="hidden md:flex items-center space-x-6 text-xs text-zinc-400 font-mono font-medium">
                {renderEditableText("navbar.home")}
                {renderEditableText("navbar.services")}
                {renderEditableText("navbar.about")}
                {renderEditableText("navbar.training")}
                {renderEditableText("navbar.blog")}
              </div>
              <button className="px-3.5 py-1.5 rounded-lg border border-slate-900 text-xs font-mono font-bold text-white bg-slate-950">
                {renderEditableText("navbar.engage_us")}
              </button>
            </div>

            {/* ---------------- SIMULATOR ROUTER PAGES RENDERS ---------------- */}
            
            {/* VIEW A: HOME PAGE TEMPLATE */}
            {simulatedPage === "home" && (
              <div className="space-y-16">
                
                {/* 1. HERO SECTION */}
                <div className="text-center max-w-3xl mx-auto space-y-6">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00209F]/10 border border-[#00209F]/20 text-[10px] font-mono tracking-widest text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    <span>{renderEditableText("hero.tagline", "uppercase")}</span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400 tracking-tight leading-tight">
                    {renderEditableText("hero.connecting")}
                  </h2>

                  <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
                    {renderEditableText("footer.tagline")}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button className="bg-gradient-to-r from-[#00209F] to-[#D21034] text-white hover:opacity-90 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg shadow-black/80">
                      <span>{renderEditableText("hero.create_account")}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button className="bg-slate-950 border border-slate-900 hover:border-slate-800 text-zinc-300 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest">
                      {renderEditableText("hero.login_to_account")}
                    </button>
                  </div>
                </div>

                {/* 2. STATS BAR */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-950/40 p-6 rounded-2xl border border-slate-900/60 max-w-5xl mx-auto">
                  <div className="text-center space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#00209F] font-display">12M+</p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{renderEditableText("stats.lines_written")}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-[#D21034] font-display">42+</p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{renderEditableText("stats.projects_delivered")}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 font-display">1,200+</p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{renderEditableText("stats.students_trained")}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 font-display">99.9%</p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{renderEditableText("stats.uptime_guarantee")}</p>
                  </div>
                </div>

                {/* 3. POURQUOI HAITIAN DEV ? */}
                <div className="space-y-10 max-w-4xl mx-auto">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">{renderEditableText("features.overline")}</span>
                    <h3 className="text-2xl font-bold text-white font-display leading-tight">{renderEditableText("features.title")}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Feature Card 1 */}
                    <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/20 backdrop-blur-sm space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-900/10 border border-blue-900/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                        ⚡
                      </div>
                      <h4 className="text-white font-bold text-sm font-display">{renderEditableText("features.speed_title")}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">{renderEditableText("features.speed_desc")}</p>
                    </div>

                    {/* Feature Card 2 */}
                    <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/20 backdrop-blur-sm space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-red-900/10 border border-red-900/20 flex items-center justify-center text-red-400 font-bold text-sm">
                        🏦
                      </div>
                      <h4 className="text-white font-bold text-sm font-display">{renderEditableText("features.api_title")}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">{renderEditableText("features.api_desc")}</p>
                    </div>

                    {/* Feature Card 3 */}
                    <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/20 backdrop-blur-sm space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-900/10 border border-yellow-900/20 flex items-center justify-center text-yellow-400 font-bold text-sm">
                        🪐
                      </div>
                      <h4 className="text-white font-bold text-sm font-display">{renderEditableText("features.hosting_title")}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">{renderEditableText("features.hosting_desc")}</p>
                    </div>

                    {/* Feature Card 4 */}
                    <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/20 backdrop-blur-sm space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-900/10 border border-purple-900/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                        🔒
                      </div>
                      <h4 className="text-white font-bold text-sm font-display">{renderEditableText("features.encryption_title")}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">{renderEditableText("features.encryption_desc")}</p>
                    </div>
                  </div>
                </div>

                {/* 4. PROCESS SECTION PREVIEW */}
                <div className="space-y-8 max-w-4xl mx-auto border-t border-slate-900 pt-12">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">{renderEditableText("process.overline")}</span>
                    <h3 className="text-2xl font-bold text-white font-display leading-tight">{renderEditableText("process.title")}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl text-center">
                      <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-900/10 px-2 py-0.5 rounded-full inline-block mb-2">01</span>
                      <h4 className="text-white text-xs font-bold font-display">{renderEditableText("process.steps.1.title")}</h4>
                      <p className="text-zinc-500 text-[10px] mt-1 line-clamp-2">{renderEditableText("process.steps.1.desc")}</p>
                    </div>
                    <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl text-center">
                      <span className="text-[10px] font-mono text-red-400 font-bold bg-red-900/10 px-2 py-0.5 rounded-full inline-block mb-2">02</span>
                      <h4 className="text-white text-xs font-bold font-display">{renderEditableText("process.steps.2.title")}</h4>
                      <p className="text-zinc-500 text-[10px] mt-1 line-clamp-2">{renderEditableText("process.steps.2.desc")}</p>
                    </div>
                    <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl text-center">
                      <span className="text-[10px] font-mono text-yellow-400 font-bold bg-yellow-900/10 px-2 py-0.5 rounded-full inline-block mb-2">03</span>
                      <h4 className="text-white text-xs font-bold font-display">{renderEditableText("process.steps.3.title")}</h4>
                      <p className="text-zinc-500 text-[10px] mt-1 line-clamp-2">{renderEditableText("process.steps.3.desc")}</p>
                    </div>
                    <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl text-center">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-900/10 px-2 py-0.5 rounded-full inline-block mb-2">04</span>
                      <h4 className="text-white text-xs font-bold font-display">{renderEditableText("process.steps.4.title")}</h4>
                      <p className="text-zinc-500 text-[10px] mt-1 line-clamp-2">{renderEditableText("process.steps.4.desc")}</p>
                    </div>
                    <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl text-center">
                      <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-900/10 px-2 py-0.5 rounded-full inline-block mb-2">05</span>
                      <h4 className="text-white text-xs font-bold font-display">{renderEditableText("process.steps.5.title")}</h4>
                      <p className="text-zinc-500 text-[10px] mt-1 line-clamp-2">{renderEditableText("process.steps.5.desc")}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* VIEW B: SERVICES CONFIGURATOR */}
            {simulatedPage === "services" && (
              <div className="space-y-12 max-w-4xl mx-auto">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">{renderEditableText("services.overline")}</span>
                  <h3 className="text-3xl font-extrabold text-white font-display leading-tight">{renderEditableText("services.title")}</h3>
                  <p className="text-zinc-400 text-sm max-w-lg mx-auto">{renderEditableText("services.tagline")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Step 1 mock panel */}
                  <div className="border border-slate-900 bg-slate-950/40 p-6 rounded-2xl relative space-y-4">
                    <span className="text-[9px] font-mono bg-blue-900/10 text-blue-400 px-2.5 py-1 rounded border border-blue-900/20 font-bold block w-max uppercase">Étape 01</span>
                    <h4 className="text-white text-xs font-bold font-display uppercase tracking-wider">{renderEditableText("services.step1_title")}</h4>
                    <p className="text-zinc-500 text-xs">Simulateur interactif pour configurer les besoins client.</p>
                  </div>
                  
                  {/* Step 2 mock panel */}
                  <div className="border border-slate-900 bg-slate-950/40 p-6 rounded-2xl relative space-y-4">
                    <span className="text-[9px] font-mono bg-red-900/10 text-red-400 px-2.5 py-1 rounded border border-red-900/20 font-bold block w-max uppercase">Étape 02</span>
                    <h4 className="text-white text-xs font-bold font-display uppercase tracking-wider">{renderEditableText("services.step2_title")}</h4>
                    <p className="text-zinc-500 text-xs">{renderEditableText("services.features_label")}</p>
                  </div>

                  {/* Step 3 mock panel */}
                  <div className="border border-slate-900 bg-[#00209F]/10 p-6 rounded-2xl relative space-y-4 border-blue-900/50">
                    <span className="text-[9px] font-mono bg-[#D21034]/20 text-red-400 px-2.5 py-1 rounded border border-[#D21034]/40 font-bold block w-max uppercase">Étape 03</span>
                    <h4 className="text-white text-xs font-bold font-display uppercase tracking-wider">{renderEditableText("services.step3_title")}</h4>
                    <div>
                      <p className="text-zinc-500 text-[10px]">{renderEditableText("services.base_cost")}</p>
                      <p className="text-emerald-400 text-lg font-black font-mono mt-1">$2,500 USD</p>
                    </div>
                    <button className="bg-gradient-to-r from-[#00209F] to-[#D21034] text-white w-full py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest text-center shadow-lg">
                      {renderEditableText("services.order_cta")}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950/20 p-6 border border-slate-900 rounded-2xl space-y-4">
                  <p className="text-white font-bold text-xs font-display">{renderEditableText("services.included_free")}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-zinc-500">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#D21034]">✔</span>
                      <span>{renderEditableText("services.uptime")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#D21034]">✔</span>
                      <span>{renderEditableText("services.support")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#D21034]">✔</span>
                      <span>{renderEditableText("services.documentation")}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* VIEW C: ABOUT US PAGE */}
            {simulatedPage === "about" && (
              <div className="space-y-12 max-w-4xl mx-auto">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">{renderEditableText("about.mission_overline")}</span>
                  <h3 className="text-3xl font-extrabold text-white font-display leading-tight">{renderEditableText("about.title")}</h3>
                  <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">{renderEditableText("about.tagline")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-900 pt-10">
                  <div className="space-y-4">
                    <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest block">{renderEditableText("about.mission_overline")}</span>
                    <h4 className="text-white text-xl font-bold font-display">{renderEditableText("about.mission_title")}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">{renderEditableText("about.mission_desc")}</p>
                    <p className="text-zinc-400 text-xs italic border-l-2 border-blue-500 pl-3">{renderEditableText("about.mission_sub")}</p>
                  </div>

                  <div className="space-y-4">
                    <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-widest block">{renderEditableText("about.vision_overline")}</span>
                    <h4 className="text-white text-xl font-bold font-display">{renderEditableText("about.vision_title")}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">{renderEditableText("about.vision_desc")}</p>
                    <p className="text-zinc-400 text-xs italic border-l-2 border-red-500 pl-3">{renderEditableText("about.vision_sub")}</p>
                  </div>
                </div>

                {/* Commitments & CTAs */}
                <div className="bg-gradient-to-r from-slate-950 to-slate-900/40 p-8 rounded-2xl border border-slate-900 text-center space-y-6 max-w-3xl mx-auto">
                  <h4 className="text-white font-display text-lg font-bold">{renderEditableText("about.cta_title")}</h4>
                  <p className="text-zinc-400 text-xs max-w-xl mx-auto leading-relaxed">{renderEditableText("about.cta_desc")}</p>
                  <button className="bg-gradient-to-r from-[#00209F] to-[#D21034] text-white hover:opacity-90 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest">
                    {renderEditableText("about.cta_button")}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW D: CONTACT INTERFACE */}
            {simulatedPage === "contact" && (
              <div className="space-y-12 max-w-3xl mx-auto">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">{renderEditableText("contact.overline")}</span>
                  <h3 className="text-3xl font-extrabold text-white font-display leading-tight">{renderEditableText("contact.title")}</h3>
                  <p className="text-zinc-400 text-sm max-w-md mx-auto">{renderEditableText("contact.desc")}</p>
                </div>

                <div className="bg-slate-950/40 p-8 border border-slate-900 rounded-2xl space-y-6 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">{renderEditableText("contact.fullname")}</label>
                    <div className="bg-slate-900/60 p-3.5 border border-slate-800 rounded-xl text-xs text-zinc-650 font-mono">Jean-Maxime Auguste</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">{renderEditableText("contact.email")}</label>
                    <div className="bg-slate-900/60 p-3.5 border border-slate-800 rounded-xl text-xs text-zinc-650 font-mono">maxime@societechange.com</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">{renderEditableText("contact.service_solicited")}</label>
                    <div className="bg-slate-900/60 p-3.5 border border-slate-800 rounded-xl text-xs text-zinc-650 flex justify-between items-center">
                      <span>{renderEditableText("contact.select_service")}</span>
                      <span>▼</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">{renderEditableText("contact.message")}</label>
                    <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-xl text-xs text-zinc-650 font-mono h-24">Besoins détaillés...</div>
                  </div>

                  <button className="bg-gradient-to-r from-[#00209F] to-[#D21034] text-white w-full py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest text-center shadow-lg">
                    {renderEditableText("contact.submit")}
                  </button>
                </div>
              </div>
            )}

            {/* Simulated footer */}
            <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-zinc-500 gap-4">
              <div>
                <span>© {new Date().getFullYear()} Haitian Dev. </span>
                <span>{renderEditableText("footer.all_rights_reserved")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{renderEditableText("footer.designed_in")}</span>
                <span>{renderEditableText("footer.with")}</span>
                <span className="text-red-500">❤</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
