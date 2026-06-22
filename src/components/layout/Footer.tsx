import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Twitter, Linkedin, Heart, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const sections = [
    {
      title: "Navbar",
      links: [
        { name: "Accueil", path: "/" },
        { name: "Company", path: "/about-us" },
        { name: "Services", path: "/services" },
        { name: "Education", path: "/training" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "Portfolio", path: "/portfolio" },
        { name: "Processus", path: "/process" },
        { name: "Apropos", path: "/about-us" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Développement Web", path: "/services/web-design" },
        { name: "Application Mobile", path: "/services/app-dev" },
        { name: "Solution IA", path: "/services/ai-automation" },
        { name: "Jeu Vidéo", path: "/services/game-dev" }
      ]
    },
    {
      title: "Education",
      links: [
        { name: "Formation", path: "/training" },
        { name: "Blog", path: "/blog" },
        { name: "Docs", path: "/docs" }
      ]
    }
  ];

  return (
    <footer className="relative bg-[#0A0C10] border-t border-white/5 overflow-hidden pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Logo Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="https://i.postimg.cc/xT9tmPsn/haitiandev-(1).png" 
                alt="Haitian D.E.V. Logo" 
                className="w-9 h-9 object-contain rounded-lg drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform duration-200"
                referrerPolicy="no-referrer"
              />
              <span className="font-display font-bold text-lg tracking-tight text-white">
                <span className="text-blue-500">Haitian</span><span className="text-red-500 font-extrabold"> D.E.V.</span>
              </span>
            </Link>
            
            <p className="text-zinc-400 text-sm max-w-sm font-sans leading-relaxed">
              {t("footer.tagline")}
            </p>

            <div className="flex space-x-3">
              <a 
                href="https://x.com/DevHaitian" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors duration-250"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/haitian-dev-469856405" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors duration-250"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/devhaitian" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors duration-250"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/haitian_dev?igsh=ZHZyM3NsOHd2a3Jy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors duration-250"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          {sections.map((sec) => (
            <div key={sec.title} className="flex flex-col space-y-4 transition-transform duration-300 hover:-translate-y-1.5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
                {sec.title}
              </h4>
              <ul className="space-y-3">
                {sec.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                      <span className="font-display">{link.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright & tagline */}
        <div className="border-t border-zinc-900 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-600">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p>© {currentYear} Haitian D.E.V. {t("footer.all_rights_reserved")}</p>
            <span className="hidden md:inline text-zinc-800">|</span>
            <div className="flex items-center space-x-4">
              <Link to="/privacy-policy" className="hover:text-blue-500 transition-colors duration-200">
                Privacy Policy
              </Link>
              <span className="text-zinc-800">|</span>
              <Link to="/terms-of-service" className="hover:text-blue-500 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/admin" className="opacity-0 p-1">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
