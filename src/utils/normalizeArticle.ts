export interface NormalizedBlogItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  bannerUrl: string;
  tags: string[];
}

export const normalizeArticle = (article: any): NormalizedBlogItem => {
  if (!article) {
    return {
      id: "",
      title: "",
      slug: "",
      summary: "",
      content: "",
      date: "",
      category: "",
      readTime: "",
      author: {
        name: "HaitianDev Team",
        role: "Rédacteur d'élite",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      },
      bannerUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
      tags: []
    };
  }

  const id = article.id || "";
  
  // Handlers for "titre de la publication", "titre", or "title"
  const title = article.title || 
                article.titre || 
                article.titrePublication || 
                article["titre de la publication"] || 
                article["tite de la publication"] || 
                "Sans titre";

  const slug = article.slug || 
               article.slugId || 
               (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id);

  // Handlers for "resume den tet", "summary", "chapeau"
  const summary = article.summary || 
                  article.resume || 
                  article.resume_den_tet || 
                  article["resume den tet"] || 
                  article["résumé"] || 
                  article.chapeau || 
                  "";

  // Handlers for "contenu rincipal de article", "content", "contenu"
  const content = article.content || 
                  article.contenu || 
                  article.contenu_principal || 
                  article["contenu rincipal de article"] || 
                  article["contenu principal"] || 
                  "";

  // Handlers for "date publication", "date"
  const date = article.date || 
               article.datePublication || 
               article.date_publication || 
               article["date publication"] || 
               "";

  // Handlers for "temp de lecture", "readTime", "tempsLecture"
  const readTime = article.readTime || 
                   article.tempsLecture || 
                   article.temp_de_lecture || 
                   article["temp de lecture"] || 
                   article["temps de lecture"] || 
                   article.readingTime || 
                   "5 min de lecture";

  // Handlers for "indexation et ,ot cle", "indexation", "category"
  const category = article.category || 
                   article.indexation || 
                   article.indexation_et_mot_cle || 
                   article["indexation"] || 
                   article["indexation et mot cle"] || 
                   (article.tags && Array.isArray(article.tags) && article.tags[0]) || 
                   "STUDIO";

  // Author parsing
  let authorObj = {
    name: "HaitianDev Team",
    role: "Rédacteur d'élite",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
  };

  const parsedAuthorStr = article.author || article.auteur || article["auteur"];
  if (parsedAuthorStr) {
    if (typeof parsedAuthorStr === 'object') {
      authorObj.name = parsedAuthorStr.name || parsedAuthorStr.auteur || parsedAuthorStr.name || "HaitianDev Team";
      authorObj.role = parsedAuthorStr.role || authorObj.role;
      authorObj.avatar = parsedAuthorStr.avatar || authorObj.avatar;
    } else if (typeof parsedAuthorStr === 'string') {
      authorObj.name = parsedAuthorStr;
    }
  }

  // Handle image URLs
  const bannerUrl = article.bannerUrl || 
                    article.urlImage || 
                    article.imageUrl || 
                    article.url_de_l_image || 
                    article["url de limage"] || 
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200";

  // Handle tags list
  const tags = article.tags && Array.isArray(article.tags)
    ? article.tags
    : (category ? [category] : []);

  return {
    id,
    title,
    slug,
    summary,
    content,
    date,
    readTime,
    category,
    author: authorObj,
    bannerUrl,
    tags
  };
};
