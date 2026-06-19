import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { AnimatedGlassCard } from "../ui/AnimatedGlassCard";
import { loadCollection, subscribeToCollection } from "../../utils/firebaseSync";

interface TestimonialItem {
  id: string;
  name: string;
  roleCompany: string;
  quote: string;
  avatarUrl: string;
  rating?: number;
}

export const Testimonials: React.FC = () => {
  const { t, i18n } = useState(() => {
    // We will pull the language inside the component standard
  }) && useTranslation();
  const isEn = i18n?.language === "en";

  const defaultTestimonials: TestimonialItem[] = [
    {
      id: "1",
      name: "Frantz Desrosiers",
      roleCompany: "CEO @ AyitiPay",
      quote: isEn
        ? "Their local webhook implementation and dedication are absolute."
        : "Leur dévouement technique et leur gestion des webhooks locaux est d'une fiabilité absolue.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
      rating: 5
    },
    {
      id: "2",
      name: "Mireille Laleau",
      roleCompany: "Product Director @ AgriTech",
      quote: isEn
        ? "They transformed our Figma design into a flawless product in record time."
        : "Ils ont transformé notre maquette Figma en un produit interactif parfait en un temps record.",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
      rating: 5
    },
    {
      id: "3",
      name: "Jameson C.",
      roleCompany: "CTO, Global Ship",
      quote: isEn 
        ? "Their AI and web expertise transformed our operations." 
        : "Leur expertise IA et web a transformé notre opérationnel.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
      rating: 5
    }
  ];

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(defaultTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const initLoad = async () => {
      const data = await loadCollection<TestimonialItem>("testimonials", "haitiandev_testimonials", defaultTestimonials);
      if (data && data.length > 0) {
        setTestimonials(data);
      }
    };
    initLoad();

    const unsubscribe = subscribeToCollection<TestimonialItem>("testimonials", "haitiandev_testimonials", (data) => {
      if (data && data.length > 0) {
        setTestimonials(data);
      }
    }, defaultTestimonials);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isHovered || testimonials.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered, testimonials.length]);

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const activeIndex = currentIndex >= testimonials.length ? 0 : currentIndex;
  const currentTestimonial = testimonials[activeIndex];

  return (
    <section className="py-24 relative bg-transparent border-t border-white/5">
      {/* SVG definition for the brand gradient fill (from-blue-500 to-red-500) */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Custom Header for Testimonials to support exact colors */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-12 lg:mb-16 w-full text-center flex flex-col items-center"
        >
          <span className="font-mono text-xs font-bold text-gray-500 uppercase tracking-[0.25em] block">
            {isEn ? "TESTIMONIALS" : "RETOURS D'EXPÉRIENCE"}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)] tracking-wide leading-tight">
            {isEn ? "They Trust Us" : "Ils nous font confiance"}
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="max-w-4xl mx-auto relative px-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {currentTestimonial && (
            <AnimatedGlassCard className="p-8 sm:p-14 text-center min-h-[300px] flex flex-col justify-center animate-fade-in" hoverable={false}>
              {/* Quote marks */}
              <span className="absolute top-6 left-6 sm:top-10 sm:left-10 text-6xl font-serif text-blue-500/10 leading-none pointer-events-none">“</span>
              <span className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 text-6xl font-serif text-red-900/10 leading-none pointer-events-none">”</span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex flex-col items-center space-y-6"
                >
                  {/* 5 Stars */}
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 transition-transform duration-300 hover:scale-110" 
                        stroke="url(#star-gradient)" 
                        fill="url(#star-gradient)" 
                        strokeWidth={1}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-xl sm:text-2xl text-zinc-100 font-sans italic leading-relaxed max-w-2xl mx-auto">
                    {currentTestimonial.quote}
                  </p>

                  {/* Author Info */}
                  <div className="space-y-1 mt-6 flex flex-col items-center">
                    {currentTestimonial.avatarUrl && (
                      <img 
                        src={currentTestimonial.avatarUrl} 
                        alt={currentTestimonial.name} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full border border-white/10 shadow-lg object-cover mb-2"
                      />
                    )}
                    <h5 className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-wider">
                      {currentTestimonial.name}
                    </h5>
                    <p className="text-xs sm:text-sm font-mono text-zinc-500 uppercase">
                      {currentTestimonial.roleCompany}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </AnimatedGlassCard>
          )}

          {/* Navigation Controls and Indicators */}
          <div className="flex items-center justify-center space-x-6 mt-10">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white transition-all duration-300 cursor-pointer"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-500 rounded-full cursor-pointer ${
                    idx === activeIndex 
                      ? 'w-6 h-2 sm:w-8 sm:h-2 bg-gradient-to-r from-[#002f6c] to-[#c8102e] shadow-[0_0_10px_rgba(200,16,46,0.4)]' 
                      : 'w-2 h-2 sm:w-2 sm:h-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white transition-all duration-300 cursor-pointer"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Interactive Google Business Review CTA bottom section */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-16 flex flex-col items-center text-center space-y-3"
          >
            <div className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
              {isEn ? "Satisfied with our elite services?" : "Satisfait de nos services d'élite ?"}
            </div>
            
            <RatingBlock isEn={isEn} />
          </motion.div>
        </div>
        
      </div>
    </section>
  );
};

const RatingBlock: React.FC<{ isEn: boolean }> = ({ isEn }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const googleBusinessUrl = (() => {
    try {
      return localStorage.getItem("haitiandev_google_business_url") || "https://search.google.com/local/writereview?placeid=ChIJ8-c6lreBWjDRNgsymveYefw";
    } catch {
      return "https://search.google.com/local/writereview?placeid=ChIJ8-c6lreBWjDRNgsymveYefw";
    }
  })();

  return (
    <a 
      href={googleBusinessUrl}
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex flex-col items-center space-y-2.5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00209F]/30 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer max-w-sm"
      title={isEn ? "Write a review on Google" : "Laissez un avis sur Google"}
      onMouseLeave={() => setHoverRating(0)}
    >
      {/* 5-Star interactive review block with hover fill and custom gradient */}
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((starNum) => {
          const isFilled = hoverRating >= starNum;
          return (
            <div
              key={starNum}
              onMouseEnter={() => setHoverRating(starNum)}
              className="relative transition-transform duration-300 hover:scale-125"
            >
              <Star 
                className="w-8 h-8 transition-all duration-300"
                stroke={isFilled ? "url(#star-gradient)" : "rgba(255,255,255,0.25)"}
                fill={isFilled ? "url(#star-gradient)" : "transparent"}
                strokeWidth={isFilled ? 1.5 : 2}
              />
            </div>
          );
        })}
      </div>
      <div className="text-sm font-display font-medium text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-red-400 transition-colors duration-300 flex items-center space-x-1">
        <span>{isEn ? "Rate us on Google Business" : "Notez-nous sur Google Business"}</span>
      </div>
      <div className="text-[11px] text-zinc-500 font-mono">
        {isEn ? "Direct Link to Google Reviews" : "Lien direct vers Google My Business"}
      </div>
    </a>
  );
};

