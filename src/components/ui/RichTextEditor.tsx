import React, { useState, useRef } from "react";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  Table, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Sparkles, 
  Eye, 
  Edit3, 
  FileText, 
  Loader2, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { renderMarkdownToHtml } from "../../utils/markdown";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  themeColor?: "blue" | "emerald" | "amber";
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Rédigez l'article d'élite ici (supporte le Markdown)...",
  themeColor = "blue"
}) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAiHelper, setShowAiHelper] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Colors mapping based on Admin Panel theme context (Blog=blue, Formation=emerald, Doc=amber)
  const colors = {
    blue: {
      border: "border-blue-500/20",
      focusBorder: "focus:border-blue-500/55",
      badge: "bg-blue-950/40 border-blue-800/50 text-blue-400",
      accentButton: "bg-blue-600 hover:bg-blue-500 text-white",
      textAccent: "text-blue-400"
    },
    emerald: {
      border: "border-emerald-500/20",
      focusBorder: "focus:border-emerald-500/55",
      badge: "bg-emerald-950/40 border-emerald-800/50 text-emerald-400",
      accentButton: "bg-emerald-600 hover:bg-emerald-500 text-white",
      textAccent: "text-emerald-400"
    },
    amber: {
      border: "border-amber-500/20",
      focusBorder: "focus:border-amber-500/55",
      badge: "bg-amber-950/40 border-amber-800/50 text-amber-400",
      accentButton: "bg-amber-600 hover:bg-amber-500 text-white",
      textAccent: "text-amber-400"
    }
  }[themeColor];

  // Helper to insert markdown content at current selection/cursor position
  const insertMarkdown = (before: string, after: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos) || defaultText;

    const prefix = textarea.value.substring(0, startPos);
    const suffix = textarea.value.substring(endPos);
    
    const insertValue = `${before}${selectedText}${after}`;
    const newValue = `${prefix}${insertValue}${suffix}`;
    
    onChange(newValue);
    
    // Reset focus and cursor selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = startPos + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  // Pre-configured premium educational outlines as templates
  const applyTemplate = (type: string) => {
    let template = "";
    if (type === "tutorial") {
      template = `# Titre de votre Tutoriel d'Élite

## Introduction
*Donnez un aperçu élégant de ce que le lecteur va apprendre dans ce tutoriel et les prérequis nécessaires.*

## Étape 1 : Configuration initiale
\`\`\`bash
# Exemple de commande de démarrage
npm install @google/genai
\`\`\`

## Étape 2 : Implémentation du code principal
*Expliquez l'approche architecturale ici.*

\`\`\`typescript
// Exemple de code propre et typé
const client = "HaitianDev Team";
console.log(\`Soutenu par \${client}\`);
\`\`\`

## Étape 3 : Tests de validation
*Comment tester que le système fonctionne parfaitement.*

| Fonctionnalité | Statut | Temps de réponse |
| :--- | :---: | :---: |
| Authentification | ✅ Opérationnel | 45ms |
| Intégration API | ✅ Opérationnel | 120ms |

## Conclusion & Synthèse
*Résumé et étapes suivantes d'apprentissage pour aller plus loin.*
`;
    } else if (type === "fintech") {
      template = `# Guide d'Intégration d'API Fintech (MonCash / Natcash)

## Contexte opérationnel
*Discutez des contraintes de l'infrastructure mobile money en Haïti et des bénéfices de l'automatisation.*

## Flux de paiement de l'intégration
1. L'utilisateur lance la transaction sur sa plateforme.
2. Notre backend contacte l'API sécurisée du fournisseur local.
3. Redirection de l'utilisateur ou requête USSD directe.
4. Hook de notification (webhook) asynchrone reçu par notre infrastructure.

## Exemple d'architecture d'intégration
> **Note de sécurité :** Toujours valider la signature cryptographique reçue dans les webhooks !

\`\`\`javascript
// Exemple de validation de transaction MonCash ou Natcash
function signTransaction(payload, secretKey) {
  // Générer la signature avec HMAC SHA256
  return crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
}
\`\`\`

## Bonnes pratiques de production
- **Redondance :** Stocker le payload brut en base locale.
- **Ré-essais automatique :** Gérer les erreurs réseau avec de l'exponential backoff.
`;
    } else if (type === "structure-cours") {
      template = `# Programme de la Formation : [Nom du Cours]

## Description Globale du Cours
*Entrez la description, l'audience ciblée, les bénéfices concrets pour la carrière de l'étudiant et le format.*

## Liste des Modules de Formation

### Module 1 : Fondations architecturales (Semaine 1-3)
- Les principes fondamentaux
- Structure de base et typage strict
- Ateliers pratiques individuels

### Module 2 : Intégrations avancées (Semaine 4-7)
- Connexion avec des micro-services
- Base de données locale et cloud
- Optimisation des temps de réponse

### Module 3 : Projet de fin d'études d'élite (Semaine 8-12)
- Architecture complète
- Audit de performance et revue de code de groupe
- Simulation de mise en production à grande échelle
`;
    }

    if (template) {
      if (value.trim() && !window.confirm("Remplacer le contenu existant par ce modèle premium ?")) {
        return;
      }
      onChange(template);
    }
  };

  // Call the server-side Gemini API route to generate an article with AI
  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setAiError(null);

    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      
      if (!response.ok) {
        let errorMsg = "Une erreur inconnue est survenue.";
        try {
          const data = await response.json();
          errorMsg = data.error || errorMsg;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const generatedText = data.text || "";
      if (value.trim()) {
        if (window.confirm("Voulez-vous fusionner et AJOUTER l'article généré au texte actuel ? (Annuler écrasera le texte actuel)")) {
          onChange(value + "\n\n" + generatedText);
        } else {
          onChange(generatedText);
        }
      } else {
        onChange(generatedText);
      }
      
      setAiPrompt("");
      setShowAiHelper(false);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Erreur de connexion avec le copilote IA.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className={`w-full bg-[#0a0a0f] border ${colors.border} rounded-2xl overflow-hidden transition-all shadow-xl shadow-black/85`}>
      {/* Editor Navigation & Tab Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-900/80 px-4 py-3 bg-[#0d0d14] gap-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => { setActiveTab("edit"); setTimeout(() => textareaRef.current?.focus(), 10); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "edit" 
                ? `${colors.badge} bg-white/5` 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Éditeur
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "preview" 
                ? `${colors.badge} bg-white/5` 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Aperçu direct
          </button>
        </div>

        {/* Co-pilote & Models */}
        <div className="flex items-center gap-2">
          {/* Outlines template selector */}
          <select 
            onChange={(e) => {
              applyTemplate(e.target.value);
              e.target.value = ""; // resetting
            }}
            className="bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] text-zinc-400 focus:outline-none focus:border-zinc-700 font-mono"
          >
            <option value="">📁 Choisir un Modèle...</option>
            <option value="tutorial">💡 Tutoriel Technique</option>
            <option value="fintech">💳 Tutoriel Fintech (MonCash/Natcash)</option>
            <option value="structure-cours">🎓 Descriptif de formation d'élite</option>
          </select>

          {/* Gemini AI assistant toggle */}
          <button
            type="button"
            onClick={() => setShowAiHelper(!showAiHelper)}
            className={`px-3 py-1 bg-gradient-to-r from-violet-650 via-purple-600 to-indigo-650 border border-violet-500/30 hover:brightness-110 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-violet-950/20`}
          >
            <Sparkles className="w-3 h-3 text-yellow-300" /> Co-pilote IA
          </button>
        </div>
      </div>

      {/* AI helper prompt input box */}
      {showAiHelper && (
        <div className="bg-gradient-to-r from-violet-950/25 to-indigo-950/20 border-b border-indigo-900/30 p-4 space-y-3 animate-fade-in relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-violet-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-400" /> Rédaction Assistée avec Gemini 3.5
            </span>
            <button
              type="button"
              onClick={() => setShowAiHelper(false)}
              className="text-zinc-500 hover:text-zinc-300 text-xs font-mono"
            >
              Fermer
            </button>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Indiquez le sujet de l'article (Ex: Tutoriel sur la sécurisation des Webhooks avec React & Node)..."
              disabled={isAiGenerating}
              className="w-full bg-slate-900/80 border border-violet-900/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-violet-500/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAiGeneration();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAiGeneration}
              disabled={isAiGenerating || !aiPrompt.trim()}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Écriture...
                </>
              ) : (
                <>
                  Générer <Sparkles className="w-3 h-3 text-yellow-300" />
                </>
              )}
            </button>
          </div>

          {aiError && (
            <p className="text-[10px] text-red-500 font-mono flex items-center gap-1 mt-1 bg-red-950/10 p-2 border border-red-900/10 rounded-lg">
              <AlertCircle className="w-3 h-3 shrink-0" /> {aiError}
            </p>
          )}
        </div>
      )}

      {/* Editor Main Content Areas */}
      {activeTab === "edit" ? (
        <div className="flex flex-col">
          {/* Quick Markup Formatting Bar */}
          <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-[#08080d] border-b border-slate-900/50 overflow-x-auto">
            <button
              type="button"
              onClick={() => insertMarkdown("**", "**", "texte gras")}
              title="Gras"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("*", "*", "texte italique")}
              title="Italique"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              <ItextItalic className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-slate-900 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown("# ", "", "Titre Principal")}
              title="Titre 1"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("## ", "", "Sous-titre")}
              title="Titre 2"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("### ", "", "Section")}
              title="Titre 3"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer flex items-center gap-0.5"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-slate-900 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown("- ", "", "Élément liste")}
              title="Liste à puces"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("1. ", "", "Premier élément")}
              title="Liste numérotée"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-slate-900 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown("> ", "", "Citation importante")}
              title="Citation"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("```javascript\n", "\n```", "// votre code")}
              title="Bloc de Code"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("[En savoir plus](", ")", "https://haitiandev.com")}
              title="Lien hypertexte"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("![Image](", ")", "https://images.unsplash.com/photo-example")}
              title="Image"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("\n| En-tête 1 | En-tête 2 | \n| :--- | :--- | \n| Valeur L1C1 | Valeur L1C2 | \n| Valeur L2C1 | Valeur L2C2 | \n", "")}
              title="Insérer un Tableau"
              className="p-2 text-zinc-450 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={12}
            className={`w-full bg-[#050508] border-0 px-4 py-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none ${colors.focusBorder} resize-y scrollbar-thin font-mono leading-relaxed min-h-[300px]`}
          />
          <div className="bg-[#050508] px-4 py-1.5 border-t border-slate-900/40 text-[10px] text-zinc-550 font-mono flex items-center justify-between">
            <span>{value.length} caractères • {value.split(/\s+/).filter(Boolean).length} mots</span>
            <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3 text-zinc-650" /> Markdown supporté</span>
          </div>
        </div>
      ) : (
        <div className="bg-[#050508] p-6 max-h-[500px] overflow-y-auto scrollbar-thin min-h-[340px]">
          <div 
            className="prose prose-invert max-w-none text-zinc-300 select-text"
            dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(value) }}
          />
        </div>
      )}
    </div>
  );
};

// Simple wrapper wrapper to support Italic / clean up compiler issues
const ItextItalic = Italic;
