import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { fr } from "./fr";
import { en } from "./en";

// Retrieve saved preference or default to french
const savedLang = localStorage.getItem("haitiandev_lang") || "FR";
const defaultLng = savedLang.toLowerCase() === "en" ? "en" : "fr";

// Load custom live modifications if any
let customFr = {};
let customEn = {};
try {
  const storedFr = localStorage.getItem("haitiandev_custom_fr");
  const storedEn = localStorage.getItem("haitiandev_custom_en");
  if (storedFr) customFr = JSON.parse(storedFr);
  if (storedEn) customEn = JSON.parse(storedEn);
} catch (e) {
  console.error("Failed to parse custom local translation overrides", e);
}

// Deep merge helper
function deepMerge(target: any, source: any) {
  if (!source || typeof source !== 'object') return target;
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && key in target) {
      target[key] = deepMerge({ ...target[key] }, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

const finalFr = deepMerge({ ...fr }, customFr);
const finalEn = deepMerge({ ...en }, customEn);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: finalFr },
      en: { translation: finalEn }
    },
    lng: defaultLng,
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false // React scales against XSS natively
    }
  });

export default i18n;
