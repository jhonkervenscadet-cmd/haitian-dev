import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    genAIClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json({ limit: "50mb" }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format. Expected an array." });
      }

      const ai = getGenAI();

      // Map the messages to GenAI format: { role: string, parts: [{ text: string }] }
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const systemInstruction = `You are the elite Haitian D.E.V. AI Chatbot assistant.
Haitian D.E.V. is a premier high-end tech studio based in Haiti specializing in creating world-class web applications, mobile apps, and custom AI/automation systems.
We also provide elite tech training and organize premium tech events.

Your goal is to answer users' questions in a helpful, friendly, and highly professional manner.
Respond in the language the user speaks to you (usually French or English).
Keep your responses relatively concise, structured, and easy to read. Be engaging, polite, and proud of Haitian D.E.V.'s craftsmanship.

INFORMATION SUR LES FONDATEURS (CRITICAL):
Si l'utilisateur vous demande qui sont les fondateurs ou qui a créé Haitian D.E.V. (en français ou anglais), vous devez impérativement répondre que ce sont les frères Cadet : Cadet John Kervensley et Cadet John Darvensley.
If asked about the founders in English, reply that they are the Cadet brothers: Cadet John Kervensley and Cadet John Darvensley.

CRITICAL INSTRUCTION FOR LINKS:
Whenever you mention our pages, services, or sections, you MUST use standard markdown link format: [Label](path) so the front-end can convert it into a direct clickable navigation link. NEVER use full URLs for internal links. Only use relative paths starting with /:
- [Accueil](/) - Notre page principale.
- [À propos](/about-us) - Qui nous sommes, notre histoire et notre équipe d'élite.
- [Partenaires](/partners) - Les entreprises et organisations qui nous font confiance.
- [Tous nos services](/services) - Aperçu complet de nos compétences techniques.
- [Développement Web](/services/web-design) - Création de sites internet et applications SaaS haut de gamme.
- [Applications Mobiles](/services/app-dev) - Conception d'applications mobiles iOS et Android sur mesure.
- [IA & Automatisation](/services/ai-automation) - Solutions d'intelligence artificielle et d'automatisation de processus.
- [Développement de Jeux](/services/game-dev) - Création de jeux vidéo interactifs.
- [Portfolio](/portfolio) - Nos réalisations et projets récents en détail.
- [Galerie](/gallery) - Photos de nos activités, locaux et événements.
- [Notre Processus](/process) - Comment nous gérons les projets de bout en bout (méthodologie agile).
- [Blog](/blog) - Nos derniers articles de blog, actualités tech et tutoriels.
- [Documentation](/docs) - Nos manuels, guides de démarrage et specs.
- [Formations](/training) - Notre académie pour former la prochaine génération de leaders de la tech.
- [Événements](/events) - Nos prochains hackathons, bootcamps et séminaires tech.
- [Connexion](/login) - Accéder à votre compte.
- [Inscription](/signup) - Créer un compte client ou étudiant.

SECURITY & PRIVACY DIRECTIVE (CRITICAL):
You MUST NEVER share, leak, or mention any link or path to any client dashboard, client portal, student dashboard, or admin panel. Under no circumstances should you output paths like "/client-portal", "/dashboard", or "/admin". If users ask to access their dashboard or personal spaces, tell them to log in via the Connexion page (/login) first or use the official header/navigation menu of the website. Never give direct dashboard links.

Ensure you integrate these links smoothly and naturally inside your answers whenever a user asks about services, training, contacting us, projects, or our team!`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: { systemInstruction },
        });
      } catch (geminiError: any) {
        console.warn("Primary model gemini-3.5-flash failed or experienced high demand. Trying fallback gemini-flash-latest...", geminiError);
        try {
          response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: contents,
            config: { systemInstruction },
          });
        } catch (fallbackError: any) {
          console.error("All fallback models failed:", fallbackError);
          throw fallbackError;
        }
      }

      const reply = response.text || "Désolé, je n'ai pas pu générer de réponse.";
      res.json({ reply });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "An error occurred while generating a response." });
    }
  });

  app.post("/api/generate-article", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const ai = getGenAI();
      const systemInstruction = `You are an expert technical writer and blogger. Generate a well-structured, professional article based on the user's prompt. Use markdown formatting. Write in the same language as the prompt.`;
      
      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: { systemInstruction },
        });
      } catch (geminiError: any) {
        console.warn("Primary model failed, falling back to gemini-flash-latest...", geminiError);
        try {
          response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
            config: { systemInstruction },
          });
        } catch (fallbackError: any) {
          console.error("All fallback models failed:", fallbackError);
          throw fallbackError;
        }
      }

      const text = response.text || "Désolé, je n'ai pas pu générer l'article.";
      res.json({ text });
    } catch (error: any) {
      console.error("Generate article error:", error);
      res.status(500).json({ error: error.message || "An error occurred while generating the article." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
