import { GoogleGenAI } from "@google/genai";

export async function handler(event: any) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body || "{}");
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid messages format. Expected an array." }),
      };
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GEMINI_API_KEY environment variable is missing in Netlify settings." }),
      };
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Map the messages to Gemini GenAI format
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
- [Portail Étudiant](/dashboard) - Espace personnel pour nos apprenants.
- [Espace Client](/client-portal) - Suivi de vos projets, devis et tickets d'assistance.

Ensure you integrate these links smoothly and naturally inside your answers whenever a user asks about services, training, contacting us, projects, or our team!`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: { systemInstruction },
      });
    } catch (geminiError: any) {
      console.warn("Primary model gemini-3.5-flash failed or experienced high demand. Trying fast fallback model gemini-3.1-flash-lite...", geminiError);
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: contents,
          config: { systemInstruction },
        });
      } catch (liteError: any) {
        console.warn("Lite fallback model gemini-3.1-flash-lite failed or busy. Trying final fallback gemini-flash-latest...", liteError);
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
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reply: response.text || "Désolé, je n'ai pas pu générer de réponse." }),
    };
  } catch (error: any) {
    console.error("Netlify Gemini function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "An error occurred while generating a response." }),
    };
  }
}
