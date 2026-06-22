import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Hexagon, Triangle, Box, Circle, Target, Layers, Activity, Users, Star, Shield, Zap, Sparkles, Building, Rocket, Code2, Cloud } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { loadCollection, subscribeToCollection } from "../../utils/firebaseSync";

const ICONS_MAP: Record<string, any> = {
  Globe, Hexagon, Triangle, Box, Circle, Target, Layers, Activity, Users, Star, Shield, Zap, Sparkles, Building, Rocket, Code2, Cloud
};

export const defaultPartnersData = [
  { id: '1', name: 'TechNova', icon: 'Globe', color: 'text-blue-500' },
  { id: '2', name: 'AcmeCorp', icon: 'Hexagon', color: 'text-red-500' },
  { id: '3', name: 'Nexus', icon: 'Triangle', color: 'text-emerald-500' },
  { id: '4', name: 'Stellar', icon: 'Box', color: 'text-purple-500' },
  { id: '5', name: 'Orbit', icon: 'Circle', color: 'text-orange-500' },
  { id: '6', name: 'Apex', icon: 'Target', color: 'text-cyan-500' },
  { id: '7', name: 'Vertex', icon: 'Layers', color: 'text-pink-500' },
  { id: '8', name: 'Pulse', icon: 'Activity', color: 'text-yellow-500' },
];

export const Partners: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [partnersData, setPartnersData] = useState(() => {
    const raw = localStorage.getItem("haitiandev_partners");
    let parsed = defaultPartnersData;
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        parsed = defaultPartnersData;
      }
    }
    return parsed.map((p: any) => ({ ...p, id: String(p.id) }));
  });

  useEffect(() => {
    const initLoad = async () => {
      const data = await loadCollection<any>("partners", "haitiandev_partners", defaultPartnersData);
      setPartnersData(data);
    };
    initLoad();

    const unsubscribe = subscribeToCollection<any>("partners", "haitiandev_partners", (data) => {
      setPartnersData(data);
    }, defaultPartnersData);

    const handleStorageChange = () => {
      const raw = localStorage.getItem("haitiandev_partners");
      if (raw) {
        try {
          setPartnersData(JSON.parse(raw));
        } catch (e) {}
      }
    };
    window.addEventListener("haitian_partners_updated", handleStorageChange);
    return () => {
      unsubscribe();
      window.removeEventListener("haitian_partners_updated", handleStorageChange);
    };
  }, []);


  // De-duplicate by id to guarantee no duplicate logos are rendered
  const uniquePartners = Array.from(new Map(partnersData.map((p: any) => [String(p.id), p])).values());

  return (
    <section className="py-12 relative bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="mb-12">
          <SectionHeading
            overline={isEn ? "NETWORK" : "RÉSEAU"}
            title={isEn ? "Our Partners" : "Nos Partenaires"}
            align="center"
            className="border-none pb-0 text-center"
          />
        </div>

        {/* Partners Container */}
        <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#00209F] to-[#D21034] p-[1px] group">
          <div className="relative w-full rounded-2xl bg-slate-950 sm:bg-slate-900/80 backdrop-blur-md p-8 md:p-12 overflow-hidden">
            
            {/* Centered Wrap of Unique Logos */}
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16 md:gap-y-10">
              {uniquePartners.map((partner: any) => {
                const Icon = ICONS_MAP[partner.icon] || Globe;
                const Element = partner.websiteUrl ? 'a' : 'div';
                const extraProps = partner.websiteUrl ? {
                  href: partner.websiteUrl,
                  target: "_blank",
                  rel: "noopener noreferrer"
                } : {};
                
                return (
                  <Element 
                    key={`partner-${partner.id}`}
                    className="flex items-center justify-center grayscale opacity-65 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                    {...extraProps}
                  >
                    {partner.logoUrl ? (
                      <img 
                        src={partner.logoUrl} 
                        alt={partner.name} 
                        referrerPolicy="no-referrer"
                        className="h-8 max-w-[110px] object-contain mr-2.5 filter brightness-100"
                        onError={(e) => {
                          // If load fails, hide image and show standard backup icon
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Icon className={`w-7 h-7 mr-2.5 ${partner.color || 'text-[#00209F]'}`} />
                    )}
                    <span className="font-display font-semibold text-lg md:text-xl tracking-wide text-white">{partner.name}</span>
                  </Element>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

