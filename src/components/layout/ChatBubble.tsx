import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export const ChatBubble: React.FC = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";

  // Custom parser to handle bold formatting (**text**), markdown lists (- or *), and markdown links ([Label](url))
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    const renderedElements: React.ReactNode[] = [];
    let currentListItems: React.ReactNode[] = [];
    let listKeyCounter = 0;

    const parseInlineStyles = (subText: string, baseKey: string) => {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      const parseBold = (boldText: string, boldBaseKey: string) => {
        const boldRegex = /\*\*([^*]+)\*\*/g;
        const subParts: React.ReactNode[] = [];
        let subLastIndex = 0;
        let subMatch;
        let count = 0;

        while ((subMatch = boldRegex.exec(boldText)) !== null) {
          if (subMatch.index > subLastIndex) {
            subParts.push(boldText.substring(subLastIndex, subMatch.index));
          }
          subParts.push(
            <strong key={`${boldBaseKey}-bold-${count++}`} className="font-bold text-white px-1 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/40">
              {subMatch[1]}
            </strong>
          );
          subLastIndex = boldRegex.lastIndex;
        }
        if (subLastIndex < boldText.length) {
          subParts.push(boldText.substring(subLastIndex));
        }
        return subParts;
      };

      let linkCount = 0;
      while ((match = linkRegex.exec(subText)) !== null) {
        const matchIndex = match.index;
        if (matchIndex > lastIndex) {
          const plainText = subText.substring(lastIndex, matchIndex);
          parts.push(...parseBold(plainText, `${baseKey}-plain-${linkCount}`));
        }

        const label = match[1];
        const url = match[2];
        const isExternal = url.startsWith("http://") || url.startsWith("https://");

        if (isExternal) {
          parts.push(
            <a
              key={`${baseKey}-link-${linkCount++}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline font-semibold transition-colors duration-200 inline-flex items-center"
            >
              {label}
            </a>
          );
        } else {
          parts.push(
            <Link
              key={`${baseKey}-link-${linkCount++}`}
              to={url}
              className="text-blue-400 hover:text-blue-300 underline font-bold transition-colors duration-200 inline"
            >
              {label}
            </Link>
          );
        }
        lastIndex = linkRegex.lastIndex;
      }

      if (lastIndex < subText.length) {
        const plainText = subText.substring(lastIndex);
        parts.push(...parseBold(plainText, `${baseKey}-plain-end`));
      }

      return parts.length > 0 ? parts : subText;
    };

    const flushList = () => {
      if (currentListItems.length > 0) {
        renderedElements.push(
          <ul key={`list-${listKeyCounter++}`} className="list-disc pl-5 my-2 space-y-1 text-zinc-200">
            {currentListItems}
          </ul>
        );
        currentListItems = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Check if bullet point
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
        const content = trimmed.substring(2);
        currentListItems.push(
          <li key={`li-${i}`} className="text-zinc-200 leading-relaxed pl-1">
            {parseInlineStyles(content, `line-${i}`)}
          </li>
        );
      } else if (trimmed === "") {
        flushList();
        renderedElements.push(<div key={`spacer-${i}`} className="h-2" />);
      } else {
        flushList();
        renderedElements.push(
          <p key={`p-${i}`} className="my-1 text-zinc-200 leading-relaxed">
            {parseInlineStyles(line, `line-${i}`)}
          </p>
        );
      }
    }

    flushList();
    return renderedElements;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Instant local response logic to respond in 0ms (simulated with tiny natural delay)
  const getLocalResponse = (text: string, isEn: boolean): string | null => {
    const query = text.toLowerCase().trim();

    // 1. Greetings
    if (
      query === "salut" || 
      query === "bonjour" || 
      query === "hello" || 
      query === "hi" || 
      query === "hey" ||
      query === "yo" ||
      query.startsWith("bonjour") ||
      query.startsWith("salut")
    ) {
      return isEn
        ? "Hello! I am the **Haitian D.E.V.** AI assistant. How can I help you build or learn today? 🚀"
        : "Bonjour ! Je suis l'assistant IA de **Haitian D.E.V.** Comment puis-je vous aider dans vos projets ou votre apprentissage aujourd'hui ? 🚀";
    }

    // 2. Founders check
    if (
      query.includes("fondateur") || 
      query.includes("founder") || 
      query.includes("cadet") ||
      query.includes("créé") ||
      query.includes("cree") ||
      query.includes("created")
    ) {
      return isEn 
        ? "They are the Cadet brothers: **Cadet John Kervensley** and **Cadet John Darvensley**. Under their vision, Haitian D.E.V. has grown into a premier technology hub."
        : "Ce sont les frères Cadet : **Cadet John Kervensley** et **Cadet John Darvensley**. Sous leur vision, Haitian D.E.V. est devenu un pôle d'excellence technologique de premier plan.";
    }

    // 3. Services check
    if (
      query.includes("service") || 
      query.includes("proposez-vous") || 
      query.includes("offrez-vous") || 
      query.includes("what do you do") ||
      query.includes("what you do") ||
      query.includes("prestations")
    ) {
      return isEn
        ? "We offer elite technical services:\n- [Web Development](/services/web-design) (high-end websites & SaaS)\n- [Mobile Applications](/services/app-dev) (iOS & Android)\n- [AI & Automation](/services/ai-automation) (smart workflows)\n- [Game Development](/services/game-dev) (interactive experiences)\n\nExplore [All our services](/services) to discover our full capabilities!"
        : "Nous offrons des services techniques d'élite :\n- [Développement Web](/services/web-design) (SaaS & sites haut de gamme)\n- [Applications Mobiles](/services/app-dev) (iOS & Android sur mesure)\n- [IA & Automatisation](/services/ai-automation) (processus intelligents)\n- [Développement de Jeux](/services/game-dev) (expériences interactives)\n\nExplorez [Tous nos services](/services) pour découvrir l'ensemble de nos compétences !";
    }

    // 4. Projects check
    if (
      query.includes("projet") || 
      query.includes("project") || 
      query.includes("portfolio") || 
      query.includes("réalisation") ||
      query.includes("realisation") ||
      query.includes("work")
    ) {
      return isEn
        ? "We have delivered outstanding results for global partners. Discover our premium work in our [Portfolio](/portfolio) and explore our project [Gallery](/gallery)!"
        : "Nous avons réalisé des projets d'exception pour des partenaires internationaux. Découvrez nos travaux dans notre [Portfolio](/portfolio) et explorez notre [Galerie](/gallery) !";
    }

    // 5. Contact check
    if (
      query.includes("contact") || 
      query.includes("joindre") || 
      query.includes("reach") || 
      query.includes("écrire") ||
      query.includes("ecrire") ||
      query.includes("email") ||
      query.includes("téléphone") ||
      query.includes("telephone") ||
      query.includes("phone")
    ) {
      return isEn
        ? "You can connect with us directly or submit your requests through our official channels. Log in via our [Connexion](/login) page to access support and track your projects!"
        : "Vous pouvez nous joindre directement ou soumettre vos demandes via nos canaux officiels. Connectez-vous sur notre page de [Connexion](/login) pour soumettre des tickets et suivre vos projets !";
    }

    // 6. Training / Academy check
    if (
      query.includes("formation") || 
      query.includes("training") || 
      query.includes("cours") || 
      query.includes("apprendre") ||
      query.includes("apprenant") ||
      query.includes("académie") ||
      query.includes("academie") ||
      query.includes("étudiant") ||
      query.includes("etudiant") ||
      query.includes("student")
    ) {
      return isEn
        ? "Haitian D.E.V. Academy is a premier training program for future tech leaders. Visit our [Training](/training) section to check out our curriculum or log in via our [Connexion](/login) page!"
        : "La Haitian D.E.V. Academy forme la prochaine génération de leaders technologiques. Visitez notre section [Formations](/training) pour explorer nos programmes ou connectez-vous via notre page de [Connexion](/login) !";
    }

    // 7. Events / Hackathon
    if (
      query.includes("événement") || 
      query.includes("evenement") || 
      query.includes("event") || 
      query.includes("hackathon") ||
      query.includes("bootcamp") ||
      query.includes("séminaire") ||
      query.includes("seminaire")
    ) {
      return isEn
        ? "We actively host bootcamps, tech events, and high-energy hackathons. Check our upcoming tech [Events](/events)!"
        : "Nous organisons régulièrement des bootcamps, des séminaires et des hackathons. Découvrez nos prochains [Événements](/events) tech !";
    }

    // 8. Location / HQ
    if (
      query.includes("adresse") ||
      query.includes("où") ||
      query.includes("ou est") ||
      query.includes("where") ||
      query.includes("location") ||
      query.includes("haiti") ||
      query.includes("petion-ville") ||
      query.includes("pétion-ville") ||
      query.includes("bureau") ||
      query.includes("office")
    ) {
      return isEn
        ? "Haitian D.E.V. is proud to be based in **Haiti** (Pétion-Ville). We operate globally but remain deeply rooted in our community to build the local tech ecosystem."
        : "Haitian D.E.V. est fièrement basé en **Haïti** (Pétion-Ville). Nous travaillons à l'international tout en restant profondément ancrés dans notre communauté pour propulser l'écosystème tech local.";
    }

    // 9. Pricing / Cost
    if (
      query.includes("prix") ||
      query.includes("tarif") ||
      query.includes("devis") ||
      query.includes("combien") ||
      query.includes("cost") ||
      query.includes("price") ||
      query.includes("budget")
    ) {
      return isEn
        ? "Every project has unique requirements. To get a precise quote tailored to your budget and objectives, please register on our [Inscription](/signup) page and log in to submit a quote request!"
        : "Chaque projet est unique. Pour obtenir un devis précis adapté à votre budget et vos objectifs, inscrivez-vous sur notre page d'[Inscription](/signup) puis connectez-vous pour soumettre votre demande !";
    }

    // 10. Careers / Recruitment
    if (
      query.includes("recrutement") ||
      query.includes("job") ||
      query.includes("stage") ||
      query.includes("carrière") ||
      query.includes("carriere") ||
      query.includes("recrutez") ||
      query.includes("career") ||
      query.includes("work with you")
    ) {
      return isEn
        ? "We are always looking for passionate creators, developers, and designers to join our elite team. Reach out via our social channels or [About Us](/about-us) to discover current opportunities!"
        : "Nous recherchons toujours des créateurs, développeurs et designers passionnés pour rejoindre notre équipe d'élite. Contactez-nous via nos réseaux ou visitez [À propos](/about-us) !";
    }

    return null;
  };

  // Suggested prompts
  const suggestions = isEn
    ? [
        "Who are the founders?",
        "What services do you offer?",
        "Tell me about your projects.",
        "How can I contact you?",
        "Do you offer tech training?",
      ]
    : [
        "Qui sont les fondateurs ?",
        "Quels services proposez-vous ?",
        "Parlez-moi de vos projets.",
        "Comment vous contacter ?",
        "Proposez-vous des formations ?",
      ];

  // Load initial welcome message
  useEffect(() => {
    const welcomeText = isEn
      ? "Hello! I am the Haitian D.E.V. AI assistant. How can I help you today? You can ask me about our high-end web, mobile, and AI solutions, or our training programs."
      : "Bonjour ! Je suis l'assistant IA de Haitian D.E.V. Comment puis-je vous aider aujourd'hui ? Posez-moi vos questions sur nos solutions web, mobiles, d'IA de pointe ou nos formations.";
    
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: welcomeText,
        timestamp: new Date(),
      },
    ]);
  }, [isEn]);

  const handleResetChat = () => {
    const welcomeText = isEn
      ? "Hello! I am the Haitian D.E.V. AI assistant. How can I help you today? You can ask me about our high-end web, mobile, and AI solutions, or our training programs."
      : "Bonjour ! Je suis l'assistant IA de Haitian D.E.V. Comment puis-je vous aider aujourd'hui ? Posez-moi vos questions sur nos solutions web, mobiles, d'IA de pointe ou nos formations.";
    
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: welcomeText,
        timestamp: new Date(),
      },
    ]);
    setInputText("");
    setHasError(false);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setHasError(false);
    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Check for instant local match to make response lightning fast
    const localReply = getLocalResponse(textToSend, isEn);
    if (localReply) {
      setTimeout(() => {
        const botMessage: Message = {
          id: Math.random().toString(),
          sender: "bot",
          text: localReply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 400); // 400ms feels completely natural while being virtually instant
      return;
    }

    try {
      // Gather conversation history
      const history = messages
        .filter((msg) => msg.id !== "welcome")
        .map((msg) => ({
          role: msg.sender === "bot" ? "assistant" : "user",
          content: msg.text,
        }));
      
      // Append latest message
      history.push({
        role: "user",
        content: textToSend,
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to fetch response from server";
        try {
          const errorData = await response.json();
          if (errorData.error) errorMsg = errorData.error;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Chat error:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-[calc(100vw-32px)] sm:w-[380px] h-[520px] bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col mb-4 relative"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-1/2 h-20 bg-gradient-to-r from-blue-500/10 to-red-500/10 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative px-6 py-4 bg-zinc-900/40 border-b border-zinc-900 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-red-600 flex items-center justify-center text-white shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-950 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-sm tracking-tight text-white">Haitian D.E.V. AI</span>
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Active Assistant</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetChat}
                  title={isEn ? "Reset chat" : "Réinitialiser la discussion"}
                  className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto px-6 py-5 space-y-4 modal-scrollbar flex flex-col bg-zinc-950/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                        : "bg-zinc-900/80 border border-zinc-800/60 text-zinc-200 rounded-bl-none"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{renderFormattedText(msg.text)}</div>
                    <span className="block text-[9px] mt-1.5 opacity-40 text-right font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Suggestions chips when there are no user messages yet */}
              {messages.length === 1 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-500 block px-1">
                    {isEn ? "Suggested Questions" : "Questions suggérées"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s)}
                        className="text-xs px-3 py-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all duration-200 text-left cursor-pointer active:scale-95"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Typing/Loading State */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900/80 border border-zinc-800/60 text-zinc-400 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-2">
                    <span className="text-xs font-mono">{isEn ? "AI is thinking" : "L'IA réfléchit"}</span>
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {hasError && (
                <div className="flex justify-center pt-2">
                  <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {isEn
                        ? "An error occurred. Please try again."
                        : "Une erreur est survenue. Veuillez réessayer."}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-zinc-900/20 border-t border-zinc-900/60 backdrop-blur-md">
              <div className="relative flex items-center bg-zinc-900/80 border border-zinc-800 rounded-full focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-700 transition-all duration-300 px-4 py-1.5">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isEn ? "Ask a question..." : "Posez une question..."}
                  className="flex-grow bg-transparent text-sm text-white focus:outline-none placeholder-zinc-500 pr-10"
                />
                <button
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim() || isLoading}
                  className="absolute right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-red-600 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(59,130,246,0.35)] hover:shadow-[0_6px_25px_rgba(239,68,68,0.5)] cursor-pointer overflow-hidden group"
      >
        {/* Glow inner layer */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-zinc-950 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-zinc-950" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
