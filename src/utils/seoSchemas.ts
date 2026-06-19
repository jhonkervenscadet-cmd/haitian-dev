/**
 * Highly optimized JSON-LD Schema.org Generators for HaitianDev
 * Ensures rich results (snippets) in search engine ranking.
 */

// Global Organization Schema
export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "HaitianDev",
    "image": "https://i.postimg.cc/MTCfPytf/haitiandev.png",
    "@id": "https://haitiandev.com/#organization",
    "url": "https://haitiandev.com",
    "telephone": "+509-3400-0000",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Route de Delmas",
      "addressLocality": "Port-au-Prince",
      "addressRegion": "Ouest",
      "postalCode": "HT6110",
      "addressCountry": "HT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.5392,
      "longitude": -72.3364
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://facebook.com/haitiandev",
      "https://linkedin.com/company/haitiandev",
      "https://twitter.com/haitiandev",
      "https://github.com/haitiandev"
    ]
  };
};

// Services (Product / Service List) Schema
export const getServicesSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Développement Web, Logiciel, Application Mobile & Intelligence Artificielle d'élite",
    "provider": {
      "@type": "ProfessionalService",
      "name": "HaitianDev",
      "url": "https://haitiandev.com"
    },
    "areaServed": "HT",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services Technologiques HaitianDev",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Développement Web d'Élite",
            "description": "Création d'applications web de haute performance adaptées aux besoins de la diaspora et des grandes entreprises en Haïti."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Applications Mobiles Cross-Platform",
            "description": "Applications natives iOS et Android de classe mondiale, optimisées pour les réseaux locaux (MonCash, Natcash, mode hors-ligne)."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Intelligence Artificielle & Automatisation",
            "description": "Sûreté d'implémentation de modèles d'IA, analyse de données complexes et automatisation robotisée des processus d'affaires."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Jeux Vidéos & Multimédia Interactif",
            "description": "Création et design de jeux 2D/3D immersifs, moteurs de jeu et expériences éducatives ludiques."
          }
        }
      ]
    }
  };
};

// Individual Service Detailed Schema
export const getDetailedServiceSchema = (name: string, description: string, url: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://haitiandev.com${url}#service`,
    "name": name,
    "description": description,
    "provider": {
      "@type": "ProfessionalService",
      "name": "HaitianDev",
      "url": "https://haitiandev.com"
    },
    "areaServed": ["HT", "US", "CA", "FR"],
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "url": `https://haitiandev.com${url}`
    }
  };
};

// Course / Training list schema
export const getTrainingSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Formations Professionnelles d'Élite par HaitianDev",
    "description": "Formations intensives en ingénierie logicielle, intelligence artificielle et design d'expérience utilisateur.",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Course",
          "name": "Fullstack Web & Mobile Bootcamp",
          "description": "Maîtrisez React, Tailwind, Express, Postgres et l'intégration MonCash/Natcash en 12 semaines.",
          "provider": {
            "@type": "Organization",
            "name": "HaitianDev Academy",
            "sameAs": "https://haitiandev.com"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Course",
          "name": "Introduction à l'Intelligence Artificielle & Générative",
          "description": "Apprenez à développer avec le SDK @google/genai, connecter des LLMs et créer des moteurs d'automatisation.",
          "provider": {
            "@type": "Organization",
            "name": "HaitianDev Academy",
            "sameAs": "https://haitiandev.com"
          }
        }
      }
    ]
  };
};

// Blog Posts list schema
export const getBlogListSchema = (posts: Array<{ title: string; desc: string; url: string; date: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Le Blog d'Actualités Tech de HaitianDev",
    "description": "Analyses pointues sur l'intelligence artificielle, l'ingénierie web, la formation et l'inclusion fintech en Haïti.",
    "publisher": {
      "@type": "Organization",
      "name": "HaitianDev",
      "logo": "https://i.postimg.cc/MTCfPytf/haitiandev.png"
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.desc,
      "url": `https://haitiandev.com${post.url}`,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": "Équipe Éditoriale HaitianDev"
      }
    }))
  };
};
