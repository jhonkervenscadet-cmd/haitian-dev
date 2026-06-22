import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: "website" | "article" | "profile" | "product";
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
  publishedTime?: string;
  author?: string;
  keywords?: string | string[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalPath,
  ogType = "website",
  ogImage = "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200&h=630",
  schema,
  publishedTime,
  author,
  keywords,
}) => {
  const { pathname } = useLocation();

  // Primary URL base
  const origin = window.location.origin || "https://haitiandev.com";
  const canonicalUrl = canonicalPath 
    ? `${origin}${canonicalPath}` 
    : `${origin}${pathname}`;

  useEffect(() => {
    // 1. Title (Clean under 60 chars)
    const formattedTitle = title.length > 60 ? title.substring(0, 57) + "..." : title;
    document.title = formattedTitle;

    // 2. Head Tags Injector Helper
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    const setOrCreateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (element) {
        element.setAttribute("href", href);
      } else {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        element.setAttribute("href", href);
        document.head.appendChild(element);
      }
    };

    // 3. Set Base Attributes
    setMetaTag("name", "description", description);
    setOrCreateLinkTag("canonical", canonicalUrl);

    if (keywords) {
      const keywordsStr = Array.isArray(keywords) ? keywords.join(", ") : keywords;
      setMetaTag("name", "keywords", keywordsStr);
    }

    // 4. Open Graph Tags (Facebook / LinkedIn / Slack)
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:site_name", "HaitianDev");

    if (publishedTime) {
      setMetaTag("property", "article:published_time", publishedTime);
    }
    if (author) {
      setMetaTag("property", "article:author", author);
    }

    // 5. Twitter Cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);

    // 6. Language Indicator
    document.documentElement.lang = "fr";

    // 7. Inject JSON-LD Schema
    const existingScript = document.getElementById("seo-schema-jsonld");
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement("script");
      script.id = "seo-schema-jsonld";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    // Dynamic clean-up when component unmounts
    return () => {
      const jsonLdScript = document.getElementById("seo-schema-jsonld");
      if (jsonLdScript) {
        jsonLdScript.remove();
      }
    };
  }, [title, description, canonicalUrl, ogType, ogImage, schema, publishedTime, author, keywords]);

  return null;
};
