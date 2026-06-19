import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Clock, CheckSquare, Plus, Ticket, ArrowRight, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EVENTS_DATA, EventItem } from "../data/staticData";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SEO } from "../components/SEO/SEO";
import { getOrganizationSchema } from "../utils/seoSchemas";

export const Events: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [activeRsvpEvent, setActiveRsvpEvent] = useState<EventItem | null>(null);
  const [rsvpInfo, setRsvpInfo] = useState({ name: "", email: "", seatStyle: "physique" });
  const [ticketIssued, setTicketIssued] = useState<boolean>(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpInfo.name || !rsvpInfo.email) return;

    setTicketIssued(true);
  };

  const closeRsvpModal = () => {
    setActiveRsvpEvent(null);
    setTicketIssued(false);
    setRsvpInfo({ name: "", email: "", seatStyle: "physique" });
  };

  // High fidelity translations for hardcoded static records inside EVENTS_DATA
  const getTranslatedEvent = (evo: EventItem) => {
    if (!isEn) return evo;

    const englishEvents: { [key: string]: { title: string; description: string; location: string; type: string } } = {
      "hackathon-esih": {
        title: "Haitian Dev Hackathon — ESIH",
        description: "24 hours of interactive live coding. Build innovative web platforms, customized widgets, and fintech prototypes.",
        location: "ESIH Campus, Port-au-Prince, Haiti",
        type: "Physical Session"
      },
      "webinar-moncash": {
        title: "Mastering MonCash Secure Flows",
        description: "Live workshop showcasing how double webhooks and automated background crons protect merchant credit registers.",
        location: "Google Meet Interactive Stream",
        type: "100% Online"
      }
    };

    const eng = englishEvents[evo.id];
    if (eng) {
      return {
        ...evo,
        title: eng.title,
        description: eng.description,
        location: eng.location,
        type: eng.type
      };
    }

    return evo;
  };

  const activeRsvpTrans = activeRsvpEvent ? getTranslatedEvent(activeRsvpEvent) : null;

  return (
    <div className="py-16 bg-zinc-950 relative overflow-hidden dot-grid min-h-[90vh]">
      <SEO
        title={isEn ? "Tech Events & Software Workshops — HaitianDev" : "Événements Tech & Ateliers Logiciels — HaitianDev"}
        description={isEn 
          ? "Reserve your free seat for our upcoming software engineering conferences, MonCash fintech webinars, and AI workshops in Port-au-Prince." 
          : "Réservez votre place pour nos prochains meetups, webinaires fintech MonCash et ateliers sur l'intelligence artificielle en Haïti."}
        schema={getOrganizationSchema()}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-955/5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
          <Link to="/" className="inline-flex items-center space-x-1 text-xs font-mono text-zinc-500 hover:text-white transition-colors">
            <span>{isEn ? "← Home" : "← Accueil"}</span>
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 pb-2 uppercase tracking-tight">
            {isEn ? "EVENTS" : "ÉVÉNEMENTS"}
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {isEn 
              ? "Workshops, hackathons, and meetups that gather the Haitian tech community — and connect it to global innovations." 
              : "Workshops, hackathons et meetups qui rassemblent la communauté tech haïtienne — et la connectent au monde."}
          </p>
        </div>

        {/* Schedule grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EVENTS_DATA.map((evo) => {
            const transEvo = getTranslatedEvent(evo);
            return (
              <Card
                key={evo.id}
                className="bg-zinc-900/15 border-zinc-900 p-8 flex flex-col justify-between h-full hover:border-zinc-800"
              >
                <div className="space-y-6 text-left">
                  {/* Meta info tags */}
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span className="text-blue-400 font-bold uppercase bg-blue-950/20 border border-blue-900/50 px-2.5 py-0.5 rounded">
                      {isEn ? `[Date: ${transEvo.date}]` : `[Date : ${transEvo.date}]`}
                    </span>
                    <span>{transEvo.time}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-extrabold text-white leading-tight">
                      {transEvo.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      {transEvo.description}
                    </p>
                  </div>

                  {/* Logistics */}
                  <div className="space-y-3 pt-4 border-t border-zinc-900/50 font-sans text-xs text-zinc-500">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                      <span>{transEvo.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                      <span>{isEn ? `Attendance format: ${transEvo.type}` : `Format : ${transEvo.type}`}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-8 text-left">
                  <Button variant="outline" size="sm" onClick={() => setActiveRsvpEvent(evo)} className="w-full justify-center cursor-pointer">
                    <span>{isEn ? "Join (RSVP)" : "Participer (RSVP)"}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Dynamic RSVP Digital Pass Ticket Overlay */}
        <AnimatePresence>
          {activeRsvpEvent && activeRsvpTrans && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-sm w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeRsvpModal}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white cursor-pointer z-50"
                >
                  <X className="w-4 h-4" />
                </button>

                {ticketIssued ? (
                  /* GRAPHICAL RSVP DIGI PASS TICKET */
                  <div className="p-8 text-center space-y-6 relative bg-linear-to-b from-blue-950/20 to-zinc-950">
                    <div className="absolute top-2 left-4 font-mono text-[8px] text-zinc-700 tracking-wider">HAITIANDEV-PASS</div>
                    
                    <Ticket className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">
                        {isEn ? "ACCESS PASS GRANTED" : "PASS ACCÈS CONFIRMÉ"}
                      </span>
                      <h3 className="font-display text-lg font-extrabold text-white">{activeRsvpTrans.title}</h3>
                      <p className="text-zinc-400 text-xs font-sans">
                        {isEn ? "Holders:" : "Détenteur :"} <strong>{rsvpInfo.name}</strong>
                      </p>
                    </div>

                    {/* Barcode line mock */}
                    <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-3 font-mono text-[10px] text-zinc-500">
                      <div className="flex justify-between">
                        <span>{isEn ? "FORMAT:" : "FORMAT :"}</span>
                        <span className="text-white font-bold">
                          {rsvpInfo.seatStyle === "physique" 
                            ? (isEn ? "PHYSICAL SEAT" : "PRÉSENTIEL") 
                            : (isEn ? "VIRTUAL STREAM" : "VIRTUEL")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isEn ? "DATE:" : "DATE :"}</span>
                        <span className="text-white font-bold">{activeRsvpTrans.date}</span>
                      </div>
                      <div className="border-t border-zinc-900/60 pt-3 flex flex-col space-y-1 items-center">
                        {/* Simulated barcode bars */}
                        <div className="h-8 w-full bg-zinc-900 flex justify-center items-center overflow-hidden gap-0.5 px-2">
                          {Array.from({ length: 48 }).map((_, bIdx) => (
                            <div
                              key={bIdx}
                              style={{ width: `${bIdx % 3 === 0 ? "2px" : "1px"}` }}
                              className="h-full bg-zinc-500/80 last:bg-zinc-700"
                            />
                          ))}
                        </div>
                        <span className="text-[8px] tracking-widest">HD-RSVP-{activeRsvpTrans.id}-OK</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-zinc-600">
                      {isEn 
                        ? `A confirmation seat voucher has been successfully dispatched to ${rsvpInfo.email}.`
                        : `Un bulletin de confirmation vous a été envoyé à ${rsvpInfo.email}.`}
                    </p>
                  </div>
                ) : (
                  /* SIGNUP FOR RSVP */
                  <div className="p-8 space-y-5 text-left">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest block font-bold">
                        {isEn ? "CLAIM YOUR PASS" : "RÉSERVEZ VOTRE PLACE"}
                      </span>
                      <h3 className="font-display text-lg font-extrabold text-white leading-tight">{activeRsvpTrans.title}</h3>
                      <p className="text-zinc-500 text-xs">
                        {isEn ? "Register credentials below to validate tickets." : "Saisissez vos coordonnées pour valider votre RSVP."}
                      </p>
                    </div>

                    <form onSubmit={handleRsvpSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                          {isEn ? "Full Name" : "Nom complet"}
                        </label>
                        <input
                          type="text"
                          required
                          value={rsvpInfo.name}
                          onChange={(e) => setRsvpInfo((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder={isEn ? "Toussaint Louverture" : "Jean-Jacques"}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-750 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                          {isEn ? "Email Address" : "Adresse Email"}
                        </label>
                        <input
                          type="email"
                          required
                          value={rsvpInfo.email}
                          onChange={(e) => setRsvpInfo((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="client@mail.com"
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-750 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-zinc-500 font-semibold">
                          {isEn ? "Attendance Format" : "Type de participation"}
                        </label>
                        <select
                          value={rsvpInfo.seatStyle}
                          onChange={(e) => setRsvpInfo((prev) => ({ ...prev, seatStyle: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                        >
                          <option value="physique">
                            {isEn ? "Physical Presence (Reserved Seat)" : "Présence Physique (Siège réservé)"}
                          </option>
                          <option value="virtuel">
                            {isEn ? "Virtual Online Stream Only" : "Stream Virtuel en ligne uniquement"}
                          </option>
                        </select>
                      </div>

                      <Button type="submit" variant="secondary" size="md" className="w-full pt-2 cursor-pointer font-bold tracking-wider text-xs uppercase">
                        {isEn ? "Generate my Access Pass" : "Générer mon Pass d'entrée"}
                      </Button>
                    </form>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
